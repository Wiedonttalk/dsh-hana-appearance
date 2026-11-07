// Sunny-mode renderer smoke test: drives the built client bundle far enough to
// build a seeded tree and draw frames on a stub canvas, catching runtime errors.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const code = readFileSync(join(root, 'lib', 'client.js'), 'utf8')

const drawCalls = []
const canvases = []

function makeContext(canvas) {
  const calls = []
  const handler = {
    get(target, prop) {
      if (prop === 'canvas') return canvas
      if (prop in target) return target[prop]
      if (prop === 'filter' || prop === 'fillStyle' || prop === 'strokeStyle' || prop === 'lineCap' || prop === 'globalAlpha' || prop === 'lineWidth') {
        return target[prop]
      }
      return (...args) => {
        calls.push(prop)
        return undefined
      }
    },
    set(target, prop, value) {
      target[prop] = value
      return true
    },
  }
  const target = { calls }
  const ctx = new Proxy(target, handler)
  // numeric-visual props live on the target so the setter/getter round-trips
  ctx.fillStyle = '#000'
  ctx.strokeStyle = '#000'
  ctx.lineCap = 'round'
  ctx.globalAlpha = 1
  ctx.lineWidth = 1
  ctx.filter = 'none'
  return ctx
}

function makeCanvas() {
  const canvas = { width: 0, height: 0, style: {}, className: '', id: '', removed: false }
  canvas.getContext = () => (canvas._ctx ??= makeContext(canvas))
  canvas.remove = () => { canvas.removed = true }
  canvas.toDataURL = () => ''
  canvases.push(canvas)
  return canvas
}

const rafQueue = []
let rafId = 0
const listeners = new Map()

const storage = new Map([
  ['dsh-hana-appearance:state', JSON.stringify({ theme: 'hana-warm-paper', font: 'serif', texture: 'rice', textureStrength: 3, sunnyMode: true, sunnySeed: 12345 })],
])

const documentStub = {
  head: { appendChild() {} },
  body: { children: [], appendChild(node) { if (node && node.id === 'dsh-hana-appearance-sunny') drawCalls.push('shade-added'); this.children.push(node) }, removeChild(node) { this.children = this.children.filter((child) => child !== node) } },
  documentElement: {
    style: { setProperty() {}, removeProperty() {} },
    setAttribute() {},
    removeAttribute() {},
    getAttribute() { return null },
  },
  createElement(tag) {
    if (tag === 'canvas') return makeCanvas()
    return { style: {}, className: '', id: '', appendChild() {}, remove() {}, setAttribute() {}, removeAttribute() {}, addEventListener() {}, removeEventListener() {} }
  },
  addEventListener(type, fn) {
    if (!listeners.has(type)) listeners.set(type, new Set())
    listeners.get(type).add(fn)
  },
  removeEventListener(type, fn) { listeners.get(type)?.delete(fn) },
  fonts: { add() {} },
  hidden: false,
  querySelector() { return null },
  createTextNode() { return {} },
}

const windowStub = {
  localStorage: {
    getItem: (key) => (storage.has(key) ? storage.get(key) : null),
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key),
  },
  addEventListener(type, fn) {
    if (!listeners.has(type)) listeners.set(type, new Set())
    listeners.get(type).add(fn)
  },
  removeEventListener(type, fn) { listeners.get(type)?.delete(fn) },
  dispatchEvent() {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  innerWidth: 1440,
  innerHeight: 900,
  devicePixelRatio: 2,
  setTimeout: (fn) => setTimeout(fn, 0),
  clearTimeout: (id) => clearTimeout(id),
  requestAnimationFrame: (cb) => { rafQueue.push(cb); return ++rafId },
  cancelAnimationFrame() {},
}

globalThis.window = windowStub
globalThis.document = documentStub
globalThis.localStorage = windowStub.localStorage
globalThis.requestAnimationFrame = windowStub.requestAnimationFrame
globalThis.cancelAnimationFrame = windowStub.cancelAnimationFrame
globalThis.performance = { now: () => Date.now() }
globalThis.FontFace = class {
  constructor(family, buffer) { this.family = family; this.buffer = buffer }
  load() { return Promise.resolve(this) }
}
globalThis.fetch = async () => ({ ok: false, status: 404 })

const react = {
  createElement: (type, props, ...children) => ({ type, props: { ...(props ?? {}), children } }),
  useRef: (value) => ({ current: value }),
  useState: (value) => [typeof value === 'function' ? value() : value, () => {}],
  useEffect() {},
  useMemo: (fn) => fn(),
  useCallback: (fn) => fn,
  useSyncExternalStore: (subscribe, getSnapshot) => getSnapshot(),
  memo: (fn) => fn,
  Fragment: 'Fragment',
}

const services = {}
const moduleSlots = []
const ctx = {
  get: (name) => services[name],
  getService: (name) => services[name],
  effect: (fn) => { services.effectCleanup = fn(); return () => {} },
  on() {},
  off() {},
  emit() {},
  provide: () => {},
  set: () => {},
  theme: {
    register: () => {},
    getTheme: () => ({ preference: 'hana-warm-paper', active: 'hana-warm-paper', colorScheme: 'light' }),
    getThemes: () => [],
    setTheme: () => {},
    on: () => {},
  },
  slots: { register: (definition, component) => { moduleSlots.push({ definition, component }); return { dispose() {} } }, inject: (name, callback) => callback() },
  locale: { register: () => {}, get: () => 'zh-CN' },
  layout: { register: () => {} },
  logger: { info() {}, warn() {}, error() {}, debug() {} },
  log: { info() {}, warn() {}, error() {}, debug() {} },
  http: { register: () => {}, dispose: () => {} },
  webServer: { register: () => () => {} },
}

let entry = null
windowStub.__ModuleLoader__ = { load: (value) => { entry = value } }
new Function('window', 'document', 'localStorage', code)(windowStub, documentStub, windowStub.localStorage)
if (entry === null || typeof entry.factory !== 'function') throw new Error('module entry was not registered')

const plugin = entry.factory((id) => {
  if (id === 'react') return react
  if (id === 'react/jsx-runtime') return { jsx: react.createElement, jsxs: react.createElement, Fragment: 'Fragment' }
  throw new Error('unexpected require: ' + id)
})
if (typeof plugin.inject === 'function') plugin.inject(ctx)
plugin.apply(ctx)

// Drive a handful of animation frames; the renderer schedules itself via rAF.
let frame = 0
while (rafQueue.length > 0 && frame < 4) {
  const batch = rafQueue.splice(0, rafQueue.length)
  frame++
  for (const cb of batch) cb(Date.now() + frame * 40)
}

const shade = canvases.find((canvas) => canvas.width >= 1000 && canvas.height >= 600)
const sceneCalls = canvases.reduce((total, canvas) => total + (canvas._ctx ? canvas._ctx.calls.length : 0), 0)
const shadeCalls = shade && shade._ctx ? shade._ctx.calls.length : 0
console.log('sunny tree canvases with pixels:', canvases.filter((canvas) => canvas.width > 0).length)
console.log('limb draw calls:', sceneCalls)
console.log('overlay frame draw calls:', shadeCalls)

if (shade === undefined) throw new Error('sunny overlay canvas was not sized')
if (sceneCalls < 500) throw new Error('suspiciously few limb draw calls: ' + sceneCalls)
if (shadeCalls < 10) throw new Error('sunny overlay never drew a frame: ' + shadeCalls)
// Toggling 晴天模式 off must remove the overlay layers immediately.
const page = moduleSlots.find((entry) => entry.definition && entry.definition.name === 'settings.section' && entry.definition.id === 'hana-ui')
if (page === undefined) throw new Error('settings page not registered')
const renderTree = (node) => {
  if (Array.isArray(node)) return node.map(renderTree)
  if (node === null || typeof node !== 'object') return node
  if (typeof node.type === 'function') return renderTree(node.type(node.props))
  return { ...node, children: (node.children ?? []).map(renderTree) }
}
const findNode = (node, predicate) => {
  if (Array.isArray(node)) { for (const item of node) { const hit = findNode(item, predicate); if (hit) return hit } return null }
  if (node === null || typeof node !== 'object') return null
  if (predicate(node)) return node
  const children = Array.isArray(node.children) ? node.children : node.children !== undefined ? [node.children] : []
  for (const child of children) { const hit = findNode(child, predicate); if (hit) return hit }
  for (const value of Object.values(node.props ?? {})) { if (value && typeof value === 'object') { const hit = findNode(value, predicate); if (hit) return hit } }
  return null
}
const pageTree = renderTree(page.component())
const sunnyRow = findNode(pageTree, (node) => node.props && node.props.label === '晴天模式')
const ariaNode = findNode(pageTree, (node) => node.props && node.props['aria-label'] !== undefined)
console.log('debug rows:', sunnyRow !== null, '| aria:', ariaNode ? JSON.stringify(ariaNode.props['aria-label']) : 'none')
if (sunnyRow !== null) {
  const control = sunnyRow.props.control
  console.log('debug control:', control ? String((control.type && control.type.name) || control.type) : 'none')
}
const sunnyToggle = findNode(pageTree, (node) => node.props && node.props.ariaLabel === '晴天模式' && typeof node.props.onChange === 'function')
if (sunnyToggle === undefined) throw new Error('sunny-mode toggle not found')
const overlayBefore = documentStub.body.children.filter((node) => node.getContext && node.width >= 1000)
sunnyToggle.props.onChange(false)
while (rafQueue.length > 0 && frame < 12) { const batch = rafQueue.splice(0); frame++; for (const cb of batch) cb(Date.now() + frame * 40) }
const overlayAfter = documentStub.body.children.filter((node) => node.getContext && node.width >= 1000 && node.removed !== true)
console.log('overlay before toggle off:', overlayBefore.length, '| still attached:', overlayAfter.length)
if (overlayBefore.length === 0) throw new Error('overlay was not mounted before toggle off')
if (overlayAfter.length !== 0) throw new Error('sunny overlay survived toggle off')
console.log('sunny toggle off ok')
process.exit(0)
