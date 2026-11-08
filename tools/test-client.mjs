// Smoke test for the browser half without a real DSH shell: stub react,
// document, localStorage and a fake cordis context, then exercise the plugin
// body (theme registration, HanaUI settings page registration, state
// application and theme switching).
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const code = readFileSync(join(ROOT, 'lib', 'client.js'), 'utf8')

const React = {
  createElement: (type, props, ...children) => {
    const merged = { ...(props ?? {}) }
    if (children.length > 0) merged.children = children.length === 1 ? children[0] : children
    return { type, props: merged, children }
  },
  useState: (init) => [typeof init === 'function' ? init() : init, () => {}],
  useEffect: (fn) => {
    const disposer = fn()
    if (typeof disposer === 'function') React.__cleanups.push(disposer)
  },
  useSyncExternalStore: (subscribe, getSnapshot) => getSnapshot(),
  __cleanups: [],
}

const jsxRuntime = {
  jsx: (type, props, key) => ({ type, props: props ?? {}, key }),
  jsxs: (type, props, key) => ({ type, props: props ?? {}, key }),
}

const createdEls = []
const headChildren = []
const bodyChildren = []
const htmlAttributes = new Map()
const htmlStyleVars = new Map()

const makeEl = () => {
  const el = {
    id: '',
    className: '',
    textContent: '',
    children: [],
    removed: false,
    appendChild(child) {
      this.children.push(child)
    },
    remove() {
      this.removed = true
    },
  }
  createdEls.push(el)
  return el
}

const document = {
  createElement: () => makeEl(),
  head: { appendChild: (el) => headChildren.push(el) },
  body: {
    hasAttribute: () => false,
    appendChild: (el) => bodyChildren.push(el),
  },
  documentElement: {
    setAttribute: (name, value) => htmlAttributes.set(name, value),
    removeAttribute: (name) => htmlAttributes.delete(name),
    getAttribute: (name) => htmlAttributes.get(name) ?? null,
    style: { setProperty: (name, value) => htmlStyleVars.set(name, value) },
  },
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {},
  removeEventListener: () => {},
}

const storage = new Map()
const localStorage = {
  getItem: (k) => (storage.has(k) ? storage.get(k) : null),
  setItem: (k, v) => storage.set(k, String(v)),
}

let capturedLoader = null
const window = {
  localStorage,
  __ModuleLoader__: { load: (opts) => { capturedLoader = opts } },
}

const fetchLog = []
let appIconApplied = null
const fetchStub = async (url, init) => {
  fetchLog.push([url, init])
  if (url === '/api/hana-appearance/app-icon') {
    if (init?.method === 'POST') {
      const body = JSON.parse(init.body)
      appIconApplied = body.iconId === 'default' ? null : body.iconId
      return { ok: true, json: async () => ({ ok: true, supported: true, applied: appIconApplied, updated: 4, failed: 0 }) }
    }
    return { ok: true, json: async () => ({ ok: true, supported: true, applied: appIconApplied }) }
  }
  return { ok: true, json: async () => ({}) }
}

new Function('window', 'document', 'localStorage', 'fetch', code)(window, document, localStorage, fetchStub)

if (capturedLoader === null) throw new Error('client bundle never called __ModuleLoader__.load')
console.log('loader id:', capturedLoader.id)

const requireStub = (id) => {
  if (id === 'react') return React
  if (id === 'react/jsx-runtime') return jsxRuntime
  throw new Error('unexpected require: ' + id)
}
const mod = capturedLoader.factory(requireStub)

const assert = (cond, message) => {
  if (!cond) throw new Error('ASSERT FAILED: ' + message)
  console.log('ok -', message)
}

assert(Array.isArray(mod.THEMES) && mod.THEMES.length === 11, '11 themes exported')
assert(mod.THEMES.every((theme) => theme.tokens && theme.tokens['--dsw-alias-bg-base']), 'every theme carries --dsw-alias-bg-base')
assert(Array.isArray(mod.inject) && mod.inject.includes('slots') && mod.inject.includes('theme'), 'inject declares slots + theme')
assert(typeof mod.apply === 'function', 'apply exported')

const registeredThemes = []
const setThemeCalls = []
const changeHandlers = []
const slotRegistrations = []
let currentPreference = 'system'

const dispatchThemeChange = (preference) => {
  currentPreference = preference
  for (const handler of changeHandlers) handler({ preference })
}

const localeListeners = []
const setLocaleCalls = []
const localeOptions = [
  { id: 'zh-CN', label: '简体中文' },
  { id: 'en-US', label: 'English' },
]
let currentLocale = 'zh-CN'
const localeFace = {
  getSnapshot: () => ({ active: currentLocale, locales: localeOptions, revision: 1 }),
  subscribe: (fn) => {
    localeListeners.push(fn)
    return () => {}
  },
  setLocale: (id) => {
    setLocaleCalls.push(id)
    currentLocale = id
    for (const listener of localeListeners) listener()
  },
}

const ctx = {
  get: (name) => (name === 'locale' ? localeFace : undefined),
  theme: {
    register: (skin) => {
      registeredThemes.push(skin)
      return () => {}
    },
    getTheme: () => ({ preference: currentPreference }),
    setTheme: (id) => {
      setThemeCalls.push(id)
      dispatchThemeChange(id)
    },
  },
  effect: (cb) => {
    const disposer = cb()
    return () => {}
  },
  on: (event, handler) => {
    if (event === 'theme/change') changeHandlers.push(handler)
  },
  slots: {
    inject: (name, callback) => {
      const result = callback()
      return result
    },
    register: (definition, component) => {
      slotRegistrations.push({ definition, component })
      return { dispose() {} }
    },
  },
}

mod.apply(ctx)
assert(registeredThemes.length === 11, '11 themes registered into the theme runtime')
assert(registeredThemes[0].id === 'hana-warm-paper', 'first registered theme is hana-warm-paper')

const page = slotRegistrations.find((entry) => entry.definition.name === 'settings.section')
assert(page !== undefined, 'settings.section page registered')
assert(page.definition.id === 'hana-ui', 'settings.section id is hana-ui')
assert(page.definition.order === 20, 'settings.section order is 20 (before IM机器人 at 21)')
assert(typeof page.definition.label === 'function' && page.definition.label() === 'HanaUI', 'nav label is HanaUI')
assert(typeof page.component === 'function', 'settings page component is a function')

const icon = slotRegistrations.find((entry) => entry.definition.name === 'settings.section.icon')
assert(icon !== undefined && icon.definition.id === 'hana-ui', 'nav icon registered for hana-ui')

const dynamicStyle = createdEls.find((el) => el.id === 'dsh-hana-appearance-style')
assert(dynamicStyle !== undefined && dynamicStyle.textContent.includes('font-family'), 'font CSS painted at boot')
assert(bodyChildren.some((el) => el.className === 'hana-paper-layer'), 'paper texture layer mounted')

const tree = page.component()
assert(tree !== null && tree !== undefined, 'settings page component renders')

const findAll = (node, predicate, acc = []) => {
  if (node === null || typeof node !== 'object') return acc
  if (predicate(node)) acc.push(node)
  const children = node.children
  if (Array.isArray(children)) for (const child of children) findAll(child, predicate, acc)
  else if (children !== undefined) findAll(children, predicate, acc)
  return acc
}

// Shallow-render function components so controls nested in props (e.g. a
// settings row's `control`) become visible to the tree search.
const renderTree = (node) => {
  if (Array.isArray(node)) return node.map(renderTree)
  if (node === null || typeof node !== 'object') return node
  if (typeof node.type === 'function') return renderTree(node.type(node.props))
  return { ...node, children: (node.children ?? []).map(renderTree) }
}

const themeCard = findAll(tree, (node) => node.props && node.props.theme && node.props.theme.id === 'hana-warm-paper')[0]
assert(themeCard !== undefined && typeof themeCard.props.onSelect === 'function', 'theme card for warm-paper found')
themeCard.props.onSelect()
assert(setThemeCalls.includes('hana-warm-paper'), 'clicking a theme card applies ctx.theme.setTheme')
assert(JSON.parse(storage.get('dsh-hana-appearance:state')).theme === 'hana-warm-paper', 'theme choice persisted to localStorage')

const autoCard = findAll(tree, (node) => typeof node.type === 'function' && node.type.name === 'AutoCard')[0]
assert(autoCard !== undefined, 'auto theme card found')
autoCard.props.onSelect()
assert(setThemeCalls.includes('system'), 'picking 自动 hands the runtime back to the built-in theme')

// Deep search over children, arrays and element props (controls live in props).
const deepFind = (node, predicate, seen = new Set()) => {
  if (node === null || typeof node !== 'object' || seen.has(node)) return null
  seen.add(node)
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = deepFind(item, predicate, seen)
      if (found !== null) return found
    }
    return null
  }
  if (predicate(node)) return node
  const children = Array.isArray(node.children) ? node.children : node.children !== undefined ? [node.children] : []
  for (const child of children) {
    const found = deepFind(child, predicate, seen)
    if (found !== null) return found
  }
  for (const value of Object.values(node.props ?? {})) {
    if (value !== null && typeof value === 'object') {
      const found = deepFind(value, predicate, seen)
      if (found !== null) return found
    }
  }
  return null
}

const textureNode = deepFind(tree, (node) => node.props && Array.isArray(node.props.options) && node.props.options.some((option) => option.value === 'rice'))
assert(textureNode !== undefined && typeof textureNode.props.onChange === 'function', 'paper texture segmented control found')
textureNode.props.onChange('rice')
assert(htmlAttributes.get('data-hana-paper-texture') === 'rice', 'paper texture attribute set to rice')
assert(htmlStyleVars.get('--paper-texture-strength') === '1', 'paper texture strength set from label 3 (1.0)')

// Real-effect wiring: DSH content typography vars + conversation width preference.
assert(dynamicStyle.textContent.includes('[data-slot^="conversation."]'), 'reading font is scoped to the conversation surface')
assert(dynamicStyle.textContent.includes('--dsh-font-family-text'), 'reading font goes through the DSH font hook variable')
assert(dynamicStyle.textContent.includes('--dsh-content-font-size: 14px'), 'chat body font size variable is written')
assert(dynamicStyle.textContent.includes('--dsh-content-font-delta: 0px'), 'chat body font delta variable is written')
assert(storage.get('dsh.conversation.contentWidth') === '720', 'chat width is written into DSH own width preference')
assert(htmlStyleVars.get('--dsh-content-font-size') === '14px', 'content font size variable applied to the live DOM')

const sizeNode = deepFind(tree, (node) => node.props && Array.isArray(node.props.options) && node.props.options.some((option) => option.label === '+1'))
assert(sizeNode !== undefined && typeof sizeNode.props.onChange === 'function', 'body font size segmented control found')
sizeNode.props.onChange(2)
assert(dynamicStyle.textContent.includes('--dsh-content-font-size: 16px'), 'font size +2 becomes 16px in DSH chat')
assert(dynamicStyle.textContent.includes('--dsh-content-font-delta: 2px'), 'font size +2 sets the delta to 2px')
assert(htmlStyleVars.get('--dsh-content-font-size') === '16px', 'font size +2 updates the live DOM variable')

const widthNode = deepFind(tree, (node) => node.props && Array.isArray(node.props.options) && node.props.options.some((option) => option.value === 'unlimited'))
assert(widthNode !== undefined && typeof widthNode.props.onChange === 'function', 'chat width segmented control found')
widthNode.props.onChange('unlimited')
assert(storage.get('dsh.conversation.contentWidth') === '99999', 'chat width 不限制 writes the wide preference')

// Language row: two-way sync with DSH's own locale runtime.
const stateAfterApply = JSON.parse(storage.get('dsh-hana-appearance:state'))
assert(stateAfterApply.language === 'zh-CN', 'language mirrored from the DSH locale at boot')
const languageNode = deepFind(tree, (node) => node.props && Array.isArray(node.props.options) && node.props.options.some((option) => option.value === 'en-US'))
assert(languageNode !== undefined && typeof languageNode.props.onChange === 'function', 'language dropdown sourced from DSH locale catalog')
languageNode.props.onChange('en-US')
assert(setLocaleCalls.includes('en-US'), 'picking a language calls the DSH locale runtime')
assert(JSON.parse(storage.get('dsh-hana-appearance:state')).language === 'en-US', 'picking a language stores the mirrored value')
currentLocale = 'zh-CN'
for (const listener of localeListeners) listener()
assert(JSON.parse(storage.get('dsh-hana-appearance:state')).language === 'zh-CN', 'switching language in DSH updates the HanaUI row')

// A locale switch makes DSH re-emit its built-in theme; that must not reset the Hana skin.
themeCard.props.onSelect()
assert(JSON.parse(storage.get('dsh-hana-appearance:state')).theme === 'hana-warm-paper', 'warm paper selected before the locale switch')
currentLocale = 'en-US'
for (const listener of localeListeners) listener()
dispatchThemeChange('light')
assert(JSON.parse(storage.get('dsh-hana-appearance:state')).theme === 'hana-warm-paper', 'locale switch keeps the selected Hana theme')



// DSH re-emits its persisted built-in preference (boot/settings reload); the
// Hana skin must stay sticky instead of resetting.
currentPreference = 'hana-coral'
await new Promise((resolve) => setTimeout(resolve, 2300))
dispatchThemeChange('light')
assert(JSON.parse(storage.get('dsh-hana-appearance:state')).theme === 'hana-warm-paper', 'built-in preference echo keeps the Hana skin')
assert(setThemeCalls[setThemeCalls.length - 1] === 'hana-warm-paper', 'built-in preference echo re-asserts the Hana skin')

// The startup splash feature was removed outright: no switch, no mount.
assert(!bodyChildren.some((el) => el.id === 'dsh-hana-splash-root'), 'in-app splash never mounts')
assert(JSON.parse(storage.get('dsh-hana-appearance:state')).splashEnabled === undefined, 'splash flag no longer exists in state')
const splashToggle = deepFind(tree, (node) => node.props && node.props.ariaLabel === '启动画面')
assert(splashToggle === null, 'startup splash switch is gone from settings')

// Windows desktop app icon switcher: cards render, the selection goes through
// the host bridge route and persists in the appearance state.
const appIconCard = deepFind(tree, (node) => node.props && node.props.icon && node.props.icon.id === 'plum')
assert(appIconCard !== null && typeof appIconCard.props.onSelect === 'function', 'app icon cards rendered')
assert(deepFind(tree, (node) => node.type === 'button' && node.props && node.props.children === '恢复默认') !== null, 'app icon restore-default action rendered')
assert(JSON.parse(storage.get('dsh-hana-appearance:state')).appIcon === 'default', 'app icon defaults to the official icon')
assert(fetchLog.some(([url, init]) => url === '/api/hana-appearance/app-icon' && init?.method !== 'POST'), 'app icon status fetched at boot')
appIconCard.props.onSelect()
await new Promise((resolve) => setTimeout(resolve, 20))
assert(fetchLog.some(([url, init]) => url === '/api/hana-appearance/app-icon' && init?.method === 'POST'), 'picking an app icon calls the host route')
assert(JSON.parse(storage.get('dsh-hana-appearance:state')).appIcon === 'plum', 'app icon selection persists in state')

// Persistence route: the debounced PUT should reach the host route.
await new Promise((resolve) => setTimeout(resolve, 600))
assert(fetchLog.some(([url, init]) => url === '/api/hana-appearance/state' && init?.method === 'PUT'), 'state flushed to host route')

console.log('smoke test passed')
process.exit(0)
