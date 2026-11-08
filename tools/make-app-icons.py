"""Regenerate the HanaUI app icons with rounded-square corners.

The settings page draws the previews with CSS `border-radius`, but a Windows
shortcut renders the ICO exactly as shipped, so the square cream canvas used to
show up on the desktop/taskbar. This script bakes the same 25% corner radius into
the PNG previews and the multi-size ICOs (transparent corners).

Sources are the repo's 1024x1024 `lib/assets/icons/*.png`; running it again is
idempotent (the alpha mask only ever multiplies).

Run: python tools/make-app-icons.py
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
ICON_DIR = ROOT / "lib" / "assets" / "icons"
ICO_DIR = ROOT / "lib" / "assets" / "app-icons"
BASE_SIZE = 1024
RADIUS_RATIO = 0.25
ICO_SIZES = [(256, 256), (128, 128), (96, 96), (64, 64), (48, 48), (40, 40), (32, 32), (24, 24), (16, 16)]


def rounded_mask(size: int, radius: int, supersample: int = 4) -> Image.Image:
    """Antialiased rounded-square mask: white inside, transparent outside."""
    big = size * supersample
    mask = Image.new("L", (big, big), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, big - 1, big - 1), radius=radius * supersample, fill=255)
    return mask.resize((size, size), Image.LANCZOS)


def main() -> None:
    icons = sorted(ICON_DIR.glob("*.png"))
    if not icons:
        raise SystemExit(f"no source icons under {ICON_DIR}")
    radius = round(BASE_SIZE * RADIUS_RATIO)
    for path in icons:
        image = Image.open(path).convert("RGBA")
        if image.size != (BASE_SIZE, BASE_SIZE):
            image = image.resize((BASE_SIZE, BASE_SIZE), Image.LANCZOS)
        mask = rounded_mask(BASE_SIZE, radius)
        image.putalpha(ImageChops.multiply(image.getchannel("A"), mask))
        image.save(path, "PNG", optimize=True)
        ico = ICO_DIR / f"{path.stem}.ico"
        image.save(ico, format="ICO", sizes=ICO_SIZES)
        print(f"{path.name}: rounded png ({path.stat().st_size:,} B) -> {ico.name} ({ico.stat().st_size:,} B)")


if __name__ == "__main__":
    main()
