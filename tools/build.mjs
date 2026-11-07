// Build script: compose lib/client.js from src/client.template.js.
//
// Theme data comes from HanaAgent's desktop/src/themes/*.css when a checkout is
// available (see `themeSourceDirs`). In a plain clone of this repo that source
// tree is absent, so the build falls back to the committed
// src/themes.generated.json — the same data, checked in on purpose so the repo
// is buildable and installable without the upstream project.
//
// Run with: node tools/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const GENERATED = join(ROOT, 'src', 'themes.generated.json')

/** Candidate HanaAgent source checkouts, newest layout first. */
const themeSourceDirs = [
  process.env.HANA_SRC ? join(process.env.HANA_SRC, 'desktop', 'src', 'themes') : null,
  join(ROOT, '..', '..', 'refs', 'hana-src', 'desktop', 'src', 'themes'),
].filter((dir) => dir !== null)

/** Resolve where the raw theme CSS lives, or null for the committed snapshot. */
function findThemeDir() {
  for (const dir of themeSourceDirs) {
    if (existsSync(join(dir, 'warm-paper.css'))) return dir
  }
  return null
}


const CATALOG = [
  { id: 'warm-paper', file: 'warm-paper.css', name: '暖纸', mode: '白天', colorScheme: 'light' },
  { id: 'midnight', file: 'midnight.css', name: '青夜', mode: '夜间', colorScheme: 'dark' },
  { id: 'high-contrast', file: 'high-contrast.css', name: '素白', mode: '高对比', colorScheme: 'light' },
  { id: 'grass-aroma', file: 'grass-aroma.css', name: '草香', mode: 'Butter', colorScheme: 'light' },
  { id: 'contemplation', file: 'contemplation.css', name: '沉思', mode: 'Ming', colorScheme: 'light' },
  { id: 'absolutely', file: 'absolutely.css', name: 'Absolutely', mode: '有一点点熟悉', colorScheme: 'light' },
  { id: 'delve', file: 'delve.css', name: '随时准备接住你', mode: '探究一下', colorScheme: 'light' },
  { id: 'deep-think', file: 'deep-think.css', name: '用户彻底怒了', mode: '小鲸鱼', colorScheme: 'light' },
  { id: 'new-warm-paper', file: 'new-warm-paper.css', name: '新暖纸', mode: '纸本', colorScheme: 'light' },
  { id: 'midnight-contrast', file: 'midnight-contrast.css', name: '青夜·高对比', mode: '清晰', colorScheme: 'dark' },
  { id: 'coral', file: 'coral.css', name: '珊瑚', mode: '春日和纸', colorScheme: 'light' },
]

const LIGHT_FALLBACK = { paper: '#F8F4ED', ink: '#2A2622' }
const DARK_FALLBACK = { paper: '#3B4A54', ink: '#EDE8DE' }

/** Parse `--var: value;` pairs inside the theme's first `[data-theme]` block. */
function parseThemeVars(css, themeId) {
  let block = null
  const exact = new RegExp('\\[data-theme="' + themeId + '"\\][^{]*\\{([\\s\\S]*?)\\n\\}')
  const match = exact.exec(css)
  if (match) {
    block = match[1]
  } else {
    const any = /\[data-theme="[^"]+"\][^{]*\{([\s\S]*?)\n\}/.exec(css)
    block = any ? any[1] : css
  }
  const vars = {}
  const reVar = /--([A-Za-z0-9-]+)\s*:\s*([^;]+);/g
  let m
  while ((m = reVar.exec(block)) !== null) vars[m[1]] = m[2].trim()
  return vars
}

/** Parse #rgb / #rrggbb / #rrggbbaa / rgb() / rgba() into an RGBA object. */
function parseColor(value) {
  if (typeof value !== 'string') return null
  const v = value.trim()
  let m
  if ((m = /^#([0-9a-f]{3,8})$/i.exec(v)) !== null) {
    let hex = m[1]
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1
    return { r, g, b, a }
  }
  if ((m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)$/i.exec(v)) !== null) {
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a: m[4] === undefined ? 1 : Number(m[4]) }
  }
  return null
}

const isSolid = (c) => c !== null && c.a >= 0.999

function toCss(color) {
  const r = Math.round(color.r)
  const g = Math.round(color.g)
  const b = Math.round(color.b)
  if (isSolid(color)) return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0').toUpperCase()).join('')
  return `rgba(${r}, ${g}, ${b}, ${Number(color.a.toFixed(3))})`
}

function mix(a, b, t) {
  return { r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t, a: 1 }
}

function alpha(color, a) {
  return { r: color.r, g: color.g, b: color.b, a }
}

function pick(vars, name, fallback) {
  return parseColor(vars[name]) ?? fallback
}

/** Build the complete --dsw-* token map for one Hana palette. */
function buildTokens(vars, colorScheme) {
  const dark = colorScheme === 'dark'
  const base = dark ? DARK_FALLBACK : LIGHT_FALLBACK
  const white = { r: 255, g: 255, b: 255, a: 1 }

  const paper = pick(vars, 'bg', parseColor(base.paper))
  const card = pick(vars, 'bg-card', mix(paper, white, dark ? 0.06 : 0.5))
  const _glass = pick(vars, 'bg-glass', card)
  const sidebar = pick(vars, 'sidebar-bg', mix(paper, { r: 0, g: 0, b: 0, a: 1 }, 0.04))
  const ink = pick(vars, 'text', parseColor(base.ink))
  const ink2 = pick(vars, 'text-light', mix(ink, paper, 0.25))
  const ink3 = pick(vars, 'text-muted', mix(ink, paper, 0.5))
  const line = pick(vars, 'border', mix(ink, paper, 0.78))
  const accent = pick(vars, 'accent', { r: 83, g: 125, b: 150, a: 1 })
  const accentHover = pick(vars, 'accent-hover', mix(accent, ink, 0.25))
  const accentLight = pick(vars, 'accent-light', alpha(accent, dark ? 0.16 : 0.1))
  const userBg = pick(vars, 'user-bg', alpha(accent, dark ? 0.28 : 0.1))
  const toolBg = pick(vars, 'tool-bg', alpha(ink, dark ? 0.1 : 0.04))
  const green = pick(vars, 'green', { r: 74, g: 107, b: 74, a: 1 })
  const danger = pick(vars, 'danger', pick(vars, 'coral', { r: 139, g: 44, b: 31, a: 1 }))
  const warn = pick(vars, 'warn', { r: 176, g: 128, b: 42, a: 1 })

  const tokens = {
    // surfaces
    '--dsw-alias-bg-base': toCss(paper),
    '--dsw-alias-bg-layer-1': toCss(card),
    '--dsw-alias-bg-layer-2': toCss(mix(card, paper, dark ? 0.12 : 0.2)),
    '--dsw-alias-bg-layer-3': toCss(mix(card, paper, dark ? 0.24 : 0.4)),
    '--dsw-alias-bg-overlay': toCss(card),
    '--dsw-alias-bg-module-platform': toCss(paper),
    '--dsw-alias-bg-multi-select': toCss(accentLight),
    '--dsw-alias-bg-skeleton': toCss(alpha(ink, 0.08)),
    '--dsw-alias-bg-mask-1': toCss(alpha(paper, 0.35)),
    '--dsw-alias-bg-mask-2': toCss(alpha(paper, 0.6)),
    '--dsw-alias-bg-mask-3': toCss(alpha(paper, 0.78)),
    '--dsw-alias-bg-mask-photo': toCss(alpha(paper, 0.55)),
    '--dsw-alias-bg-mask-drop': toCss(alpha(paper, 0.75)),
    // borders
    '--dsw-alias-border-l1': toCss(line),
    '--dsw-alias-border-l2': toCss(line),
    '--dsw-alias-border-l3': toCss(mix(line, ink, 0.18)),
    '--dsw-alias-border-l4': toCss(mix(line, ink, 0.32)),
    '--dsw-alias-border-l2-darkmode-thin': toCss(line),
    '--dsw-alias-border-inverted': toCss(paper),
    '--dsw-alias-border-inverted2': toCss(paper),
    '--dsw-alias-separator-primary': toCss(line),
    // labels
    '--dsw-alias-label-primary': toCss(ink),
    '--dsw-alias-label-secondary': toCss(ink2),
    '--dsw-alias-label-tertiary': toCss(ink3),
    '--dsw-alias-label-caption': toCss(ink3),
    '--dsw-alias-label-dimmed': toCss(alpha(ink3, 0.75)),
    '--dsw-alias-label-primary-bluish': toCss(ink),
    '--dsw-alias-label-primary-dimmed': toCss(ink2),
    '--dsw-alias-label-primary-foreground': toCss(paper),
    '--dsw-alias-label-primary-inverted': toCss(paper),
    // brand / buttons
    '--dsw-alias-brand-primary': toCss(accent),
    '--dsw-alias-brand-primary-invert': toCss(paper),
    '--dsw-alias-brand-primary-new-colorprimary-new-color': toCss(accent),
    '--dsw-alias-brand-text': '#FFFFFF',
    '--dsw-alias-button-primary-fill': toCss(accent),
    '--dsw-alias-button-primary-hover': toCss(accentHover),
    '--dsw-alias-button-primary-dimmed': toCss(accentLight),
    '--dsw-alias-button-elevated-fill': toCss(card),
    '--dsw-alias-button-floating-fill': toCss(card),
    '--dsw-alias-button-floating-hover': toCss(mix(card, ink, 0.05)),
    '--dsw-alias-button-ghost-active-border': toCss(accent),
    '--dsw-alias-button-ghost-active-fill': toCss(accentLight),
    '--dsw-alias-button-ghost-active-hover': toCss(alpha(accent, 0.16)),
    '--dsw-alias-button-contrast-fill': toCss(ink),
    '--dsw-alias-button-info-fill': toCss(accent),
    '--dsw-alias-button-info-hover': toCss(accentHover),
    '--dsw-alias-button-tool-bar-fill': toCss(card),
    '--dsw-alias-button-tool-bar-fill-invisible': 'transparent',
    '--dsw-alias-button-tool-bar-hover': toCss(alpha(ink, 0.06)),
    // states
    '--dsw-alias-state-business-primary': toCss(accent),
    '--dsw-alias-state-business-tertiary': toCss(accentLight),
    '--dsw-alias-state-error-primary': toCss(danger),
    '--dsw-alias-state-error-secondary': toCss(alpha(danger, 0.6)),
    '--dsw-alias-state-success-primary': toCss(green),
    '--dsw-alias-state-success-secondary': toCss(alpha(green, 0.6)),
    '--dsw-alias-state-success-tertiary': toCss(alpha(green, 0.16)),
    '--dsw-alias-state-warn-label': toCss(warn),
    '--dsw-alias-state-warn-primary': toCss(warn),
    '--dsw-alias-state-warn-secondary': toCss(alpha(warn, 0.6)),
    '--dsw-alias-state-warn-tertiary': toCss(alpha(warn, 0.16)),
    // interaction
    '--dsw-alias-interactive-bg-hover': toCss(alpha(ink, 0.05)),
    '--dsw-alias-interactive-bg-active': toCss(alpha(ink, 0.09)),
    '--dsw-alias-interactive-bg-hover-accent': toCss(alpha(accent, 0.1)),
    '--dsw-alias-interactive-bg-hover-danger': toCss(alpha(danger, 0.1)),
    '--dsw-alias-interactive-bg-hover-solid': toCss(alpha(ink, 0.08)),
    // markdown
    '--dsw-alias-markdown-code-block': toCss(toolBg),
    '--dsw-alias-markdown-code-block-banner': toCss(alpha(ink, dark ? 0.06 : 0.04)),
    '--dsw-alias-markdown-code-segment-selected': toCss(alpha(ink, 0.1)),
    '--dsw-alias-markdown-code-segment-unselected': 'transparent',
    '--dsw-alias-markdown-citation': toCss(accentLight),
    '--dsw-alias-markdown-inline-code': toCss(toolBg),
    '--dsw-alias-markdown-placeholder': toCss(ink3),
    '--dsw-alias-markdown-tag': toCss(accentLight),
    // misc
    '--dsw-alias-toast-bg': toCss(card),
    '--dsw-alias-tooltip-bg': toCss(dark ? card : ink),
    '--dsw-alias-scrollbar-bg-l1': toCss(alpha(ink, 0.08)),
    '--dsw-alias-scrollbar-bg-l2': toCss(alpha(ink, 0.12)),
    '--dsw-alias-scrollbar-hover-l1': toCss(alpha(ink, 0.16)),
    '--dsw-alias-scrollbar-hover-l2': toCss(alpha(ink, 0.22)),
    // specific surfaces
    '--dsw-specific-sidebar-fill': toCss(sidebar),
    '--dsw-specific-sidebar-nav-item-active': toCss(accentLight),
    '--dsw-specific-sidebar-nav-item-active-accent': toCss(accent),
    '--dsw-specific-sidebar-nav-item-hover': toCss(alpha(ink, 0.05)),
    '--dsw-specific-bubble': toCss(userBg),
    '--dsw-specific-bubble-highlight': toCss(alpha(accent, 0.2)),
    '--dsw-specific-input-major': toCss(card),
    '--dsw-specific-login-input': toCss(card),
    '--dsw-specific-menu': toCss(card),
    '--dsw-specific-selector': toCss(card),
    '--dsw-specific-tip': toCss(card),
    // code highlighting
    '--shiki-background': toCss(toolBg),
    '--shiki-foreground': toCss(ink),
    '--shiki-token-constant': toCss(accent),
    '--shiki-token-string': toCss(green),
    '--shiki-token-comment': toCss(alpha(ink3, 0.9)),
    '--shiki-token-keyword': toCss(mix(accent, ink, dark ? 0.25 : 0.1)),
    '--shiki-token-parameter': toCss(ink2),
    '--shiki-token-function': toCss(mix(accent, ink, dark ? 0.15 : 0.05)),
    '--shiki-token-string-expression': toCss(green),
    '--shiki-token-punctuation': toCss(ink3),
    '--shiki-token-link': toCss(accent),
    '--shiki-token-inserted': toCss(green),
    '--shiki-token-deleted': toCss(danger),
    '--shiki-token-changed': toCss(warn),
  }
  return { tokens, pageColor: toCss(paper) }
}

/** Regenerate theme data from the upstream CSS checkouts, if present. */
function buildThemesFromSource() {
  const THEME_DIR = findThemeDir()
  if (THEME_DIR === null) return null
  const themes = []
  for (const entry of CATALOG) {
    const file = join(THEME_DIR, entry.file)
    if (!existsSync(file)) {
      console.warn('missing theme css:', file)
      continue
    }
    const css = readFileSync(file, 'utf8')
    const vars = parseThemeVars(css, entry.id)
    const { tokens, pageColor } = buildTokens(vars, entry.colorScheme)
    themes.push({
      id: 'hana-' + entry.id,
      name: entry.name,
      mode: entry.mode,
      colorScheme: entry.colorScheme,
      pageColor,
      tokens,
    })
  }
  return themes.length === CATALOG.length ? themes : null
}

/** Read the committed theme snapshot (the published repo's source of truth). */
function readThemesSnapshot() {
  return JSON.parse(readFileSync(GENERATED, 'utf8'))
}

const sourceThemes = buildThemesFromSource()
const themes = sourceThemes ?? readThemesSnapshot()
if (sourceThemes !== null) {
  writeFileSync(GENERATED, JSON.stringify(themes, null, 2), 'utf8')
  console.log(`theme data regenerated from ${findThemeDir()} → src/themes.generated.json`)
} else {
  console.log('HanaAgent theme sources not found; using committed src/themes.generated.json')
}

const template = readFileSync(join(ROOT, 'src', 'client.template.js'), 'utf8')
const pageCss = readFileSync(join(ROOT, 'src', 'page.css'), 'utf8')
if (!template.includes('__THEMES_JSON__') || !template.includes('__PAGE_CSS__')) {
  throw new Error('src/client.template.js is missing the __THEMES_JSON__ / __PAGE_CSS__ placeholders')
}
const client = template
  .replace('__THEMES_JSON__', JSON.stringify(themes))
  .replace('__PAGE_CSS__', JSON.stringify(pageCss))
writeFileSync(join(ROOT, 'lib', 'client.js'), client, 'utf8')

console.log(`built ${themes.length} themes → lib/client.js (${client.length} bytes)`)
for (const theme of themes) {
  console.log(`  ${theme.id}  ${theme.name}  ${theme.colorScheme}  ${theme.pageColor}  tokens=${Object.keys(theme.tokens).length}`)
}
