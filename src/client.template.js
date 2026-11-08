// dsh-hana-appearance — browser half (client plugin bundle).
// Loaded by dsh-client-modules at /plugins/dsh-hana-appearance/client.js and
// executed through the vendored cordis Loader's lazy-CJS module table.
// The factory body is plain CJS with require() resolved against the shell's
// module table (same shape the shipped ui-* packages' tsdown bundles emit).
//
// Visual language ported from HanaAgent (openhanako, Apache-2.0):
// https://github.com/liliMozi/openhanako — theme palettes and the settings
// structure (SettingsSection / SettingsRow typography) are adapted from
// desktop/src/themes/*, desktop/src/shared/theme-registry-data.json and
// desktop/src/react/settings/**.
window.__ModuleLoader__.load({
	id: "dsh-hana-appearance",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");

		//#region dsh-hana-appearance: constants
		const STORAGE_KEY = "dsh-hana-appearance:state";
		const STATE_ROUTE = "/api/hana-appearance/state";
		const DEFAULT_SKIN = "system";

		/** Theme catalog generated from HanaAgent's desktop/src/themes/*.css. */
		const THEMES = __THEMES_JSON__;
		const THEME_BY_ID = new Map(THEMES.map((theme) => [theme.id, theme]));
		const AUTO_LIGHT = THEMES.find((theme) => theme.id === "hana-warm-paper")?.pageColor ?? "#F8F4ED";
		const AUTO_DARK = THEMES.find((theme) => theme.id === "hana-midnight")?.pageColor ?? "#3B4A54";

		/** Static page stylesheet, ported from HanaAgent's settings components. */
		const PAGE_CSS = __PAGE_CSS__;

		/** Default appearance state (theme / font / texture / extras). */
		const DEFAULT_STATE = {
			theme: DEFAULT_SKIN,
			font: "serif",
			texture: "off",
			textureStrength: 3,
			showSticker: true,
			toolIcon: "svg",
			appIcon: "default",
			language: "zh-CN",
			timezone: "Asia/Shanghai",
			fontSizeOffset: 0,
			contrastOffset: 0,
			chatWidth: "720",
			sunnyMode: false,
			sunnySeed: 0,
			sunnySavedSeeds: [],
			customFontName: "",
			customFontLabel: "",
			editorFont: "follow",
			editorBodySize: 16,
			editorContentWidth: "720",
			editorH1: 28,
			editorH2: 21,
			editorH3: 18,
			editorLineHeight: 1.5,
			editorContentPadding: 24,
			previewTexture: "off",
			previewTextureStrength: 3,
			wenkaiReady: false,
			updatedAt: 0,
		};

		/** Resolve the reading-font family for the current state. */
		function resolveFontStack(next) {
			if (next.font === "custom" && next.customFontName) return `'${next.customFontName}', ${FONT_STACKS.serif}`;
			if (next.font === "wenkai") return "'HanaLXGWNeoZhiSong', ";
			return FONT_STACKS[next.font] ?? FONT_STACKS.serif;
		}

		/** Font stacks (HanaAgent serif / sans presets, CJK fallbacks widened). */
		const FONT_STACKS = {
			serif: "Georgia, 'Times New Roman', 'Songti SC', SimSun, 'Noto Serif CJK SC', 'Source Han Serif SC', serif",
			sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif",
		};

		/** HanaAgent paper-texture strength steps (picker labels 1-5 map here). */
		const TEXTURE_STRENGTH_VALUES = [0.5, 0.75, 1, 1.25, 1.5];

		/** Texture picker options (first entry turns the texture off). */
		const TEXTURE_OPTIONS = [
			{ value: "off", label: "关闭" },
			{ value: "rice", label: "宣纸" },
			{ value: "cotton", label: "棉纸" },
			{ value: "fine", label: "细颗粒" },
		];

		const STRENGTH_OPTIONS = [1, 2, 3, 4, 5].map((value) => ({ value, label: String(value) }));

		/** Bundled HanaUI desktop app icons (Windows-only shortcut/window icon sync). */
		const APP_ICON_IDS = ["orchid", "classic", "plum", "bot"];
		const APP_ICON_ROUTE = "/api/hana-appearance/app-icon";
		const APP_ICONS = [
			{ id: "orchid", name: "兰", file: "orchid.png" },
			{ id: "classic", name: "经典", file: "classic.png" },
			{ id: "plum", name: "梅", file: "plum.png" },
			{ id: "bot", name: "Bot", file: "bot.png" },
		];

		/** Asset URL served by the harness client-module asset route. */
		function iconAssetUrl(file) {
			return `/plugins/dsh-hana-appearance/assets/icons/${file}`;
		}

		/** Custom icon: served by the host half, uploaded from the settings page. */
		const APP_ICON_CUSTOM_ROUTE = APP_ICON_ROUTE + "/custom.ico";
		const APP_ICON_UPLOAD_MAX = 3 * 1024 * 1024;

		/** Clamp helper for the texture strength (1..5, indexes TEXTURE_STRENGTH_VALUES). */
		function clampStrength(value) {
			const parsed = Number(value);
			if (!Number.isFinite(parsed)) return 3;
			return Math.min(5, Math.max(1, Math.round(parsed)));
		}
		function isDarkMode(themeId) {
			if (themeId === DEFAULT_SKIN) return document.body?.hasAttribute("data-ds-dark-theme") === true;
			return THEME_BY_ID.get(themeId)?.colorScheme === "dark";
		}

		/** Coerce arbitrary storage/route JSON into a valid state object. */
		function normalizeState(raw) {
			if (typeof raw !== "object" || raw === null) return { ...DEFAULT_STATE };
			const theme = typeof raw.theme === "string" && (raw.theme === DEFAULT_SKIN || THEME_BY_ID.has(raw.theme)) ? raw.theme : DEFAULT_STATE.theme;
			const texture = raw.texture === "rice" || raw.texture === "cotton" || raw.texture === "fine" ? raw.texture : "off";
			const clampOffset = (value) => Math.max(-2, Math.min(2, Math.round(Number(value) || 0)));
			const font = raw.font === "sans" || raw.font === "wenkai" || raw.font === "custom" ? raw.font : "serif";
			return {
				theme,
				font,
				texture,
				textureStrength: clampStrength(raw.textureStrength),
				showSticker: raw.showSticker !== false,
				toolIcon: raw.toolIcon === "emoji" ? "emoji" : "svg",
				appIcon: raw.appIcon === "custom" || APP_ICON_IDS.includes(raw.appIcon) ? raw.appIcon : "default",
				language: typeof raw.language === "string" && raw.language !== "" ? raw.language : "zh-CN",
				timezone: typeof raw.timezone === "string" && raw.timezone !== "" ? raw.timezone : "Asia/Shanghai",
				fontSizeOffset: clampOffset(raw.fontSizeOffset),
				contrastOffset: clampOffset(raw.contrastOffset),
				chatWidth: ["640", "720", "800", "unlimited"].includes(raw.chatWidth) ? raw.chatWidth : "720",
				sunnyMode: raw.sunnyMode === true,
				sunnySeed: typeof raw.sunnySeed === "number" && Number.isFinite(raw.sunnySeed) ? Math.max(0, Math.min(999999999, Math.round(raw.sunnySeed))) : 0,
				sunnySavedSeeds: Array.isArray(raw.sunnySavedSeeds)
					? raw.sunnySavedSeeds.filter((seed) => typeof seed === "number" && Number.isFinite(seed))
					: [],
				customFontName: typeof raw.customFontName === "string" ? raw.customFontName : "",
				customFontLabel: typeof raw.customFontLabel === "string" ? raw.customFontLabel : "",
				editorFont: ["follow", "serif", "sans", "wenkai", "custom"].includes(raw.editorFont) ? raw.editorFont : "follow",
				editorBodySize: Number.isFinite(Number(raw.editorBodySize)) ? Number(raw.editorBodySize) : 16,
				editorContentWidth: ["640", "720", "800", "unlimited"].includes(raw.editorContentWidth) ? raw.editorContentWidth : "720",
				editorH1: Number.isFinite(Number(raw.editorH1)) ? Number(raw.editorH1) : 28,
				editorH2: Number.isFinite(Number(raw.editorH2)) ? Number(raw.editorH2) : 21,
				editorH3: Number.isFinite(Number(raw.editorH3)) ? Number(raw.editorH3) : 18,
				editorLineHeight: Number.isFinite(Number(raw.editorLineHeight)) ? Number(raw.editorLineHeight) : 1.5,
				editorContentPadding: Number.isFinite(Number(raw.editorContentPadding)) ? Number(raw.editorContentPadding) : 24,
				previewTexture: raw.previewTexture === "rice" || raw.previewTexture === "cotton" || raw.previewTexture === "fine" ? raw.previewTexture : "off",
				previewTextureStrength: clampStrength(raw.previewTextureStrength),
				wenkaiReady: raw.wenkaiReady === true,
				updatedAt: Number.isFinite(Number(raw.updatedAt)) ? Number(raw.updatedAt) : 0,
			};
		}

		//#endregion

		//#region dsh-hana-appearance: persistence store
		/**
		 * Appearance store: localStorage is the instant layer (survives
		 * reloads), the host route writes a JSON file under $DSH_HOME so the
		 * selection survives Desktop's per-launch loopback port churn.
		 */
		const listeners = new Set();
		let state = { ...DEFAULT_STATE };
		let repaint = null;

		function readLocal() {
			try {
				const raw = window.localStorage.getItem(STORAGE_KEY);
				if (raw === null) return null;
				return normalizeState(JSON.parse(raw));
			} catch {
				return null;
			}
		}

		/* Cookie mirror: cookies are host-scoped (not port-scoped), so the last
		 * chosen theme is available synchronously on the next launch even before
		 * the durable host file is fetched — this removes the startup theme flash. */
		const BOOT_COOKIE = "hana-appearance-boot";

		function writeBootCookie(next) {
			try {
				const payload = JSON.stringify({ theme: next.theme, updatedAt: next.updatedAt });
				document.cookie = BOOT_COOKIE + "=" + encodeURIComponent(payload) + "; path=/; max-age=31536000; SameSite=Lax";
			} catch {
				// cookies may be unavailable; the other layers still work
			}
		}

		function readBootCookie() {
			try {
				const match = new RegExp("(?:^|; )" + BOOT_COOKIE + "=([^;]*)").exec(document.cookie ?? "");
				if (match === null) return null;
				const parsed = JSON.parse(decodeURIComponent(match[1]));
				if (typeof parsed !== "object" || parsed === null || typeof parsed.theme !== "string") return null;
				return normalizeState(parsed);
			} catch {
				return null;
			}
		}

		function writeLocal(next) {
			writeBootCookie(next);
			try {
				window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			} catch {
				// storage may be unavailable in private contexts; route layer still works
			}
		}

		function notify() {
			for (const listener of listeners) listener();
			if (repaint !== null) repaint();
		}
				/* ── DSH built-in locale bridge ──
		 * The 语言 row mirrors DSH's own 设置 → 通用 → 语言 row: reading the
		 * runtime locale snapshot keeps both in sync, writing through
		 * locale.setLocale() switches the whole UI and persists the preference. */
		let localeFace = null;

		/** Options for the language dropdown, sourced from the runtime catalog. */
		function getDshLanguageOptions() {
			try {
				const snapshot = localeFace?.getSnapshot?.();
				if (snapshot !== undefined && Array.isArray(snapshot.locales) && snapshot.locales.length > 0) {
					return snapshot.locales.map((entry) => ({ value: entry.id, label: entry.label }));
				}
			} catch {
				// fall through to the static catalog
			}
			return LANGUAGE_OPTIONS;
		}

		/** Snapshot of the runtime locale, or null when the runtime has none. */
		function readDshLocale() {
			try {
				const snapshot = localeFace?.getSnapshot?.();
				if (snapshot === undefined || typeof snapshot.active !== "string") return null;
				return { active: snapshot.active };
			} catch {
				return null;
			}
		}

		/** Change the language: update our state and switch the runtime locale. */
		function chooseLanguage(id) {
			lastLocaleChangeAt = Date.now();
			setState({ language: id });
			try {
				localeFace?.setLocale?.(id);
				// Keep the Hana skin even if the runtime re-emits its built-in theme.
				setTimeout(() => {
					if (state.theme === DEFAULT_SKIN) return;
					try {
						if (ctx.theme.getTheme().preference !== state.theme) {
							lastSelfSetAt = Date.now();
							ctx.theme.setTheme(state.theme);
						}
					} catch {
						// ignore: theme runtime may be tearing down
					}
				}, 400);
			} catch {
				// unknown/unsupported id: keep the plugin preference only
			}
		}

/* Optional 霞鹜新致宋 (LXGW Neo ZhiSong) reading font: installed on demand,
		 * cached by the host half under $DSH_HOME, registered as a FontFace. */
		const WENKAI_FAMILY = "HanaLXGWNeoZhiSong";
		let fontStatus = { status: "idle", progress: 0 };

		function getFontStatus() {
			return fontStatus;
		}

		function setFontStatus(patch) {
			fontStatus = { ...fontStatus, ...patch };
			notify();
		}

		/** Register the cached font bytes under the HanaAgent family name. */
		function registerWenkaiBuffer(buffer) {
			return new FontFace(WENKAI_FAMILY, buffer)
				.load()
				.then((face) => {
					document.fonts.add(face);
					return true;
				})
				.catch(() => false);
		}

		/** Load the cached font file from the host (after a previous install). */
		async function loadCachedWenkaiFont() {
			try {
				const response = await fetch("/api/hana-appearance/font");
				if (!response.ok) return false;
				const buffer = await response.arrayBuffer();
				return await registerWenkaiBuffer(buffer);
			} catch {
				return false;
			}
		}

		/** Start the host-side download and poll its progress, then activate it. */
		async function installWenkaiFont() {
			if (fontStatus.status === "downloading" || fontStatus.status === "verifying") return;
			setFontStatus({ status: "downloading", progress: 0 });
			try {
				const start = await fetch("/api/hana-appearance/font/install", { method: "POST" });
				if (!start.ok) throw new Error("install failed");
				for (let attempt = 0; attempt < 1600; attempt++) {
					await new Promise((resolve) => setTimeout(resolve, 500));
					let info;
					try {
						const response = await fetch("/api/hana-appearance/font/status");
						if (!response.ok) continue;
						info = await response.json();
					} catch {
						continue;
					}
					if (info.status === "failed") throw new Error(info.error ?? "download failed");
					if (info.status === "verifying") setFontStatus({ status: "verifying", progress: 100 });
					else if (info.status === "downloading") setFontStatus({ status: "downloading", progress: Number(info.progress) || 0 });
					if (info.ready === true || info.status === "ready") {
						const loaded = await loadCachedWenkaiFont();
						if (!loaded) throw new Error("font load failed");
						setState({ wenkaiReady: true, font: "wenkai" });
						setFontStatus({ status: "ready", progress: 100 });
						return;
					}
				}
				throw new Error("timeout");
			} catch {
				setFontStatus({ status: "failed", progress: 0 });
			}
		}

		/** On boot, re-register a previously installed font file. */
		async function restoreWenkaiFont() {
			if (state.wenkaiReady !== true) return;
			const loaded = await loadCachedWenkaiFont();
			if (!loaded) setState({ wenkaiReady: false });
		}

		/* Bundled HanaUI app icons: the host half rewrites the Windows desktop,
		 * Start-menu and pinned-taskbar shortcuts and keeps the window icon
		 * (taskbar thumbnail / Alt+Tab) in sync — see lib/app-icon.js. */
		let appIconStatus = null;

		function getAppIconStatus() {
			return appIconStatus;
		}

		function appIconErrorMessage(message) {
			if (message.includes("unknown-app-icon")) return "未知的应用图标";
			if (message.includes("invalid-ico")) return "这不是有效的 ICO 文件（图片可能已损坏，换一张试试）";
			if (message.includes("icon-too-large") || message.includes("body too large")) return "图标文件太大了（上限 3 MB）";
			if (message.includes("app-icon-powershell")) return "系统调用失败：" + message.replace(/^app-icon-powershell:\s*/, "");
			return message;
		}

		async function refreshAppIconStatus() {
			try {
				const response = await fetch(APP_ICON_ROUTE);
				if (!response.ok) {
					const notReady = response.status === 401 || response.status === 403 || response.status === 404 || response.status === 405;
					appIconStatus = {
						supported: !notReady,
						ok: false,
						error: notReady ? "应用图标服务未就绪（重启 DSH 一次后生效）" : "HTTP " + response.status,
					};
					return appIconStatus;
				}
				appIconStatus = await response.json();
			} catch (error) {
				appIconStatus = { supported: true, ok: false, error: error instanceof Error ? error.message : String(error) };
			}
			return appIconStatus;
		}

		async function applyAppIcon(iconId) {
			const response = await fetch(APP_ICON_ROUTE, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ iconId }),
			});
			let info = {};
			try {
				info = await response.json();
			} catch {
				info = {};
			}
			if (!response.ok || info.ok === false) {
				const notReady = response.status === 401 || response.status === 403 || response.status === 404 || response.status === 405;
				throw new Error(notReady ? "应用图标服务未就绪（重启 DSH 一次后生效）" : appIconErrorMessage(String(info.error ?? "HTTP " + response.status)));
			}
			appIconStatus = { ...info, supported: info.supported !== false, ok: true };
			return appIconStatus;
		}

		/* ── Custom app icon: PNG/JPG/ICO → a multi-size BMP-based ICO in the
		 * browser, then uploaded as raw bytes to the host half. ── */
		function loadUploadImage(file) {
			return new Promise((resolve, reject) => {
				const url = URL.createObjectURL(file);
				const image = new Image();
				image.onload = () => {
					URL.revokeObjectURL(url);
					resolve(image);
				};
				image.onerror = () => {
					URL.revokeObjectURL(url);
					reject(new Error("无法读取这张图片"));
				};
				image.src = url;
			});
		}

		function buildIcoFile(images) {
			const headerSize = 6 + images.length * 16;
			const entries = images.map((image) => {
				const xorSize = image.size * image.size * 4;
				const maskRowBytes = Math.ceil(image.size / 32) * 4;
				const payload = new Uint8Array(40 + xorSize + maskRowBytes * image.size);
				const view = new DataView(payload.buffer);
				view.setUint32(0, 40, true);
				view.setInt32(4, image.size, true);
				view.setInt32(8, image.size * 2, true);
				view.setUint16(12, 1, true);
				view.setUint16(14, 32, true);
				view.setUint32(20, xorSize, true);
				let offset = 40;
				for (let y = image.size - 1; y >= 0; y -= 1) {
					for (let x = 0; x < image.size; x += 1) {
						const index = (y * image.size + x) * 4;
						payload[offset] = image.pixels[index + 2];
						payload[offset + 1] = image.pixels[index + 1];
						payload[offset + 2] = image.pixels[index];
						payload[offset + 3] = image.pixels[index + 3];
						offset += 4;
					}
				}
				return { size: image.size, payload };
			});
			const total = entries.reduce((sum, entry) => sum + entry.payload.length, headerSize);
			const file = new Uint8Array(total);
			const view = new DataView(file.buffer);
			view.setUint16(0, 0, true);
			view.setUint16(2, 1, true);
			view.setUint16(4, entries.length, true);
			let directory = 6;
			let dataOffset = headerSize;
			for (const entry of entries) {
				file[directory] = entry.size >= 256 ? 0 : entry.size;
				file[directory + 1] = entry.size >= 256 ? 0 : entry.size;
				file[directory + 2] = 0;
				file[directory + 3] = 0;
				view.setUint16(directory + 4, 1, true);
				view.setUint16(directory + 6, 32, true);
				view.setUint32(directory + 8, entry.payload.length, true);
				view.setUint32(directory + 12, dataOffset, true);
				directory += 16;
				dataOffset += entry.payload.length;
			}
			let cursor = headerSize;
			for (const entry of entries) {
				file.set(entry.payload, cursor);
				cursor += entry.payload.length;
			}
			return file;
		}

		async function fileToIcoBytes(file) {
			const name = (file.name ?? "").toLowerCase();
			const isIco = name.endsWith(".ico") || file.type === "image/x-icon" || file.type === "image/vnd.microsoft.icon";
			if (isIco) {
				const bytes = new Uint8Array(await file.arrayBuffer());
				if (bytes.length < 6 || bytes[0] !== 0 || bytes[1] !== 0 || bytes[2] !== 1 || bytes[3] !== 0) {
					throw new Error("invalid-ico");
				}
				return bytes;
			}
			const image = await loadUploadImage(file);
			const sizes = [256, 128, 64, 48, 32, 24, 16].map((size) => {
				const canvas = document.createElement("canvas");
				canvas.width = size;
				canvas.height = size;
				const ctx = canvas.getContext("2d");
				const scale = Math.max(size / image.width, size / image.height);
				const width = image.width * scale;
				const height = image.height * scale;
				ctx.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
				return { size, pixels: ctx.getImageData(0, 0, size, size).data };
			});
			return buildIcoFile(sizes);
		}

		async function uploadCustomAppIcon(file) {
			const bytes = await fileToIcoBytes(file);
			if (bytes.length > APP_ICON_UPLOAD_MAX) throw new Error("icon-too-large");
			const response = await fetch(APP_ICON_ROUTE, {
				method: "POST",
				headers: { "content-type": "application/octet-stream" },
				body: bytes,
			});
			let info = {};
			try {
				info = await response.json();
			} catch {
				info = {};
			}
			if (!response.ok || info.ok === false) {
				const notReady = response.status === 401 || response.status === 403 || response.status === 404 || response.status === 405;
				throw new Error(notReady ? "应用图标服务未就绪（重启 DSH 一次后生效）" : appIconErrorMessage(String(info.error ?? "HTTP " + response.status)));
			}
			appIconStatus = { ...info, supported: info.supported !== false, ok: true };
			return appIconStatus;
		}

		async function removeCustomAppIcon() {
			const response = await fetch(APP_ICON_ROUTE, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ removeCustom: true }),
			});
			let info = {};
			try {
				info = await response.json();
			} catch {
				info = {};
			}
			if (!response.ok || info.ok === false) {
				throw new Error(appIconErrorMessage(String(info.error ?? "HTTP " + response.status)));
			}
			appIconStatus = { ...info, supported: info.supported !== false, ok: true };
			return appIconStatus;
		}

		/** @returns the current appearance state (stable reference until changed). */
		function getState() {
			return state;
		}

		/** Subscribe to appearance changes; @returns the disposer. */
		function subscribe(listener) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		}

		let flushTimer = null;
		function scheduleFlush() {
			if (flushTimer !== null) clearTimeout(flushTimer);
			flushTimer = setTimeout(() => {
				flushTimer = null;
				void fetch(STATE_ROUTE, {
					method: "PUT",
					headers: { "content-type": "application/json" },
					body: JSON.stringify(state),
				}).catch(() => {});
			}, 400);
		}

		/** Merge a patch into the state, persist both layers, repaint. */
		function setState(patch) {
			state = normalizeState({ ...state, ...patch });
			state.updatedAt = Date.now();
			writeLocal(state);
			updateSunny(state);
			applyChatWidth(state);
			scheduleFlush();
			notify();
			return state;
		}

		/** Pull the durable host state once (older hosts may lack the route). */
		async function hydrate() {
			try {
				const response = await fetch(STATE_ROUTE);
				if (!response.ok) return;
				const body = await response.json();
				const local = readLocal();
				const hostAt = Number(body?.updatedAt) || 0;
				const localAt = Number(local?.updatedAt) || 0;
				if (local !== null && localAt >= hostAt) {
					if (localAt > hostAt) scheduleFlush();
					return;
				}
				state = normalizeState(body);
				state.updatedAt = hostAt > 0 ? hostAt : Date.now();
				writeLocal(state);
				updateSunny(state);
				applyChatWidth(state);
				notify();
			} catch {
				// route absent — localStorage-only mode
			}
		}
		//#endregion

		//#region dsh-hana-appearance: applier
		let styleEl = null;
		let pageStyleEl = null;
		let paperLayer = null;
		let lastSelfSetAt = 0;
		/** Timestamp of the latest locale switch (DSH re-emits a built-in theme around it). */
		let lastLocaleChangeAt = 0;
		/* ── 晴天模式：HanaAgent 的程序化树影渲染器（按其构建产物逐函数移植） ── */
		const SUNNY_INK = "rgb(58, 66, 82)";
		const SUNNY_UNIT = 900;
		const SUNNY_SWAY_DEG = 3.9;
		const SUNNY_TIME_RATE = 1;
		const SUNNY_BLUR = 2.5;
		const SUNNY_SCALE = 1.6;
		const SUNNY_GROWTH = -0.2;
		const SUNNY_FPS = 30;
		const SUNNY_GUST_RISE = 2.5;
		const SUNNY_GUST_FALL = 3.5;
		const SUNNY_GUST_DECAY = 2.2;
		const SUNNY_GUST_MIN_GAP = 14;
		const SUNNY_GUST_GAP = 18;
		const SUNNY_GUST_NEXT = 6;
		const SUNNY_GUST_MAX = 0.9;
		const SUNNY_STEPS = 14;
		const SUNNY_AE = Math.PI / 180;
		const SUNNY_LAYERS = [
			{ name: "far", scale: 0.85, blur: 1.3, alpha: 0.6, sway: 1.15 },
			{ name: "mid", scale: 1, blur: 1, alpha: 0.82, sway: 1 },
			{ name: "near", scale: 1.15, blur: 0.75, alpha: 1, sway: 0.8 },
		];

		/** Seeded PRNG (exactly HanaAgent's mulberry32 variant). */
		function sunnyRng(seed) {
			let n = seed;
			return () => {
				n |= 0;
				n = (n + 1831565813) | 0;
				let t = Math.imul(n ^ (n >>> 15), 1 | n);
				t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
				return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
			};
		}

		const lerp = (a, b, t) => a + (b - a) * t;
		const smoothstep = (value) => {
			const t = Math.min(1, Math.max(0, value));
			return t * t * (3 - 2 * t);
		};

		function bezierPoint(limb, t) {
			const o = 1 - t;
			return {
				x: o * o * limb.p0.x + 2 * o * t * limb.c.x + t * t * limb.p1.x,
				y: o * o * limb.p0.y + 2 * o * t * limb.c.y + t * t * limb.p1.y,
			};
		}

		function bezierAngle(limb, t) {
			const dx = 2 * (1 - t) * (limb.c.x - limb.p0.x) + 2 * t * (limb.p1.x - limb.c.x);
			const dy = 2 * (1 - t) * (limb.c.y - limb.p0.y) + 2 * t * (limb.p1.y - limb.c.y);
			return Math.atan2(dy, dx);
		}

		function limbPoint(limb, t) {
			const point = bezierPoint(limb, t);
			const angle = bezierAngle(limb, t);
			const scaled = t * SUNNY_STEPS;
			const index = Math.min(SUNNY_STEPS - 1, Math.floor(scaled));
			const kink = lerp(limb.kinks[index], limb.kinks[index + 1], scaled - index);
			return { x: point.x - Math.sin(angle) * kink, y: point.y + Math.cos(angle) * kink };
		}

		function angleBlend(a, b, t) {
			return Math.atan2(
				Math.sin(a) * (1 - t) + Math.sin(b) * t,
				Math.cos(a) * (1 - t) + Math.cos(b) * t
			);
		}

		function pushLeaves(rng, limb, x, y, angle, scale, along, count, parentAngle) {
			for (let i = 0; i < count; i++) {
				const length = lerp(24, 74, Math.pow(rng(), 1.4)) * scale * lerp(1, 0.8, along);
				const widthFactor = 0.45 + 0.55 * rng();
				limb.leaves.push({
					x: x + (rng() - 0.5) * 4 * scale,
					y: y + (rng() - 0.5) * 4 * scale,
					a: angleBlend(angle + (rng() - 0.5) * 110 * SUNNY_AE, parentAngle, 0.5),
					l: length,
					w: length * (0.2 + rng() * 0.08) * widthFactor,
					asym: 0.65 + rng() * 0.7,
				});
			}
		}

		function buildLimb(rng, length, scale, t, depth, angle) {
			const baseAngle = Math.PI / 2 - angle;
			const cosA = Math.cos(baseAngle);
			const sinA = Math.sin(baseAngle);
			const bow = length * (depth === 0 ? 0.3 : 0.4) * (0.7 + rng() * 0.6);
			const limb = {
				p0: { x: 0, y: 0 },
				c: { x: length * 0.55 + cosA * bow * 0.12, y: sinA * bow * 0.12 },
				p1: {
					x: length * 0.88 + cosA * bow,
					y: sinA * bow + (rng() - 0.5) * length * 0.06,
				},
				width: (depth === 0 ? 8 : 4) * scale,
				kinks: Array.from({ length: SUNNY_STEPS + 1 }, (_, index) =>
					index === 0 ? 0 : (rng() - 0.5) * length * 0.022
				),
				leaves: [],
				twigs: [],
				children: [],
				phase: [rng() * 99, rng() * 99, rng() * 99],
			};
			let step = length * (depth === 0 ? 0.3 : 0.1);
			while (step < length * 0.95) {
				const t0 = step / length;
				const point = limbPoint(limb, t0);
				const twist = bezierAngle(limb, t0);
				const side = rng() < 0.5 ? -1 : 1;
				const twigAngle = angleBlend(twist + side * (25 + rng() * 45) * SUNNY_AE, baseAngle, 0.3);
				const twigLength = (4 + rng() * 16) * scale;
				const tip = { x: point.x + Math.cos(twigAngle) * twigLength, y: point.y + Math.sin(twigAngle) * twigLength };
				limb.twigs.push({
					x0: point.x,
					y0: point.y,
					x1: tip.x,
					y1: tip.y,
					w: limb.width * lerp(0.5, 0.3, t0),
				});
				pushLeaves(rng, limb, tip.x, tip.y, twigAngle, scale, t0, 2 + Math.floor(rng() * 4), baseAngle);
				step += (12 + Math.pow(rng(), 2) * 46) * scale / 0.6;
			}
			const tip = limbPoint(limb, 1);
			pushLeaves(rng, limb, tip.x, tip.y, bezierAngle(limb, 1), scale, 1, 3 + Math.floor(rng() * 2), baseAngle);
			const leafBurn = Math.round(limb.leaves.length * 0.035);
			for (let i = 0; i < leafBurn * 4; i++) rng();
			if (depth === 0) {
				const childCount = 2 + Math.floor(rng() * 3);
				for (let i = 0; i < childCount; i++) {
					const at = 0.18 + (i / childCount) * 0.62 + rng() * 0.08;
					const point = limbPoint(limb, at);
					const side = rng() < 0.5 ? 1 : -1;
					const childAngle = bezierAngle(limb, at) + side * (20 + rng() * 25) * SUNNY_AE;
					const child = buildLimb(rng, length * (0.3 + rng() * 0.3), scale * lerp(1, 0.85, at), 0.6, 1, childAngle);
					child.width = Math.min(child.width, limb.width * lerp(0.8, 0.4, at));
					limb.children.push({ ...child, attach: { x: point.x, y: point.y, a: childAngle } });
				}
			}
			return limb;
		}

		/** Build the seeded tree: clusters with layer / anchor / limb (HanaAgent Or). */
		function buildSunnyTree(seed) {
			const rng = sunnyRng(seed);
			const clusterCount = Math.round(3 + 6 * SUNNY_GROWTH);
			const branchTaper = 0.6 + 0.4 * SUNNY_GROWTH;
			const clusters = [];
			for (let index = 0; index < clusterCount; index++) {
				const layerIndex = index % 3 === 0 ? 0 : index % 3 === 1 ? 1 : 2;
				const layer = SUNNY_LAYERS[layerIndex];
				const anchor =
					rng() < 0.55
						? {
								fx: 0.5 + Math.pow(rng(), 0.6) * 0.58,
								fy: -0.04,
								a: (125 + rng() * 25) * SUNNY_AE,
							}
						: { fx: 1.04, fy: rng() * 0.4, a: (168 + rng() * 22) * SUNNY_AE };
				const scale = layer.scale;
				const length = SUNNY_UNIT * (0.32 + Math.pow(rng(), 1.2) * 0.45) * scale;
				const limb = buildLimb(rng, length, scale, branchTaper, 0, anchor.a);
				clusters.push({
					layerIndex,
					layer,
					anchor,
					limb,
					gustDelay: (1 - Math.min(1, anchor.fx)) * 2.2,
				});
			}
			clusters.sort((a, b) => a.layerIndex - b.layerIndex);
			return { seed, clusters };
		}

		const sunnyTreeScale = (height) => (height / SUNNY_UNIT) * SUNNY_SCALE;

		/** Bounds of one limb (HanaAgent Dr). */
		function limbBounds(limb) {
			let minX = 0;
			let minY = 0;
			let maxX = 0;
			let maxY = 0;
			const include = (x, y, pad) => {
				minX = Math.min(minX, x - pad);
				minY = Math.min(minY, y - pad);
				maxX = Math.max(maxX, x + pad);
				maxY = Math.max(maxY, y + pad);
			};
			for (let i = 0; i <= SUNNY_STEPS; i++) {
				const point = limbPoint(limb, i / SUNNY_STEPS);
				include(point.x, point.y, limb.width);
			}
			for (const leaf of limb.leaves) include(leaf.x, leaf.y, leaf.l + 2);
			return { minX, minY, maxX, maxY };
		}

		/** Render one limb (with its twigs + leaves) into a blurred offscreen canvas. */
		function renderLimb(limb, layer, scale, dpr) {
			const canvasScale = dpr * scale;
			const blur = (SUNNY_BLUR * layer.blur) / scale;
			const bounds = limbBounds(limb);
			const pad = blur * 2.5 + 6;
			const width = bounds.maxX - bounds.minX + pad * 2;
			const height = bounds.maxY - bounds.minY + pad * 2;
			const pixelWidth = Math.ceil(width * canvasScale);
			const pixelHeight = Math.ceil(height * canvasScale);
			const offsetX = pad - bounds.minX;
			const offsetY = pad - bounds.minY;
			const raw = document.createElement("canvas");
			raw.width = pixelWidth;
			raw.height = pixelHeight;
			const g = raw.getContext("2d");
			if (g === null) throw new Error("2D canvas is unavailable");
			g.scale(canvasScale, canvasScale);
			g.translate(offsetX, offsetY);
			g.fillStyle = SUNNY_INK;
			g.strokeStyle = SUNNY_INK;
			g.lineCap = "round";
			for (let i = 0; i < SUNNY_STEPS; i++) {
				const current = limbPoint(limb, i / SUNNY_STEPS);
				const next = limbPoint(limb, (i + 1) / SUNNY_STEPS);
				g.lineWidth = lerp(limb.width, limb.width * 0.3, i / SUNNY_STEPS);
				g.beginPath();
				g.moveTo(current.x, current.y);
				g.lineTo(next.x, next.y);
				g.stroke();
			}
			for (const twig of limb.twigs) {
				g.lineWidth = Math.max(0.8, twig.w);
				g.beginPath();
				g.moveTo(twig.x0, twig.y0);
				g.lineTo(twig.x1, twig.y1);
				g.stroke();
			}
			for (const leaf of limb.leaves) {
				const length = leaf.l;
				const breadth = leaf.w;
				g.save();
				g.translate(leaf.x, leaf.y);
				g.rotate(leaf.a);
				g.lineWidth = 0.8;
				g.beginPath();
				g.moveTo(0, 0);
				g.lineTo(length * 0.12, 0);
				g.stroke();
				g.beginPath();
				g.moveTo(length * 0.1, 0);
				g.bezierCurveTo(length * 0.25, -breadth * 1.15, length * 0.7, -breadth * 0.95, length, 0);
				g.bezierCurveTo(length * 0.7, breadth * 0.95 * leaf.asym, length * 0.25, breadth * 1.15 * leaf.asym, length * 0.1, 0);
				g.fill();
				g.restore();
			}
			const blurred = document.createElement("canvas");
			blurred.width = pixelWidth;
			blurred.height = pixelHeight;
			const b = blurred.getContext("2d");
			if (b === null) throw new Error("2D canvas is unavailable");
			if (blur > 0) b.filter = `blur(${blur * canvasScale}px)`;
			b.drawImage(raw, 0, 0);
			raw.width = 0;
			raw.height = 0;
			return { canvas: blurred, ox: offsetX, oy: offsetY, w: width, h: height };
		}

		/** Build the per-cluster canvas set (HanaAgent Hr). */
		function buildSunnyCanvases(tree, scale, dpr) {
			return tree.clusters.map((cluster) => ({
				main: renderLimb(cluster.limb, cluster.layer, scale, dpr),
				children: cluster.limb.children.map((child) => renderLimb(child, cluster.layer, scale, dpr)),
			}));
		}

		/** Sum-of-sines wind wave (HanaAgent St). */
		function sunnyWave(time, phase, rate) {
			return (
				Math.sin(time * 0.41 * rate + phase[0]) * 0.6 +
				Math.sin(time * 0.67 * rate + phase[1]) * 0.3 +
				Math.sin(time * 1.13 * rate + phase[2]) * 0.1
			);
		}

		/** Gust envelope: 0 lift, 1 hold, then exponential fade (HanaAgent Wr). */
		function sunnyGustEnvelope(value) {
			if (value < 0) return 0;
			if (value < SUNNY_GUST_RISE) return smoothstep(value / SUNNY_GUST_RISE);
			if (value < SUNNY_GUST_FALL) return 1;
			return Math.exp(-(value - SUNNY_GUST_FALL) / SUNNY_GUST_DECAY);
		}

		/** Schedule the next gust (HanaAgent $r). */
		function nextSunnyGust(gust, time, random = Math.random) {
			if (time <= gust.next) return gust;
			return { start: time, next: time + SUNNY_GUST_MIN_GAP + random() * SUNNY_GUST_GAP };
		}

		/** Draw one animated frame (HanaAgent Ur). */
		function drawSunnyFrame(ctx, tree, canvases, options) {
			const { time, gust, width, height, dpr, scale } = options;
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			const swayBase = SUNNY_SWAY_DEG * SUNNY_AE;
			tree.clusters.forEach((cluster, index) => {
				const layers = canvases[index];
				if (!layers) return;
				const gustStrength = sunnyGustEnvelope(time - gust.start - cluster.gustDelay) * SUNNY_GUST_MAX;
				const limb = cluster.limb;
				const sway = swayBase * cluster.layer.sway * (sunnyWave(time, limb.phase, 1) * (1 + gustStrength) + gustStrength * 0.8);
				ctx.save();
				ctx.globalAlpha = cluster.layer.alpha;
				ctx.translate(cluster.anchor.fx * width, cluster.anchor.fy * height);
				ctx.rotate(cluster.anchor.a + sway);
				ctx.scale(scale, scale);
				ctx.drawImage(layers.main.canvas, -layers.main.ox, -layers.main.oy, layers.main.w, layers.main.h);
				limb.children.forEach((child, childIndex) => {
					const childLayers = layers.children[childIndex];
					if (!childLayers) return;
					const childSway =
						swayBase * cluster.layer.sway * 1.3 * (sunnyWave(time, child.phase, 1.7) * (1 + gustStrength * 1.4) + gustStrength * 0.6);
					ctx.save();
					ctx.translate(child.attach.x, child.attach.y);
					ctx.rotate(child.attach.a + childSway);
					ctx.drawImage(childLayers.canvas, -childLayers.ox, -childLayers.oy, childLayers.w, childLayers.h);
					ctx.restore();
				});
				ctx.restore();
			});
		}

		/* ── Sunny mode overlay lifecycle ── */
		let sunnyWarmEl = null;
		let sunnyShadeEl = null;
		let sunnyTree = null;
		let sunnySeedKey = null;
		let sunnyCanvases = [];
		let sunnyFrame = 0;
		let sunnyTime = 0;
		let sunnyGust = { start: -999, next: SUNNY_GUST_NEXT };
		let sunnyLast = 0;
		let sunnyAcc = 0;
		let sunnyW = 0;
		let sunnyH = 0;
		let sunnyDpr = 1;
		let sunnyScale = 1;
		let sunnyResizeBound = false;

		function clearSunnyCanvases() {
			for (const layer of sunnyCanvases) {
				for (const item of [layer.main, ...layer.children]) {
					if (item && item.canvas) {
						item.canvas.width = 0;
						item.canvas.height = 0;
					}
				}
			}
			sunnyCanvases = [];
		}

		function resizeSunny() {
			if (sunnyShadeEl === null || sunnyTree === null) return;
			sunnyDpr = Math.min(window.devicePixelRatio || 1, 2);
			sunnyW = window.innerWidth;
			sunnyH = window.innerHeight || 800;
			sunnyShadeEl.width = Math.round(sunnyW * sunnyDpr);
			sunnyShadeEl.height = Math.round(sunnyH * sunnyDpr);
			sunnyScale = sunnyTreeScale(sunnyH);
			clearSunnyCanvases();
			sunnyCanvases = buildSunnyCanvases(sunnyTree, sunnyScale, sunnyDpr);
		}

		function drawSunny() {
			if (sunnyShadeEl === null || sunnyTree === null) return;
			const ctx = sunnyShadeEl.getContext("2d");
			if (ctx === null) return;
			drawSunnyFrame(ctx, sunnyTree, sunnyCanvases, {
				time: sunnyTime,
				gust: sunnyGust,
				width: sunnyW,
				height: sunnyH,
				dpr: sunnyDpr,
				scale: sunnyScale,
			});
		}

		function sunnyTick(now) {
			if (sunnyShadeEl === null) return;
			sunnyFrame = requestAnimationFrame(sunnyTick);
			const delta = Math.min(100, now - sunnyLast);
			sunnyLast = now;
			sunnyAcc += delta;
			const frameMs = 1000 / SUNNY_FPS;
			if (sunnyAcc < frameMs) return;
			const seconds = sunnyAcc / 1000;
			sunnyAcc = 0;
			if (document.hidden) return;
			sunnyTime += seconds * SUNNY_TIME_RATE;
			sunnyGust = nextSunnyGust(sunnyGust, sunnyTime);
			drawSunny();
		}

		/** Remove the sunny overlay layers and stop its animation. */
		function stopSunny() {
			if (sunnyFrame !== 0) cancelAnimationFrame(sunnyFrame);
			sunnyFrame = 0;
			clearSunnyCanvases();
			sunnyTree = null;
			sunnySeedKey = null;
			if (sunnyResizeBound) window.removeEventListener("resize", resizeSunny);
			sunnyResizeBound = false;
			if (sunnyWarmEl !== null) sunnyWarmEl.remove();
			sunnyWarmEl = null;
			if (sunnyShadeEl !== null) sunnyShadeEl.remove();
			sunnyShadeEl = null;
			for (const id of ["dsh-hana-appearance-sunny", "dsh-hana-appearance-sunny-warm"]) {
				const leftover = document.getElementById?.(id);
				if (leftover) leftover.remove();
			}
			try {
				const staleLayers = document.querySelectorAll?.('canvas[style*="21474829"], div[style*="21474829"]') ?? [];
				for (const stale of staleLayers) stale.remove();
			} catch {
				// cleanup is best-effort
			}
		}

		/** Start or refresh the sunny-mode tree-shadow overlay. */
		function updateSunny(next) {
			if (next.sunnyMode !== true) {
				stopSunny();
				return;
			}
			const seed = typeof next.sunnySeed === "number" && Number.isFinite(next.sunnySeed) ? next.sunnySeed : 0;
			const key = String(seed);
			if (sunnyWarmEl === null) {
				sunnyWarmEl = document.createElement("div");
				sunnyWarmEl.id = "dsh-hana-appearance-sunny-warm";
				sunnyWarmEl.style.cssText =
					"position:fixed;inset:0;z-index:2147482980;pointer-events:none;mix-blend-mode:soft-light;background:radial-gradient(120% 90% at 100% 0%, rgba(255, 214, 150, .32), rgba(255, 214, 150, 0) 70%);";
				document.body.appendChild(sunnyWarmEl);
			}
			if (sunnyShadeEl === null) {
				sunnyShadeEl = document.createElement("canvas");
				sunnyShadeEl.id = "dsh-hana-appearance-sunny";
				sunnyShadeEl.style.cssText =
					"position:fixed;inset:0;width:100%;height:100%;z-index:2147482981;pointer-events:none;mix-blend-mode:multiply;opacity:0.1;";
				document.body.appendChild(sunnyShadeEl);
			}
			if (sunnySeedKey !== key || sunnyTree === null) {
				sunnySeedKey = key;
				sunnyTree = buildSunnyTree(seed);
				sunnyTime = 0;
				sunnyGust = { start: -999, next: SUNNY_GUST_NEXT };
				resizeSunny();
				drawSunny();
			} else if (sunnyShadeEl.width === 0) {
				resizeSunny();
				drawSunny();
			}
			if (!sunnyResizeBound) {
				window.addEventListener("resize", resizeSunny);
				sunnyResizeBound = true;
			}
			if (sunnyFrame === 0) {
				sunnyLast = performance.now();
				sunnyAcc = 0;
				sunnyFrame = requestAnimationFrame(sunnyTick);
			}
		}

				/** DSH content typography variables consumed by the shipped chat UI. */
		const CONTENT_BASE_FONT_SIZE = 14;
		const CONTENT_BASE_SECONDARY_SIZE = 13;

		/** Chat width options → DSH's own conversation width preference (px). */
		const CHAT_WIDTH_PX = { "640": 640, "720": 720, "800": 800, unlimited: 99999 };
		const DSH_CONTENT_WIDTH_KEY = "dsh.conversation.contentWidth";

		/** Hide decorative overlays (paper texture, sunny light) over media viewers. */
		function syncMediaViewer() {
			try {
				const root = document.documentElement;
				if (root === null || root === undefined) return;
				const viewportArea = (window.innerWidth || 1) * (window.innerHeight || 1);
				let open = false;
				const dialogs = document.querySelectorAll?.('[role="dialog"][aria-modal="true"]') ?? [];
				for (const dialog of dialogs) {
					if (dialog.hidden === true || dialog.getAttribute?.("aria-hidden") === "true") continue;
					const box = dialog.getBoundingClientRect?.();
					if (box !== undefined && (box.width === 0 || box.height === 0)) continue;
					for (const image of dialog.querySelectorAll?.("img") ?? []) {
						const rect = image.getBoundingClientRect?.();
						if (rect !== undefined && rect.width * rect.height >= viewportArea * 0.45) {
							open = true;
							break;
						}
					}
					if (open) break;
				}
				if (open) root.setAttribute("data-hana-media-open", "");
				else root.removeAttribute("data-hana-media-open");
			} catch {
				// detection is best-effort
			}
		}

		/** Build the dynamic CSS sheet: reading font + content typography. */
		function buildCss(next) {
			const offset = Math.max(-2, Math.min(2, Number(next.fontSizeOffset) || 0));
			const bodySize = CONTENT_BASE_FONT_SIZE + offset;
			const secondarySize = CONTENT_BASE_SECONDARY_SIZE + offset;
			const font = resolveFontStack(next);
			return [
				// DSH's official font hooks (ui-theme base.css passes these through body).
				`:root { --dsh-font-family-text: ${font}; --dsw-font-family: ${font}; }`,
				`body { --dsh-font-family-text: ${font}; --dsw-font-family: ${font}; font-family: ${font} !important; }`,
				// Reading surface scoped variable for components that read it inside chat.
				`[data-slot^="conversation."] { --dsw-font-family: ${font}; }`,
				// DSH content typography variables consumed by the shipped chat UI.
				`:root {`,
				`  --dsh-content-font-size: ${bodySize}px;`,
				`  --dsh-content-font-delta: ${offset}px;`,
				`  --dsh-content-font-size-secondary: ${secondarySize}px;`,
				`  --dsh-content-font-delta-secondary: ${offset}px;`,
				`}`,
			].join("\n");
		}

		/* DSH owns the conversation width axis (ui-conversation
		 * ConversationWidthControls): it reads `dsh.conversation.contentWidth`,
		 * clamps it to [640, columnWidth - 176] and writes `--dsh-chat-user-width`
		 * on the conversation body's parent whenever that column resizes. We must
		 * write the SAME value it would write — overriding `--dsh-chat-content-width`
		 * directly with our raw pixels made DSH and the plugin take turns
		 * overwriting each other, which is the width jitter. */
		const DSH_WIDTH_MIN = 640;
		const DSH_WIDTH_EDGE_BUDGET = 176;

		/** Same math as DSH's resolveContentWidth(columnWidth, preference). */
		function resolveDshContentWidth(columnWidth, preference) {
			const max = Math.max(DSH_WIDTH_MIN, columnWidth - DSH_WIDTH_EDGE_BUDGET);
			return Math.round(Math.min(Math.max(preference, DSH_WIDTH_MIN), max));
		}

		/** Write the content typography variables onto the live DOM. Width is DSH's job. */
		function syncChatDom() {
			try {
				const offset = Math.max(-2, Math.min(2, Number(state.fontSizeOffset) || 0));
				const bodySize = CONTENT_BASE_FONT_SIZE + offset;
				const secondarySize = CONTENT_BASE_SECONDARY_SIZE + offset;
				const root = document.documentElement;
				root.style.setProperty("--dsh-content-font-size", bodySize + "px");
				root.style.setProperty("--dsh-content-font-delta", offset + "px");
				root.style.setProperty("--dsh-content-font-size-secondary", secondarySize + "px");
				root.style.setProperty("--dsh-content-font-delta-secondary", offset + "px");
				if (document.body !== null && document.body !== undefined) {
					document.body.style.setProperty("--dsh-content-font-size", bodySize + "px");
					document.body.style.setProperty("--dsh-content-font-delta", offset + "px");
					document.body.style.setProperty("--dsh-content-font-size-secondary", secondarySize + "px");
					document.body.style.setProperty("--dsh-content-font-delta-secondary", offset + "px");
				}
				const slots = document.querySelectorAll?.('[data-slot^="conversation."]') ?? [];
				for (const slot of slots) {
					let node = slot;
					for (let depth = 0; depth < 16 && node !== null && node !== undefined && node !== document.body; depth++) {
						// Drop inline width overrides left behind by older builds.
						node.style.removeProperty("--dsh-chat-content-width");
						node.style.removeProperty("--dsh-composer-card-max-width");
						node.style.setProperty("--dsh-content-font-size", bodySize + "px");
						node.style.setProperty("--dsh-content-font-delta", offset + "px");
						node.style.setProperty("--dsh-content-font-size-secondary", secondarySize + "px");
						node.style.setProperty("--dsh-content-font-delta-secondary", offset + "px");
						node = node.parentElement;
					}
				}
			} catch {
				// DOM sync is best-effort
			}
		}

		/** Mirror the chosen width through DSH's own `--dsh-chat-user-width` variable. */
		function applyChatWidthToDom(next) {
			try {
				const width = CHAT_WIDTH_PX[next.chatWidth] ?? 720;
				const slots = document.querySelectorAll?.('[data-slot^="conversation."]') ?? [];
				for (const slot of slots) {
					let node = slot;
					for (let depth = 0; depth < 16 && node !== null && node !== undefined && node !== document.body; depth++) {
						const column = Number.parseFloat(node.style.getPropertyValue("--dsh-conversation-column-width"));
						if (Number.isFinite(column) && column > 0) {
							node.style.setProperty("--dsh-chat-user-width", resolveDshContentWidth(column, width) + "px");
							break;
						}
						node = node.parentElement;
					}
				}
			} catch {
				// best-effort
			}
		}

		let chatDomObserver = null;
		let chatDomTimer = 0;

		/** Debounced re-sync (chat mounts after boot, resize is cheap to follow). */
		function scheduleChatDomSync() {
			if (chatDomTimer !== 0) return;
			chatDomTimer = setTimeout(() => {
				chatDomTimer = 0;
				syncChatDom();
				syncMediaViewer();
			}, 120);
		}

		/** Keep the live DOM in sync as the conversation surface mounts and resizes. */
		function watchChatDom() {
			syncChatDom();
			if (chatDomObserver !== null) return;
			if (typeof MutationObserver === "undefined") return;
			chatDomObserver = new MutationObserver(() => {
				syncMediaViewer();
				scheduleChatDomSync();
			});
			chatDomObserver.observe(document.body, { childList: true, subtree: true });
			window.addEventListener("resize", scheduleChatDomSync);
			document.addEventListener(
				"pointerdown",
				(event) => {
					// Start the fade while the lightbox is still opening (conversation images only).
					try {
						const target = event.target;
						const image = target?.closest?.("img");
						if (image === null || image === undefined) return;
						if (image.closest?.('[data-slot^="conversation."]') === null) return;
						document.documentElement.setAttribute("data-hana-media-open", "");
						setTimeout(syncMediaViewer, 900);
					} catch {
						// best-effort
					}
				},
				true
			);
			syncMediaViewer();
		}

		/** Persist the DSH width preference and mirror it through DSH's own variable. */
		let appliedChatWidth = null;
		function applyChatWidth(next) {
			const width = CHAT_WIDTH_PX[next.chatWidth] ?? 720;
			const preference = String(width);
			// Only touch storage/DOM when HanaUI itself changes the width: unrelated
			// settings repaints must not undo a drag of DSH's own width handles.
			if (appliedChatWidth === preference) return;
			appliedChatWidth = preference;
			try {
				window.localStorage.setItem(DSH_CONTENT_WIDTH_KEY, preference);
			} catch {
				// preference write is best-effort
			}
			applyChatWidthToDom(next);
		}

		/**
		 * Paint the whole appearance onto the running UI: font stack, paper
		 * texture layer (html[data-hana-paper-texture] + strength variable,
		 * matching HanaAgent's PaperTextureLayer) and the selected theme.
		 */
		function paint(ctx) {
			if (styleEl === null) {
				styleEl = document.createElement("style");
				styleEl.id = "dsh-hana-appearance-style";
				document.head.appendChild(styleEl);
			}
			styleEl.textContent = buildCss(state);
			applyChatWidth(state);
			syncChatDom();
			const root = document.documentElement;
			if (state.texture === "off") {
				root.removeAttribute("data-hana-paper-texture");
			} else {
				root.setAttribute("data-hana-paper-texture", state.texture);
			}
			root.style.setProperty("--paper-texture-strength", String(TEXTURE_STRENGTH_VALUES[clampStrength(state.textureStrength) - 1]));
			const current = ctx.theme.getTheme().preference;
			if (state.theme !== DEFAULT_SKIN) {
				if (current !== state.theme) {
					lastSelfSetAt = Date.now();
					ctx.theme.setTheme(state.theme);
				}
			} else if (THEME_BY_ID.has(current)) {
				lastSelfSetAt = Date.now();
				ctx.theme.setTheme(DEFAULT_SKIN);
			}
			void current;
			try {
				updateSunny(state);
			} catch {
				// decorative overlay only
			}
		}

		/** Disposer bundle for the applier's DOM nodes. */
		function disposeApplier() {
			if (styleEl !== null) styleEl.remove();
			styleEl = null;
			if (pageStyleEl !== null) pageStyleEl.remove();
			pageStyleEl = null;
			if (paperLayer !== null) paperLayer.remove();
			paperLayer = null;
			stopSunny();
			try {
				document.documentElement.removeAttribute("data-hana-paper-texture");
			} catch {
				// document may already be gone during teardown
			}
		}
		//#endregion

		//#region dsh-hana-appearance: page UI (ported settings look)
		const C = react.createElement;

		/* Inline styles everywhere: the settings surface's own style scoping
		 * must not drop the layout. Colors come from per-page CSS variables
		 * (--hana-*) so the page keeps HanaAgent's ink strength in every theme. */
		const CARD = {
			background: "var(--hana-card)",
			border: "1px solid var(--hana-border)",
			borderRadius: 10,
			overflow: "hidden",
		};
		const ROW = {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 16,
			padding: "14px 16px",
		};
		const ROW_TEXT = { display: "flex", flexDirection: "column", gap: 3, minWidth: 0, flex: 1 };
		const ROW_LABEL = { fontSize: 14, lineHeight: 1.4, color: "var(--hana-text)" };
		const ROW_HINT = { fontSize: 12, lineHeight: 1.5, color: "var(--hana-muted)" };
		const DIVIDER = { borderTop: "1px solid var(--hana-border)" };
		const SECTION = { marginBottom: 32 };
		const SECTION_HEAD = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, margin: "0 0 12px" };
		const SECTION_TITLE = {
			fontSize: 17,
			fontWeight: 700,
			letterSpacing: "0.05em",
			color: "var(--hana-text)",
			margin: 0,
		};
		const SECTION_DESC = { fontSize: 12, lineHeight: 1.5, color: "var(--hana-muted)", margin: "-4px 0 12px" };
		const SEG_BOX = {
			display: "inline-flex",
			alignItems: "center",
			gap: 2,
			padding: 2,
			borderRadius: 8,
			background: "var(--hana-seg-bg)",
		};
		const SEG_BTN = {
			border: "none",
			font: "inherit",
			fontSize: 14,
			lineHeight: 1.3,
			padding: "6px 14px",
			borderRadius: 6,
			cursor: "pointer",
			whiteSpace: "nowrap",
		};
		const LINK_BTN = {
			background: "transparent",
			border: "none",
			font: "inherit",
			fontSize: 13,
			color: "var(--hana-muted)",
			cursor: "pointer",
			padding: "4px 6px",
		};
		const UPLOAD_BTN = {
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "6px 12px",
			borderRadius: 8,
			border: "1px solid var(--hana-border)",
			background: "var(--hana-card)",
			color: "var(--hana-text)",
			font: "inherit",
			fontSize: 13,
			cursor: "pointer",
			whiteSpace: "nowrap",
		};

		const LANGUAGE_OPTIONS = [
			{ value: "zh-CN", label: "简体中文" },
			{ value: "zh-TW", label: "繁體中文" },
			{ value: "ja", label: "日本語" },
			{ value: "ko", label: "한국어" },
			{ value: "en", label: "English" },
		];
		const TIMEZONE_OPTIONS = [
			{ value: "Asia/Shanghai", label: "Asia/Shanghai (GMT+8)" },
			{ value: "Asia/Tokyo", label: "Asia/Tokyo (GMT+9)" },
			{ value: "Asia/Seoul", label: "Asia/Seoul (GMT+9)" },
			{ value: "Asia/Singapore", label: "Asia/Singapore (GMT+8)" },
			{ value: "Asia/Hong_Kong", label: "Asia/Hong Kong (GMT+8)" },
			{ value: "Asia/Taipei", label: "Asia/Taipei (GMT+8)" },
			{ value: "Asia/Kolkata", label: "Asia/Kolkata (GMT+5:30)" },
			{ value: "Europe/Berlin", label: "Europe/Berlin (GMT+1)" },
			{ value: "UTC", label: "UTC (GMT+0)" },
		];
		const CHAT_WIDTH_OPTIONS = [
			{ value: "640", label: "640" },
			{ value: "720", label: "720" },
			{ value: "800", label: "800" },
			{ value: "unlimited", label: "不限制" },
		];
		const OFFSET_OPTIONS = [
			{ value: -2, label: "-2" },
			{ value: -1, label: "-1" },
			{ value: 0, label: "0" },
			{ value: 1, label: "+1" },
			{ value: 2, label: "+2" },
		];
		const FONT_OPTIONS = [
			{ id: "serif", name: "衬线", desc: "适合正文阅读" },
			{ id: "sans", name: "非衬线", desc: "更接近系统界面" },
			{ id: "wenkai", name: "霞鹜新致宋", desc: "开源宋体 · 需下载 10.0MB" },
		];
		const EDITOR_FONT_OPTIONS = [
			{ value: "follow", label: "跟随阅读字体" },
			{ value: "serif", label: "衬线" },
			{ value: "sans", label: "非衬线" },
			{ value: "wenkai", label: "霞鹜新致宋" },
			{ value: "custom", label: "自定义字体" },
		];

		/** One titled settings section (title outside the card, like HanaAgent). */
		function Section({ title, description, action, children }) {
			return C(
				"section",
				{ style: SECTION },
				title ? C("div", { style: SECTION_HEAD }, C("h2", { style: SECTION_TITLE }, title), action ?? null) : null,
				description ? C("div", { style: SECTION_DESC }, description) : null,
				children
			);
		}

		/** Card body: consecutive rows with full-bleed hairline dividers. */
		function Card({ rows }) {
			const items = (rows ?? []).filter(Boolean).map((row, index) =>
				index === 0 ? row : C("div", { key: `divider-${index}`, style: DIVIDER }, row)
			);
			return C("div", { style: CARD }, items);
		}

		/** One label/hint + control row. */
		function Row({ label, hint, control }) {
			return C(
				"div",
				{ style: ROW },
				C(
					"div",
					{ style: ROW_TEXT },
					C("span", { style: ROW_LABEL }, label),
					hint ? C("span", { style: ROW_HINT }, hint) : null
				),
				C("div", { style: { flexShrink: 0, display: "flex", alignItems: "center" } }, control)
			);
		}

		/** Pill segmented control. */
		function Segmented({ options, value, onChange }) {
			return C(
				"div",
				{ style: SEG_BOX },
				options.map((option) =>
					C(
						"button",
						{
							key: String(option.value),
							type: "button",
							onClick: () => onChange(option.value),
							style: {
								...SEG_BTN,
								background: option.value === value ? "var(--hana-seg-active)" : "transparent",
								color: option.value === value ? "var(--hana-text)" : "var(--hana-muted)",
								boxShadow: option.value === value ? "0 1px 2px rgba(0, 0, 0, 0.08)" : "none",
							},
						},
						option.label
					)
				)
			);
		}

		/** HanaAgent-style dropdown: a real popup panel, not a native <select>. */
		function Dropdown({ options, value, onChange, ariaLabel, placeholder }) {
			const [open, setOpen] = react.useState(false);
			const [rect, setRect] = react.useState(null);
			const [hover, setHover] = react.useState(-1);
			const btnRef = react.useRef(null);
			const popRef = react.useRef(null);

			react.useEffect(() => {
				if (!open) return undefined;
				const onDown = (event) => {
					if (btnRef.current && btnRef.current.contains(event.target)) return;
					if (popRef.current && popRef.current.contains(event.target)) return;
					setOpen(false);
				};
				const onKey = (event) => {
					if (event.key === "Escape") setOpen(false);
				};
				document.addEventListener("mousedown", onDown, true);
				document.addEventListener("keydown", onKey);
				return () => {
					document.removeEventListener("mousedown", onDown, true);
					document.removeEventListener("keydown", onKey);
				};
			}, [open]);

			const toggle = () => {
				if (!open && btnRef.current) {
					const r = btnRef.current.getBoundingClientRect();
					setRect({ top: r.bottom + 4, left: r.left, width: Math.max(r.width, 220) });
					setHover(Math.max(0, options.findIndex((option) => option.value === value)));
				}
				setOpen(!open);
			};

			const selected = options.find((option) => option.value === value);

			return C(
				"div",
				{ style: { position: "relative", display: "inline-block" } },
				C(
					"button",
					{
						ref: btnRef,
						type: "button",
						"aria-label": ariaLabel,
						"aria-expanded": open,
						onClick: toggle,
						style: {
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							gap: 12,
							minWidth: 220,
							maxWidth: 320,
							padding: "8px 12px",
							font: "inherit",
							fontSize: 14,
							color: "var(--hana-text)",
							background: "var(--hana-card)",
							border: "1px solid var(--hana-border)",
							borderRadius: 8,
							cursor: "pointer",
							textAlign: "left",
						},
					},
					C("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, selected ? selected.label : placeholder ?? ""),
					C("span", { style: { color: "var(--hana-muted)", fontSize: 11 } }, "▾")
				),
				open && rect
					? C(
							"div",
							{
								ref: popRef,
								style: {
									position: "fixed",
									top: rect.top,
									left: rect.left,
									width: rect.width,
									maxHeight: 280,
									overflowY: "auto",
									background: "var(--hana-card)",
									border: "1px solid var(--hana-border)",
									borderRadius: 8,
									boxShadow: "0 10px 28px rgba(0, 0, 0, 0.14)",
									padding: 4,
									zIndex: 10000,
								},
							},
							options.map((option, index) =>
								C(
									"button",
									{
										key: String(option.value),
										type: "button",
										onMouseEnter: () => setHover(index),
										onClick: () => {
											onChange(option.value);
											setOpen(false);
										},
										style: {
											display: "block",
											width: "100%",
											textAlign: "left",
											border: "none",
											background: hover === index ? "var(--hana-seg-bg)" : "transparent",
											color: option.value === value ? "var(--hana-accent)" : "var(--hana-text)",
											font: "inherit",
											fontSize: 14,
											padding: "9px 12px",
											borderRadius: 6,
											cursor: "pointer",
										},
									},
									option.label
								)
							)
						)
					: null
			);
		}

		/** Numeric box with a unit suffix (HanaAgent NumberInput look). */
		function NumberBox({ value, onChange, min, max, step, unit }) {
			return C(
				"div",
				{
					style: {
						display: "flex",
						alignItems: "center",
						gap: 6,
						minWidth: 130,
						justifyContent: "flex-end",
						padding: "7px 12px",
						border: "1px solid var(--hana-border)",
						borderRadius: 8,
						background: "var(--hana-card)",
					},
				},
				C("input", {
					type: "number",
					value,
					min,
					max,
					step,
					onChange: (event) => {
						const next = Number(event.target.value);
						if (Number.isFinite(next)) onChange(next);
					},
					style: {
						width: 70,
						border: "none",
						outline: "none",
						background: "transparent",
						font: "inherit",
						fontSize: 14,
						color: "var(--hana-text)",
						textAlign: "right",
					},
				}),
				unit ? C("span", { style: { fontSize: 12, color: "var(--hana-muted)" } }, unit) : null
			);
		}

		/** HanaAgent-style 5-step slider with a round value badge. */
		/* StepSlider — 按 HanaAgent 已安装版本（1.5.118）的组件结构原样端口。
		 * 结构：slider > rail > [underlay(segments), input, handleLayer(handle > value roll), sizer]
		 * 数值滚动：AnimatePresence + spring(paperSnap) 的 variants（enter/center/exit），
		 * 这里用 Web Animations 复刻同样的位移/透明度/方向/时长与她的 linear() 弹簧缓动。 */
		const HANA_EASE_PAPER_SPRING =
			"linear(0, 0.01, 0.036, 0.075, 0.125, 0.182, 0.244, 0.309, 0.375, 0.441, 0.506, 0.568, 0.627, 0.682, 0.733, 0.78, 0.823, 0.862, 0.896, 0.925, 0.951, 0.974, 0.992, 1.008, 1.02, 1.03, 1.038, 1.043, 1.047, 1.049, 1.05, 1.05, 1.049, 1.047, 1.045, 1.042, 1.039, 1.036, 1.032, 1.029, 1.026, 1.022, 1.019, 1.017, 1.014, 1.012, 1.009, 1.007, 1)";

		/** One value roll layer pair (port of HanaAgent's Roll glyph component). */
		function StepSliderValue({ text, order }) {
			const hostRef = react.useRef(null);
			const previous = react.useRef(null);
			const direction = react.useRef(1);
			react.useEffect(() => {
				const host = hostRef.current;
				if (host === null || host === undefined) return undefined;
				// Drop stray text nodes left by earlier renders.
				for (const node of Array.from(host.childNodes ?? [])) {
					if (node.nodeType !== 1) node.remove();
				}
				const previousState = previous.current;
				if (previousState !== null && previousState.text === text) return undefined;
				direction.current = previousState === null ? 1 : order >= previousState.order ? 1 : -1;
				previous.current = { text, order };
				const reduce =
					typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
				const layers = Array.from(host.children ?? []);
				const next = document.createElement("span");
				next.className = "hana-step-roll-layer";
				next.textContent = text;
				host.appendChild(next);
				const settle = () => {
					next.style.transform = "";
					next.style.opacity = "1";
				};
				if (layers.length === 0) {
					settle();
					return undefined;
				}
				if (typeof host.animate !== "function" || reduce) {
					for (const layer of layers) layer.remove();
					settle();
					return undefined;
				}
				const duration = 210;
				const enterAnimation = next.animate(
					[
						{ transform: "translateY(" + (direction.current > 0 ? 100 : -100) + "%)", opacity: 0 },
						{ transform: "translateY(0%)", opacity: 1 },
					],
					{ duration, easing: HANA_EASE_PAPER_SPRING, fill: "both" }
				);
				enterAnimation.onfinish = settle;
				const timers = [];
				for (const layer of layers) {
					const drop = () => {
						try {
							layer.remove();
						} catch {
							// already detached
						}
					};
					const exitAnimation = layer.animate(
						[
							{ transform: "translateY(0%)", opacity: 1 },
							{ transform: "translateY(" + (direction.current > 0 ? -100 : 100) + "%)", opacity: 0 },
						],
						{ duration, easing: HANA_EASE_PAPER_SPRING, fill: "both" }
					);
					exitAnimation.onfinish = drop;
					timers.push(setTimeout(drop, duration + 120));
				}
				return () => {
					enterAnimation.cancel?.();
					settle();
					for (const timer of timers) clearTimeout(timer);
				};
			}, [text, order]);
			return C("div", { className: "hana-step-value", ref: hostRef });
		}

		function StepSlider({ value, onChange, ariaLabel }) {
			const steps = 5;
			const current = Math.max(1, Math.min(steps, Number(value) || 1));
			const index = current - 1;
			const ratio = (index / (steps - 1)) || 0;
			const label = String(current);
			const segments = Array.from({ length: steps - 1 }, (_, i) => i);
			const sizerRef = react.useRef(null);
			const [labelWidth, setLabelWidth] = react.useState(0);
			const [mounted, setMounted] = react.useState(false);
			react.useEffect(() => {
				setMounted(true);
			}, []);
			react.useLayoutEffect
				? react.useLayoutEffect(() => {
						const node = sizerRef.current;
						if (node === null || node === undefined) return;
						const measure = () => {
							const width = node.getBoundingClientRect?.().width ?? 0;
							if (width > 0) setLabelWidth(width);
						};
						measure();
						const Observer = window.ResizeObserver;
						if (typeof Observer !== "function") return undefined;
						const observer = new Observer(measure);
						observer.observe(node);
						return () => observer.disconnect();
					}, [label])
				: undefined;
			const handleStyle = { "--hana-step-progress": ratio };
			if (labelWidth > 0) handleStyle["--hana-step-label-width"] = labelWidth + "px";
			return C(
				"div",
				{ className: "hana-step-slider" },
				C(
					"div",
					{ className: "hana-step-rail" },
					C(
						"div",
						{ className: "hana-step-underlay", "aria-hidden": "true" },
						C(
							"div",
							{ className: "hana-step-segments", "data-step-slider-segments": "" },
							segments.map((segment) =>
								C("span", {
									key: segment,
									className: "hana-step-segment",
									"data-on": segment < index ? "1" : "0",
								})
							)
						)
					),
					C("input", {
						className: "hana-step-input",
						type: "range",
						min: 0,
						max: steps - 1,
						step: 1,
						value: index,
						"aria-label": ariaLabel,
						"aria-valuetext": label,
						onChange: (event) => onChange(Number(event.target.value) + 1),
					}),
					C(
						"div",
						{ className: "hana-step-handle-layer", "aria-hidden": "true" },
						C(
							"div",
							{
								className: "hana-step-handle",
								"data-step-slider-handle": "",
								"data-animate-width": mounted ? "" : undefined,
								style: handleStyle,
							},
							C(StepSliderValue, { text: label, order: index })
						)
					),
					C("span", {
						ref: sizerRef,
						className: "hana-step-sizer",
						"data-step-slider-sizer": "",
						"aria-hidden": "true",
					}, label)
				)
			);
		}

		/** HanaAgent-style switch. */
		function Toggle({ on, onChange, ariaLabel }) {
			return C(
				"button",
				{
					type: "button",
					role: "switch",
					"aria-checked": on === true,
					"aria-label": ariaLabel,
					onClick: () => onChange(on !== true),
					style: {
						position: "relative",
						width: 40,
						height: 22,
						borderRadius: 999,
						border: "none",
						padding: 0,
						cursor: "pointer",
						background: on === true ? "var(--hana-accent)" : "var(--hana-border)",
					},
				},
				C("span", {
					style: {
						position: "absolute",
						top: 2,
						left: on === true ? 20 : 2,
						width: 18,
						height: 18,
						borderRadius: "50%",
						background: "#FFFFFF",
						boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
					},
				})
			);
		}

		function themeCardInk(theme) {
			const match = /^#([0-9a-f]{6})$/i.exec(theme.pageColor);
			if (theme.colorScheme === "dark") return "#F5EFE4";
			if (match === null) return "#2A2622";
			const value = parseInt(match[1], 16);
			const r = (value >> 16) & 255;
			const g = (value >> 8) & 255;
			const b = value & 255;
			return 0.299 * r + 0.587 * g + 0.114 * b < 140 ? "#F5EFE4" : "#2A2622";
		}

		function ThemeCard({ theme, selected, onSelect }) {
			const tokens = THEME_BY_ID.get(theme.id)?.tokens ?? {};
			const nameColor = tokens["--dsw-alias-label-primary"] ?? themeCardInk(theme);
			const modeColor = tokens["--dsw-alias-label-secondary"] ?? nameColor;
			return C(
				"button",
				{
					type: "button",
					title: theme.name,
					onClick: onSelect,
					style: {
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 3,
						minHeight: 66,
						padding: "10px 8px",
						borderRadius: 10,
						cursor: "pointer",
						background: theme.pageColor,
						color: nameColor,
						border: selected ? "1px solid var(--hana-accent)" : "1px solid var(--hana-border)",
						boxShadow: selected ? "0 0 0 3px color-mix(in srgb, var(--hana-accent) 18%, transparent)" : "none",
					},
				},
				C("span", { style: { fontSize: 16, fontWeight: 600, lineHeight: 1.35 } }, theme.name),
				C("span", { style: { fontSize: 12, lineHeight: 1.3, color: modeColor } }, theme.mode)
			);
		}

		function AutoCard({ selected, onSelect }) {
			return C(
				"button",
				{
					type: "button",
					title: "自动",
					onClick: onSelect,
					style: {
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						alignItems: "center",
						justifyItems: "center",
						columnGap: 0,
						minHeight: 66,
						padding: "10px 8px",
						borderRadius: 10,
						cursor: "pointer",
						background: `linear-gradient(90deg, ${AUTO_LIGHT} 50%, ${AUTO_DARK} 50%)`,
						border: selected ? "1px solid var(--hana-accent)" : "1px solid var(--hana-border)",
						boxShadow: selected ? "0 0 0 3px color-mix(in srgb, var(--hana-accent) 18%, transparent)" : "none",
					},
				},
				C("span", { style: { gridColumn: "1", fontSize: 16, fontWeight: 600, lineHeight: 1.35, color: "#2A2622" } }, "自动"),
				C("span", { style: { gridColumn: "2", fontSize: 12, lineHeight: 1.3, color: "#F5EFE4" } }, "跟随系统")
			);
		}

		function AppIconCard({ icon, selected, disabled, onSelect }) {
			return C(
				"button",
				{
					type: "button",
					title: icon.name,
					"aria-pressed": selected,
					disabled: disabled === true,
					onClick: disabled === true ? undefined : onSelect,
					style: {
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 8,
						width: "100%",
						minHeight: 96,
						padding: "12px 8px",
						border: "none",
						background: "transparent",
						cursor: disabled === true ? "default" : "pointer",
						borderRadius: 10,
						opacity: disabled === true ? 0.55 : 1,
					},
				},
				C("img", {
					src: iconAssetUrl(icon.file),
					alt: icon.name,
					width: 56,
					height: 56,
					draggable: false,
					style: {
						borderRadius: 14,
						outline: selected ? "2px solid var(--hana-accent)" : "1px solid var(--hana-border)",
						outlineOffset: 2,
						objectFit: "cover",
					},
				}),
				C(
					"span",
					{ style: { fontSize: 13, color: selected ? "var(--hana-accent)" : "var(--hana-muted)" } },
					icon.name
				)
			);
		}

		function FontCard({ option, selected, onSelect }) {
			return C(
				"button",
				{
					type: "button",
					"aria-pressed": selected,
					onClick: onSelect,
					style: {
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 4,
						minHeight: 84,
						padding: "12px 16px",
						borderRadius: 10,
						cursor: "pointer",
						background: "var(--hana-card)",
						border: selected ? "1px solid var(--hana-accent)" : "1px solid var(--hana-border)",
						boxShadow: selected ? "0 0 0 3px color-mix(in srgb, var(--hana-accent) 14%, transparent)" : "none",
						color: "var(--hana-text)",
					},
				},
				C(
					"span",
					{ style: { fontFamily: resolveFontStack({ ...getState(), font: option.id }), fontSize: 18, lineHeight: 1.5, letterSpacing: "0.02em" } },
					"永和九年，岁在癸丑。"
				),
				C("span", { style: { fontSize: 13, fontWeight: 600 } }, option.name),
				C("span", { style: { fontSize: 11, color: "var(--hana-muted)" } }, option.desc)
			);
		}

		/** File picker button + hidden input for a custom reading font. */
		function CustomFontPicker({ onPick }) {
			const inputRef = react.useRef(null);
			return C(
				"div",
				{ style: { display: "flex", alignItems: "center", gap: 8 } },
				C(
					"button",
					{
						type: "button",
						onClick: () => inputRef.current?.click(),
						style: {
							display: "flex",
							alignItems: "center",
							gap: 6,
							padding: "7px 14px",
							font: "inherit",
							fontSize: 14,
							color: "var(--hana-text)",
							background: "var(--hana-seg-bg)",
							border: "1px solid var(--hana-border)",
							borderRadius: 8,
							cursor: "pointer",
						},
					},
					"导入"
				),
				C("input", {
					ref: inputRef,
					type: "file",
					accept: ".ttf,.otf,.woff,.woff2",
					style: { display: "none" },
					onChange: (event) => {
						const file = event.target.files && event.target.files[0];
						if (file) onPick(file);
						event.target.value = "";
					},
				})
			);
		}

		/** Register one imported font file and remember its family name. */
		function loadCustomFont(file) {
			const reader = new FileReader();
			reader.onload = () => {
				const family = "HanaCustom-" + Date.now();
				try {
					const face = new FontFace(family, reader.result);
					face.load().then((loaded) => {
						document.fonts.add(loaded);
						setState({ font: "custom", customFontName: family, customFontLabel: file.name.replace(/\.[^.]+$/, "") });
					});
				} catch {
					// unsupported font file — ignore
				}
			};
			reader.readAsArrayBuffer(file);
		}

		/** First-level "HanaUI" settings page (layout mirrors HanaAgent 界面 tab). */
		function HanaUiPage() {
			const [snapshot, setSnapshot] = react.useState(getState);
			react.useEffect(() => subscribe(() => setSnapshot({ ...getState() })), []);
			const setSkinState = setState;

			const fontStatus = getFontStatus();

			/* Windows desktop icon sync: selection comes from the host bridge
			 * route, which rewrites the shortcuts and the window icon. */
			const [iconStatus, setIconStatus] = react.useState(() => getAppIconStatus());
			const [iconBusy, setIconBusy] = react.useState(false);
			const [iconError, setIconError] = react.useState(null);
			react.useEffect(() => {
				let alive = true;
				void refreshAppIconStatus().then((status) => {
					if (!alive || status === null) return;
					setIconStatus(status);
					if (status.supported === true) {
						const applied = typeof status.applied === "string" && (APP_ICON_IDS.includes(status.applied) || status.applied === "custom") ? status.applied : "default";
						if (getState().appIcon !== applied) setState({ appIcon: applied });
					}
				});
				return () => {
					alive = false;
				};
			}, []);
			const chooseAppIcon = (iconId) => {
				setIconBusy(true);
				setIconError(null);
				void applyAppIcon(iconId)
					.then((status) => {
						const applied =
							status.supported === false
								? getState().appIcon
								: status.applied === null || status.applied === undefined
									? "default"
									: status.applied;
						if (typeof applied === "string" && (applied === "default" || applied === "custom" || APP_ICON_IDS.includes(applied))) setState({ appIcon: applied });
						setIconStatus(status);
					})
					.catch((error) => {
						setIconError(error instanceof Error ? error.message : String(error));
					})
					.finally(() => setIconBusy(false));
			};
			const uploadCustomIcon = (file) => {
				setIconBusy(true);
				setIconError(null);
				void uploadCustomAppIcon(file)
					.then((status) => {
						setState({ appIcon: "custom" });
						setIconStatus(status);
					})
					.catch((error) => setIconError(error instanceof Error ? error.message : String(error)))
					.finally(() => setIconBusy(false));
			};
			const pickCustomIcon = () => {
				if (iconBusy || iconStatus?.supported === false) return;
				const input = document.createElement("input");
				input.type = "file";
				input.accept = ".ico,image/x-icon,image/png,image/jpeg,image/webp,image/gif";
				input.onchange = () => {
					const file = input.files === null || input.files === undefined ? null : input.files[0];
					if (file !== null && file !== undefined) uploadCustomIcon(file);
				};
				input.click();
			};
			const removeCustomIcon = () => {
				setIconBusy(true);
				setIconError(null);
				void removeCustomAppIcon()
					.then((status) => {
						const applied = status.applied === null || status.applied === undefined ? "default" : status.applied;
						setState({ appIcon: applied === "custom" || APP_ICON_IDS.includes(applied) ? applied : "default" });
						setIconStatus(status);
					})
					.catch((error) => setIconError(error instanceof Error ? error.message : String(error)))
					.finally(() => setIconBusy(false));
			};

			/* Ink strength follows the active Hana palette (HanaAgent look). */
			const dark = isDarkMode(snapshot.theme);
			const tokens = THEME_BY_ID.get(snapshot.theme)?.tokens ?? {};
			const pageVars = {
				"--hana-text": tokens["--dsw-alias-label-primary"] ?? (dark ? "#EDE8DE" : "#2A2622"),
				"--hana-muted": tokens["--dsw-alias-label-secondary"] ?? (dark ? "#C6BEB1" : "#4A433C"),
				"--hana-border": tokens["--dsw-alias-border-l2"] ?? (dark ? "rgba(255,255,255,0.18)" : "#D8CFBE"),
				"--hana-card": tokens["--dsw-alias-bg-layer-1"] ?? (dark ? "#2F3E48" : "#FBF7EE"),
				"--hana-accent": tokens["--dsw-alias-brand-primary"] ?? "#537D96",
				"--hana-on-accent": "#FFFFFF",
				"--hana-seg-bg": dark ? "rgba(255,255,255,0.08)" : "rgba(42,38,34,0.05)",
				"--hana-seg-active": tokens["--dsw-alias-bg-base"] ?? (dark ? "#3B4A54" : "#FBFAF7"),
			};

			const themeCards = THEMES.map((theme) =>
				C(ThemeCard, {
					key: theme.id,
					theme,
					selected: snapshot.theme === theme.id,
					onSelect: () => setSkinState({ theme: theme.id }),
				})
			);

			const savedTrees = snapshot.sunnySavedSeeds;
			const currentSeed = typeof snapshot.sunnySeed === "number" ? snapshot.sunnySeed : 0;
			const languageOptions = getDshLanguageOptions();
			const treeOptions = [
				{ value: "default", label: "默认" },
				...savedTrees.map((seed, index) => ({ value: String(seed), label: `树 #${index + 1}` })),
				...(currentSeed !== 0 && !savedTrees.includes(currentSeed) ? [{ value: String(currentSeed), label: "新的树" }] : []),
			];

			const customFontOptions =
				snapshot.font === "custom" && snapshot.customFontLabel
					? [{ value: "custom", label: snapshot.customFontLabel }]
					: [{ value: "", label: "尚未导入字体" }];

			return C(
				"div",
				{
					style: {
						...pageVars,
						display: "flex",
						flexDirection: "column",
						maxWidth: 780,
						paddingBottom: 24,
						color: "var(--hana-text)",
					},
				},
				// ── 语言和地区 ──
				C(
					Section,
					{ title: "语言和地区" },
					C(Card, {
						rows: [
							C(Row, {
								key: "language",
								label: "语言",
								hint: "切换语言后需要重新加载",
								control: C(Dropdown, {
									ariaLabel: "语言",
									options: languageOptions,
									value: snapshot.language,
									onChange: (language) => chooseLanguage(language),
								}),
							}),
							C(Row, {
								key: "timezone",
								label: "时区",
								hint: "用于记忆时间标记、日记等",
								control: C(Dropdown, {
									ariaLabel: "时区",
									options: TIMEZONE_OPTIONS,
									value: snapshot.timezone,
									onChange: (timezone) => setSkinState({ timezone }),
								}),
							}),
						],
					})
				),
				// ── 主题 ──
				C(
					Section,
					{ title: "主题" },
					C(
						"div",
						{ style: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 } },
						themeCards[0],
						themeCards[1],
						C(AutoCard, { selected: snapshot.theme === DEFAULT_SKIN, onSelect: () => setSkinState({ theme: DEFAULT_SKIN }) }),
						...themeCards.slice(2)
					)
				),
				// ── 应用图标 ──
				C(
					Section,
					{
						title: "应用图标",
						description: "把桌面、开始菜单、任务栏和窗口缩略图上的图标换成选中的样式（仅 Windows 桌面版）",
						action: C(
							"button",
							{
								type: "button",
								style: LINK_BTN,
								disabled: iconBusy || iconStatus?.supported === false,
								onClick: () => chooseAppIcon("default"),
							},
							"恢复默认"
						),
					},
					C(
						"div",
						null,
						C(
							"div",
							{ style: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 } },
							APP_ICONS.map((entry) =>
								C(AppIconCard, {
									key: entry.id,
									icon: entry,
									selected: snapshot.appIcon === entry.id,
									disabled: iconBusy || iconStatus?.supported === false,
									onSelect: () => chooseAppIcon(entry.id),
								})
							)
						),
						C(
							"div",
							{ style: { display: "flex", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" } },
							iconStatus?.hasCustom === true
								? C("img", {
										src: `${APP_ICON_CUSTOM_ROUTE}?v=${iconStatus.customVersion ?? ""}`,
										alt: "自定义图标",
										width: 40,
										height: 40,
										draggable: false,
										style: {
											borderRadius: 10,
											objectFit: "cover",
											outline: snapshot.appIcon === "custom" ? "2px solid var(--hana-accent)" : "1px solid var(--hana-border)",
											outlineOffset: 2,
										},
									})
								: null,
							C(
								"button",
								{
									type: "button",
									style: UPLOAD_BTN,
									disabled: iconBusy || iconStatus?.supported === false,
									onClick: pickCustomIcon,
								},
								iconStatus?.hasCustom === true ? "更换自定义图标" : "上传自定义图标"
							),
							iconStatus?.hasCustom === true
								? C("button", { type: "button", style: LINK_BTN, disabled: iconBusy, onClick: removeCustomIcon }, "移除自定义")
								: null
						),
						C(
							"div",
							{ style: { marginTop: 6, fontSize: 12, color: "var(--hana-muted)" } },
							"支持 PNG / JPG / ICO，图片会先裁成正方形再生成 16–256 多尺寸图标（仅 Windows 桌面版生效）。"
						),
						iconStatus?.supported === false
							? C(
									"div",
									{ style: { marginTop: 8, fontSize: 12, color: "var(--hana-muted)" } },
									"当前环境不支持修改应用图标：请在 Windows 桌面版 DSH 中使用。"
								)
							: null,
						iconBusy
							? C("div", { style: { marginTop: 8, fontSize: 12, color: "var(--hana-muted)" } }, "正在更新快捷方式…")
							: null,
						iconError !== null
							? C("div", { style: { marginTop: 8, fontSize: 12, color: "#B33A2B" } }, "修改失败：" + iconError)
							: null,
						iconStatus !== null && iconStatus.supported === true && typeof iconStatus.updated === "number" && iconStatus.updated > 0
							? C(
									"div",
									{ style: { marginTop: 8, fontSize: 12, color: "var(--hana-muted)" } },
									"已更新 " +
										iconStatus.updated +
										" 个快捷方式" +
										(iconStatus.failed > 0 ? "，" + iconStatus.failed + " 个失败" : "") +
										"；窗口图标会在几秒内刷新。"
								)
							: null
					)
				),
				// ── 字体 ──
				C(
					Section,
					{ title: "字体", description: "选择正文阅读使用的字体" },
					C(
						"div",
						{ style: { ...CARD, marginBottom: 12 } },
						C(
							"div",
							{ style: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: 72, padding: "0 16px" } },
							C("span", { style: { fontFamily: resolveFontStack(snapshot), fontSize: 22, letterSpacing: "0.02em" } }, "永和九年，岁在癸丑。")
						)
					),
					C(
						"div",
						{ style: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, marginBottom: 12 } },
						FONT_OPTIONS.map((option) => {
							const desc =
								option.id !== "wenkai"
									? option.desc
									: snapshot.wenkaiReady === true
										? "开源宋体"
										: fontStatus.status === "downloading"
											? `下载中 · ${fontStatus.progress}%`
											: fontStatus.status === "verifying"
												? "校验字体…"
												: fontStatus.status === "failed"
													? "下载失败，点击重试"
													: "开源宋体 · 需下载 10.0MB";
							return C(FontCard, {
								key: option.id,
								option: { ...option, desc },
								selected: snapshot.font === option.id,
								onSelect: () => {
									if (option.id === "wenkai" && snapshot.wenkaiReady !== true) {
										void installWenkaiFont();
										return;
									}
									setSkinState({ font: option.id });
								},
							});
						})
					),
					C(Card, {
						rows: [
							C(Row, {
								key: "custom-font",
								label: "自定义字体",
								control: C(
									"div",
									{ style: { display: "flex", alignItems: "center", gap: 8 } },
									C(Dropdown, {
										ariaLabel: "自定义字体",
										options: customFontOptions,
										value: snapshot.font === "custom" ? "custom" : "",
										onChange: () => {},
									}),
									C(CustomFontPicker, { onPick: loadCustomFont })
								),
							}),
							C(Row, {
								key: "font-size",
								label: "正文字号",
								control: C(Segmented, { options: OFFSET_OPTIONS, value: snapshot.fontSizeOffset, onChange: (fontSizeOffset) => setSkinState({ fontSizeOffset }) }),
							}),
							C(Row, {
								key: "chat-width",
								label: "聊天宽度",
								control: C(Segmented, { options: CHAT_WIDTH_OPTIONS, value: snapshot.chatWidth, onChange: (chatWidth) => setSkinState({ chatWidth }) }),
							}),
						],
					})
				),
				// ── 外观 ──
				C(
					Section,
					{ title: "外观" },
					C(Card, {
						rows: [
							C(Row, {
								key: "texture",
								label: "纸质纹理",
								hint: "为画布、侧边面板和设置页加上纸张质感。",
								control: C(Segmented, { options: TEXTURE_OPTIONS, value: snapshot.texture, onChange: (texture) => setSkinState({ texture }) }),
							}),
							C(Row, {
								key: "strength",
								label: "纹理强度",
								control: C(StepSlider, { ariaLabel: "纹理强度", value: snapshot.textureStrength, onChange: (textureStrength) => setSkinState({ textureStrength }) }),
							}),
							C(Row, {
								key: "toolicon",
								label: "工具调用图标",
								control: C(Segmented, {
									options: [
										{ value: "emoji", label: "Emoji" },
										{ value: "svg", label: "SVG" },
									],
									value: snapshot.toolIcon,
									onChange: (toolIcon) => setSkinState({ toolIcon }),
								}),
							}),
						],
					})
				),
				// ── 晴天模式 ──
				C(
					Section,
					{ title: null },
					C(Card, {
						rows: [
							C(Row, {
								key: "sunny",
								label: "晴天模式",
								hint: "没事儿晒晒太阳",
								control: C(Toggle, { ariaLabel: "晴天模式", on: snapshot.sunnyMode, onChange: (sunnyMode) => setSkinState({ sunnyMode }) }),
							}),
							C(Row, {
								key: "sunny-tree",
								label: "选一棵树",
								control: C(Dropdown, {
									ariaLabel: "选一棵树",
									options: treeOptions,
									value: currentSeed === 0 ? "default" : String(currentSeed),
									onChange: (value) => setSkinState({ sunnySeed: value === "default" ? 0 : Number(value) }),
								}),
							}),
							C(Row, {
								key: "sunny-new",
								label: "我要新的树",
								control: C(
									"div",
									{ style: { display: "flex", alignItems: "center", gap: 8 } },
									C(NumberBox, {
										value: currentSeed,
										min: 0,
										max: 999999999,
										step: 1,
										onChange: (sunnySeed) => setSkinState({ sunnySeed: Math.max(0, Math.min(999999999, Math.round(sunnySeed))) }),
									}),
									C(
										"button",
										{
											type: "button",
											onClick: () => setSkinState({ sunnySeed: 1 + Math.floor(Math.random() * 999999999) }),
											style: {
												padding: "7px 14px",
												font: "inherit",
												fontSize: 14,
												border: "none",
												borderRadius: 8,
												background: "var(--hana-seg-bg)",
												color: "var(--hana-text)",
												cursor: "pointer",
											},
										},
										"生成新树"
									),
									C(
										"button",
										{
											type: "button",
											disabled: currentSeed === 0 || savedTrees.includes(currentSeed),
											onClick: () => {
												if (currentSeed === 0 || savedTrees.includes(currentSeed)) return;
												setSkinState({ sunnySavedSeeds: [...savedTrees, currentSeed].slice(-20) });
											},
											style: {
												padding: "7px 14px",
												font: "inherit",
												fontSize: 14,
												border: "none",
												borderRadius: 8,
												background: "var(--hana-seg-bg)",
												color: "var(--hana-muted)",
												cursor: "pointer",
											},
										},
										currentSeed === 0 || savedTrees.includes(currentSeed) ? "此树已保存" : "保存这棵树"
									)
								),
							}),
						],
					})
				),
				C(
					"div",
					{ style: { display: "flex", justifyContent: "flex-end", marginTop: 4 } },
					C("button", { type: "button", style: LINK_BTN, onClick: () => setSkinState({ ...DEFAULT_STATE }) }, "恢复默认")
				)
			);
		}

		/** Nav icon for the HanaUI page (four-dot palette glyph). */
		function HanaUiIcon(props) {
			const size = props && typeof props.size === "number" ? props.size : 16;
			return C(
				"svg",
				{ width: size, height: size, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				C("path", {
					d: "M12 3a9 9 0 1 0 0 18h1.2a1.8 1.8 0 0 0 1.3-3.05 1.8 1.8 0 0 1 1.3-3.05H17a4 4 0 0 0 4-4A9 9 0 0 0 12 3Z",
					stroke: "currentColor",
					strokeWidth: 1.6,
				}),
				C("circle", { cx: 7.6, cy: 10.2, r: 1.1, fill: "currentColor" }),
				C("circle", { cx: 10.6, cy: 7.2, r: 1.1, fill: "currentColor" }),
				C("circle", { cx: 14.4, cy: 7.6, r: 1.1, fill: "currentColor" })
			);
		}
		//#endregion





































		//#region dsh-hana-appearance: client plugin body
		/** Slots + theme runtime are required; the page mounts in Settings. */
		exports.inject = ["slots", "theme", "locale"];

		/** @param ctx - client cordis context (slots/theme injected). */
		exports.apply = function apply(ctx) {
			// 1) Register the Hana palettes into the built-in theme runtime.
			const disposers = THEMES.map((theme) =>
				ctx.theme.register({
					id: theme.id,
					name: theme.name,
					colorScheme: theme.colorScheme,
					tokens: theme.tokens,
				})
			);
			ctx.effect(() => () => {
				for (const dispose of disposers) dispose();
			}, "dsh-hana-appearance: theme registration");

			// 2) Static page stylesheet (ported HanaAgent settings styles).
			pageStyleEl = document.createElement("style");
			pageStyleEl.id = "dsh-hana-appearance-page-style";
			pageStyleEl.textContent = PAGE_CSS;
			document.head.appendChild(pageStyleEl);

			// 2b) Fullscreen PaperTextureLayer: hi/lo divs masked by the three
			//     generated paper textures (mottle/fiber/grain). Visible only
			//     while html[data-hana-paper-texture] is set.
			paperLayer = document.createElement("div");
			paperLayer.className = "hana-paper-layer";
			const paperHi = document.createElement("div");
			paperHi.className = "hana-paper-hi";
			const paperLo = document.createElement("div");
			paperLo.className = "hana-paper-lo";
			paperLayer.appendChild(paperHi);
			paperLayer.appendChild(paperLo);
			document.body.appendChild(paperLayer);

			// Remove overlay nodes left behind by older builds of this plugin.
			try {
				const staleLayers = document.querySelectorAll?.('canvas[style*="21474829"], div[style*="21474829"]') ?? [];
				for (const stale of staleLayers) stale.remove();
			} catch {
				// cleanup is best-effort
			}

			// 3) Seed from localStorage, then paint; hydrate the durable file async.
			state = readLocal() ?? readBootCookie() ?? { ...DEFAULT_STATE };
			repaint = () => {
				try {
					paint(ctx);
				} catch {
					// a paint failure must never take the settings page down
				}
			};
			repaint();
			watchChatDom();
			void hydrate();
			void restoreWenkaiFont();
			// Guard: DSH can silently fall back to its built-in theme (boot/config
			// reload/settings mount). Re-assert the chosen skin when that happens.
			const themeGuard = setInterval(() => {
				try {
					const current = ctx.theme.getTheme().preference;
					if (state.theme !== DEFAULT_SKIN) {
						if (current !== state.theme) {
							lastSelfSetAt = Date.now();
							ctx.theme.setTheme(state.theme);
						}
					} else if (THEME_BY_ID.has(current)) {
						lastSelfSetAt = Date.now();
						ctx.theme.setTheme(DEFAULT_SKIN);
					}
				} catch {
					// ignore: theme runtime may be tearing down
				}
			}, 1500);
			ctx.effect(() => () => clearInterval(themeGuard), "dsh-hana-appearance: theme guard");

			// Mirror DSH's own language preference both ways.
			localeFace = typeof ctx.get === "function" ? ctx.get("locale") : null;
			const syncLocale = () => {
				lastLocaleChangeAt = Date.now();
				const info = readDshLocale();
				if (info === null) return;
				if (state.language !== info.active) setState({ language: info.active });
				else notify();
			};
			syncLocale();
			if (localeFace !== null && localeFace !== undefined && typeof localeFace.subscribe === "function") {
				ctx.effect(() => localeFace.subscribe(syncLocale), "dsh-hana-appearance: dsh locale mirror");
			}
			ctx.on("locale/change", syncLocale);

			ctx.effect(() => () => {
				repaint = null;
				disposeApplier();
			}, "dsh-hana-appearance: applier lifecycle");

			// 4) Re-assert our skin when the runtime adopts the document's
			//    built-in preference on boot/settings reload; an explicit
			//    built-in pick hands control back.
			ctx.on("theme/change", (snapshot) => {
				const preference = snapshot?.preference ?? ctx.theme.getTheme().preference;
				const fromSelf = Date.now() - lastSelfSetAt < 800;
				if (preference === DEFAULT_SKIN || preference === "light" || preference === "dark") {
					// DSH re-emits its persisted built-in preference when it boots or
					// reloads settings; that is not a user picking a built-in theme, so the
					// Hana skin stays sticky. The HanaUI 自动 card is the way back.
					if (state.theme !== DEFAULT_SKIN && !fromSelf) {
						lastSelfSetAt = Date.now();
						try {
							ctx.theme.setTheme(state.theme);
						} catch {
							// ignore: theme runtime may be tearing down
						}
					}
					return;
				}
				if (THEME_BY_ID.has(preference) && preference !== state.theme) {
					setState({ theme: preference });
				}
				repaint?.();
			});

		// 5) First-level "HanaUI" page in the Settings nav. Order 21 is the
			//    IM机器人 page (xmanrui-dsh-im); 20 puts HanaUI right before it.
			ctx.slots.inject("settings.section", () =>
				ctx.slots.register(
					{
						name: "settings.section",
						id: "hana-ui",
						order: 20,
						label: () => "HanaUI",
					},
					HanaUiPage
				)
			);
			ctx.slots.inject("settings.section.icon", () =>
				ctx.slots.register({ name: "settings.section.icon", id: "hana-ui" }, HanaUiIcon)
			);
		};
		//#endregion

		exports.THEMES = THEMES;
		exports.DEFAULT_STATE = DEFAULT_STATE;
		return module.exports;
	}
});
