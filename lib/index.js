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
 *
 * Paper texture PNGs are served by the harness client-module asset route
 * (`/plugins/dsh-hana-appearance/assets/...`), not by this half.
 */
import { createHash } from 'node:crypto'
import { appendFileSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

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
const MAX_BODY_BYTES = 64 * 1024

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

function json(res, statusCode, body) {
	res.statusCode = statusCode
	res.setHeader('content-type', 'application/json; charset=utf-8')
	res.end(JSON.stringify(body))
}

function readBody(req) {
	return new Promise((resolve, reject) => {
		let data = ''
		req.setEncoding('utf8')
		req.on('data', (chunk) => {
			data += chunk
			if (data.length > MAX_BODY_BYTES) {
				reject(new Error('body too large'))
				req.destroy()
			}
		})
		req.on('end', () => resolve(data))
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

	ctx.effect(() => () => {
		for (const dispose of disposers) dispose()
	}, 'dsh-hana-appearance: host routes')
}
