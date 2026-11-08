/**
 * dsh-hana-appearance — host half.
 *
 * Routes:
 *   - `/api/hana-appearance/state` (GET / PUT): durable appearance state
 *     (Hana theme id, fonts, paper texture, sunny tree seed, editor sizes).
 *     localStorage is the instant layer; this file layer survives the per-launch
 *     loopback port change that resets origin-scoped storage.
 *   - `/api/hana-appearance/font/install` (POST): download the optional
 *     霞鹜新致宋 (LXGW Neo ZhiSong) reading font from its upstream release,
 *     verify SHA-256 + size, and cache it under $DSH_HOME.
 *   - `/api/hana-appearance/font/status` (GET): download progress for polling.
 *   - `/api/hana-appearance/font` (GET): the cached font bytes for FontFace.
 *   - `/api/hana-appearance/app-icon` (GET / POST): Windows desktop shortcut +
 *     window icon sync for the bundled HanaUI app icons (see app-icon.js).
 *
 * Paper texture PNGs are served by the harness client-module asset route
 * (`/plugins/dsh-hana-appearance/assets/...`), not by this half.
 */
import { createHash } from 'node:crypto'
import { appendFileSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CUSTOM_ICON_ID, createAppIconControl, decodeBase64Ico } from './app-icon.js'

/** Cordis plugin name shown in logs/diagnostics. */
export const name = 'dsh-hana-appearance'

/** Host services this half requires. */
export const inject = ['webServer']

const STATE_FILENAME = 'hana-appearance-state.json'
const FONT_FILENAME = 'hana-appearance-wenkai.ttf'
const STATE_PATH = '/api/hana-appearance/state'
const FONT_PATH = '/api/hana-appearance/font'
const FONT_INSTALL_PATH = '/api/hana-appearance/font/install'
const FONT_STATUS_PATH = '/api/hana-appearance/font/status'
const APP_ICON_PATH = '/api/hana-appearance/app-icon'
const APP_ICON_CUSTOM_PATH = APP_ICON_PATH + '/custom.ico'
const APP_ICON_UPLOAD_LIMIT = 4 * 1024 * 1024
const APP_ICON_JSON_LIMIT = 8 * 1024 * 1024
const APP_ICON_IDS = ['orchid', 'classic', 'plum', 'bot']
const MAX_BODY_BYTES = 64 * 1024

const HERE = dirname(fileURLToPath(import.meta.url))
const APP_ICON_DIR = join(HERE, 'assets', 'app-icons')

/** 霞鹜新致宋 v1.067 (LXGW Neo ZhiSong, SIL OFL 1.1) — same source HanaAgent uses. */
const WENKAI_URL = 'https://github.com/lxgw/LxgwNeoZhiSong/releases/download/v1.067/LXGWNeoZhiSong.ttf'
const WENKAI_SHA256 = '32b398f9c6278c4ed34f413077add2c2f3c84034d463af2b9cb98f12c4c2c6cd'
const WENKAI_SIZE = 10468036

/** Latest 霞鹜新致宋 download state, polled by the browser half. */
let fontInstall = { status: 'idle', progress: 0, error: null }

/** Resolve the harness home directory (same rule the shipped packages use). */
function dshHome() {
	return process.env.DSH_HOME || join(homedir(), '.dsh')
}

function stateFilePath() {
	return join(dshHome(), STATE_FILENAME)
}

function fontFilePath() {
	return join(dshHome(), FONT_FILENAME)
}

/** Whether the cached reading font exists with the expected byte size. */
function fontReady() {
	try {
		return statSync(fontFilePath()).size === WENKAI_SIZE
	} catch {
		return false
	}
}

function readDurableState() {
	try {
		const raw = readFileSync(stateFilePath(), 'utf8')
		const parsed = JSON.parse(raw)
		return typeof parsed === 'object' && parsed !== null ? parsed : null
	} catch {
		return null
	}
}

function writeDurableState(value) {
	const file = stateFilePath()
	mkdirSync(dirname(file), { recursive: true })
	const temp = `${file}.tmp-${process.pid}`
	writeFileSync(temp, JSON.stringify(value, null, 2), 'utf8')
	renameSync(temp, file)
}

function logBoot(method) {
	try {
		const file = join(dshHome(), 'hana-appearance-boot.log')
		appendFileSync(file, `${new Date().toISOString()} ${method} ${stateFilePath()}\n`, 'utf8')
	} catch {
		// diagnostics only
	}
}

/** Diagnostic trail for custom-icon uploads (the client cannot log anywhere else). */
function logAppIcon(message) {
	try {
		appendFileSync(join(dshHome(), 'hana-appearance-boot.log'), `${new Date().toISOString()} app-icon ${message}\n`, 'utf8')
	} catch {
		// diagnostics only
	}
}

function json(res, statusCode, body) {
	res.statusCode = statusCode
	res.setHeader('content-type', 'application/json; charset=utf-8')
	res.end(JSON.stringify(body))
}

function readBody(req, maxBytes = MAX_BODY_BYTES) {
	return new Promise((resolve, reject) => {
		let data = ''
		req.setEncoding('utf8')
		req.on('data', (chunk) => {
			data += chunk
			if (data.length > maxBytes) {
				reject(new Error('body too large'))
				req.destroy()
			}
		})
		req.on('end', () => resolve(data))
		req.on('error', reject)
	})
}

/** Collect a raw binary body (app-icon uploads) with a hard size cap. */
function readRawBody(req, maxBytes) {
	return new Promise((resolve, reject) => {
		const chunks = []
		let total = 0
		req.on('data', (chunk) => {
			total += chunk.length
			if (total > maxBytes) {
				reject(new Error('body too large'))
				req.destroy()
				return
			}
			chunks.push(chunk)
		})
		req.on('end', () => resolve(Buffer.concat(chunks)))
		req.on('error', reject)
	})
}

/** Download + verify + cache the optional reading font (single flight). */
async function installWenkaiFont() {
	if (fontInstall.status === 'downloading') return
	fontInstall = { status: 'downloading', progress: 0, error: null }
	try {
		const response = await fetch(WENKAI_URL, { redirect: 'follow' })
		if (!response.ok || response.body === null) throw new Error(`HTTP ${response.status}`)
		const total = Number(response.headers.get('content-length')) || WENKAI_SIZE
		const chunks = []
		let loaded = 0
		const reader = response.body.getReader()
		for (;;) {
			const { done, value } = await reader.read()
			if (done) break
			chunks.push(Buffer.from(value))
			loaded += value.length
			fontInstall.progress = Math.min(99, Math.round((loaded / total) * 100))
		}
		const buffer = Buffer.concat(chunks)
		if (buffer.length !== WENKAI_SIZE) throw new Error(`size mismatch: ${buffer.length}`)
		const digest = createHash('sha256').update(buffer).digest('hex')
		if (digest !== WENKAI_SHA256) throw new Error('sha256 mismatch')
		fontInstall = { status: 'verifying', progress: 100, error: null }
		mkdirSync(dshHome(), { recursive: true })
		const temp = `${fontFilePath()}.tmp-${process.pid}`
		writeFileSync(temp, buffer)
		renameSync(temp, fontFilePath())
		fontInstall = { status: 'ready', progress: 100, error: null }
	} catch (error) {
		fontInstall = { status: 'failed', progress: 0, error: error instanceof Error ? error.message : String(error) }
	}
}

/** Cordis entry: register the routes and release them on teardown. */
export function apply(ctx) {
	const webServer = ctx.get('webServer')
	if (webServer === undefined) return

	const disposers = [
		webServer.register({
			kind: 'exact',
			path: STATE_PATH,
			handler: async (req, res) => {
				if (req.method === 'GET') {
					logBoot('GET')
					json(res, 200, readDurableState() ?? {})
					return
				}
				if (req.method === 'PUT') {
					try {
						const parsed = JSON.parse(await readBody(req))
						if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
							throw new Error('bad body')
						}
						writeDurableState(parsed)
						json(res, 200, { ok: true })
					} catch (error) {
						json(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) })
					}
					return
				}
				json(res, 405, { ok: false, error: 'method not allowed' })
			},
		}),
		webServer.register({
			kind: 'exact',
			path: FONT_INSTALL_PATH,
			handler: (req, res) => {
				if (req.method !== 'POST') {
					json(res, 405, { ok: false, error: 'method not allowed' })
					return
				}
				void installWenkaiFont()
				json(res, 202, { ok: true, status: fontInstall.status })
			},
		}),
		webServer.register({
			kind: 'exact',
			path: FONT_STATUS_PATH,
			handler: (req, res) => {
				if (req.method === 'GET') {
					json(res, 200, { ...fontInstall, ready: fontReady() })
					return
				}
				json(res, 405, { ok: false, error: 'method not allowed' })
			},
		}),
		webServer.register({
			kind: 'exact',
			path: FONT_PATH,
			handler: (req, res) => {
				if (req.method !== 'GET') {
					json(res, 405, { ok: false, error: 'method not allowed' })
					return
				}
				if (!fontReady()) {
					json(res, 404, { ok: false, error: 'font not installed' })
					return
				}
				try {
					const data = readFileSync(fontFilePath())
					res.statusCode = 200
					res.setHeader('content-type', 'font/ttf')
					res.setHeader('cache-control', 'public, max-age=31536000, immutable')
					res.end(data)
				} catch {
					json(res, 404, { ok: false, error: 'font not readable' })
				}
			},
		}),
	]

	const appIcons = createAppIconControl({
		home: dshHome(),
		iconDir: APP_ICON_DIR,
		iconIds: APP_ICON_IDS,
		log: (error) => console.error('[hana-appearance] app icon sync failed', error),
	})

	disposers.push(
		webServer.register({
			kind: 'exact',
			path: APP_ICON_PATH,
			handler: async (req, res) => {
				if (req.method === 'GET') {
					if (appIcons === null) {
						json(res, 200, { ok: false, supported: false, error: '应用图标同步仅支持 Windows 桌面版 DSH' })
						return
					}
					try {
						json(res, 200, { ok: true, ...appIcons.control.status() })
					} catch (error) {
						json(res, 500, { ok: false, supported: true, error: error instanceof Error ? error.message : String(error) })
					}
					return
				}
				if (req.method !== 'POST') {
					json(res, 405, { ok: false, error: 'method not allowed' })
					return
				}
				if (appIcons === null) {
					json(res, 200, { ok: false, supported: false, error: '应用图标同步仅支持 Windows 桌面版 DSH' })
					return
				}
				try {
					const contentType = String(req.headers['content-type'] ?? '')
					logAppIcon(`POST content-type=${contentType || '(none)'}`)
					if (contentType.includes('application/octet-stream')) {
						const bytes = await readRawBody(req, APP_ICON_UPLOAD_LIMIT)
						logAppIcon(`raw body bytes=${bytes.length}`)
						const result = await appIcons.control.uploadCustom(bytes)
						logAppIcon(`raw upload ok=${result.applied}`)
						json(res, 200, { ok: true, ...result })
						return
					}
					const parsed = JSON.parse(await readBody(req, APP_ICON_JSON_LIMIT))
					if (typeof parsed?.uploadCustomBase64 === 'string') {
						const encoded = parsed.uploadCustomBase64
						logAppIcon(`base64 payload chars=${encoded.length}`)
						const bytes = decodeBase64Ico(encoded)
						logAppIcon(`base64 decoded bytes=${bytes.length}`)
						const result = await appIcons.control.uploadCustom(bytes)
						logAppIcon(`base64 upload ok=${result.applied}`)
						json(res, 200, { ok: true, ...result })
						return
					}
					if (parsed?.removeCustom === true) {
						const result = await appIcons.control.removeCustom()
						logAppIcon('remove custom ok')
						json(res, 200, { ok: true, ...result })
						return
					}
					const iconId = typeof parsed?.iconId === 'string' ? parsed.iconId : 'default'
					if (iconId !== 'default' && iconId !== CUSTOM_ICON_ID && !APP_ICON_IDS.includes(iconId)) {
						json(res, 400, { ok: false, supported: true, error: `unknown-app-icon: ${iconId}` })
						return
					}
					const result = await appIcons.control.setIcon(iconId === 'default' ? null : iconId)
					json(res, 200, { ok: true, ...result })
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error)
					logAppIcon(`ERROR ${message}`)
					const status = message === 'invalid-ico' || message === 'icon-too-large' || message === 'body too large' ? 400 : 500
					json(res, status, { ok: false, supported: true, error: message })
				}
			},
		}),
		webServer.register({
			kind: 'exact',
			path: APP_ICON_CUSTOM_PATH,
			handler: (req, res) => {
				if (req.method !== 'GET') {
					json(res, 405, { ok: false, error: 'method not allowed' })
					return
				}
				if (appIcons === null) {
					json(res, 404, { ok: false, error: 'unsupported' })
					return
				}
				const bytes = appIcons.control.customIconBytes()
				if (bytes === null) {
					json(res, 404, { ok: false, error: 'no-custom-icon' })
					return
				}
				res.statusCode = 200
				res.setHeader('content-type', 'image/x-icon')
				res.setHeader('cache-control', 'no-cache')
				res.end(bytes)
			},
		})
	)

	ctx.effect(
		() => () => {
			for (const dispose of disposers) dispose()
			return appIcons === null ? undefined : appIcons.dispose()
		},
		'dsh-hana-appearance: host routes'
	)
}
