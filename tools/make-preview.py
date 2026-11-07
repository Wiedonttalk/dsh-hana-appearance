"""Render docs/themes.png — a palette sheet for all bundled themes.

Dev-only helper (needs Pillow):  python tools/make-preview.py
"""
from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
THEMES = json.loads((ROOT / "src" / "themes.generated.json").read_text(encoding="utf-8"))
OUT = ROOT / "docs" / "themes.png"

FONT_CJK = "C:/Windows/Fonts/msyh.ttc"
FONT_CJK_BOLD = "C:/Windows/Fonts/msyhbd.ttc"
FONT_SERIF = "C:/Windows/Fonts/simsun.ttc"

MARGIN = 28
GAP = 16
CARD_W = 368
CARD_H = 190
TOP = 76
COLS = 3
ROWS = math.ceil(len(THEMES) / COLS)
WIDTH = MARGIN * 2 + CARD_W * COLS + GAP * (COLS - 1)
HEIGHT = TOP + MARGIN + CARD_H * ROWS + GAP * (ROWS - 1)


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def hex_rgb(value: str, fallback: tuple[int, int, int]) -> tuple[int, int, int]:
    try:
        value = value.strip()
        if value.startswith("#") and len(value) >= 7:
            return (int(value[1:3], 16), int(value[3:5], 16), int(value[5:7], 16))
    except ValueError:
        pass
    return fallback


def rgba(value: str, fallback: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    try:
        value = value.strip()
        if value.startswith("#"):
            if len(value) == 9:
                return (
                    int(value[1:3], 16),
                    int(value[3:5], 16),
                    int(value[5:7], 16),
                    int(value[7:9], 16),
                )
            if len(value) == 7:
                return (int(value[1:3], 16), int(value[3:5], 16), int(value[5:7], 16), 255)
        if value.startswith("rgba"):
            parts = value[value.find("(") + 1 : value.rfind(")")].split(",")
            r, g, b = (int(float(p)) for p in parts[:3])
            a = int(float(parts[3]) * 255) if len(parts) > 3 else 255
            return (r, g, b, a)
        if value.startswith("rgb"):
            parts = value[value.find("(") + 1 : value.rfind(")")].split(",")
            return (int(float(parts[0])), int(float(parts[1])), int(float(parts[2])), 255)
    except (ValueError, IndexError):
        pass
    return fallback


def main() -> None:
    img = Image.new("RGB", (WIDTH, HEIGHT), (248, 244, 237))
    draw = ImageDraw.Draw(img)

    draw.text((MARGIN, 18), "dsh-hana-appearance", font=font(FONT_SERIF, 26), fill=(42, 38, 34))
    draw.text(
        (MARGIN, 50),
        f"{len(THEMES)} themes ported from HanaAgent  ·  DeepSeek Harness appearance plugin",
        font=font(FONT_CJK, 12),
        fill=(110, 104, 96),
    )

    for index, theme in enumerate(THEMES):
        tokens = theme["tokens"]
        paper = hex_rgb(theme["pageColor"], (248, 244, 237))
        ink = hex_rgb(tokens.get("--dsw-alias-label-primary", ""), (42, 38, 34))
        muted = hex_rgb(tokens.get("--dsw-alias-label-tertiary", ""), (76, 70, 63))
        accent = rgba(tokens.get("--dsw-alias-brand-primary", ""), (83, 125, 150, 255))
        border = rgba(tokens.get("--dsw-alias-border-l2", ""), (216, 207, 190, 255))

        col, row = index % COLS, index // COLS
        x = MARGIN + col * (CARD_W + GAP)
        y = TOP + row * (CARD_H + GAP)

        # paper surface + hairline border
        draw.rounded_rectangle((x, y, x + CARD_W, y + CARD_H), radius=12, fill=paper)
        draw.rounded_rectangle((x, y, x + CARD_W, y + CARD_H), radius=12, outline=border[:3], width=1)

        # accent chip + label
        draw.rounded_rectangle((x + 20, y + 20, x + 52, y + 52), radius=8, fill=accent[:3])
        draw.text((x + 66, y + 20), theme["name"], font=font(FONT_CJK_BOLD, 19), fill=ink)
        draw.text((x + 66, y + 46), theme["mode"], font=font(FONT_CJK, 12), fill=muted)

        # sample sentence in the theme ink
        draw.text((x + 20, y + 84), "永和九年，岁在癸丑。", font=font(FONT_SERIF, 21), fill=ink)
        draw.text((x + 20, y + 116), "The quick brown fox jumps over the lazy dog.", font=font(FONT_SERIF, 11), fill=muted)

        # token id footer
        draw.text((x + 20, y + 158), theme["id"], font=font(FONT_CJK, 11), fill=muted)

        # small color dots: layer-1 / border / accent
        dots = [
            rgba(tokens.get("--dsw-alias-bg-layer-1", ""), (251, 247, 238, 255)),
            border,
            accent,
        ]
        for dot_index, color in enumerate(dots):
            cx = x + CARD_W - 26 - dot_index * 22
            draw.ellipse((cx - 7, y + CARD_H - 30, cx + 7, y + CARD_H - 16), fill=color[:3], outline=(0, 0, 0, 0))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "PNG", optimize=True)
    print(f"wrote {OUT.relative_to(ROOT)} ({img.width}x{img.height})")


if __name__ == "__main__":
    main()
