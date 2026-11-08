/**
 * Windows desktop app-icon sync for the HanaUI appearance plugin.
 *
 * The mechanism (shortcut scan/backup/park, start-menu refresh trick and the
 * WM_SETICON window-icon helper) is adapted from
 * `@smalltailqwq/dsh-client-ui-skin-deep-whale-manager` (MIT, see NOTICE and
 * licenses/dsh-deep-whale-manager-MIT.txt).
 *
 * Plugins run inside the desktop host's Node child, which cannot reach the
 * Electron main process, so the window icon itself is out of reach directly.
 * Windows resolves the running taskbar button, the Start menu entry and the
 * desktop icon through the shortcuts that launch `DeepSeek Harness.exe`, so we
 * point those shortcuts' IconLocation at the selected HanaUI ICO and put back
 * exactly what we replaced when the user picks "恢复默认".
 *
 * Only shortcuts whose target is the running executable are touched, the
 * previous IconLocation of each one is recorded before the first write, and a
 * restore only reverts a shortcut that still shows an icon this module wrote.
 * The ICO is copied out of the package first, so uninstalling the plugin never
 * leaves a shortcut pointing at a missing file.
 */
import { execFile, spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path'

/** Largest ICO accepted from the bundled asset directory; real icons stay well below it. */
const MAX_ICON_BYTES = 2097152
/** Largest user-uploaded ICO accepted by the settings page (16..256 multi-size icons). */
export const MAX_UPLOAD_BYTES = 3 * 1024 * 1024
/** Persisted id for the one user-uploaded icon. */
export const CUSTOM_ICON_ID = 'custom'
const POWERSHELL_TIMEOUT_MS = 60000

/** True when the buffer starts with a plausible ICO header (reserved 0, type 1, count >= 1). */
export function isIcoBuffer(bytes) {
	return bytes.length >= 6 && bytes.readUInt16LE(0) === 0 && bytes.readUInt16LE(2) === 1 && bytes.readUInt16LE(4) >= 1
}

/** Per-home serialization queues so two passes never interleave. */
const syncQueues = new Map()

/** The Windows desktop host runs plugins in `DeepSeek Harness.exe` with ELECTRON_RUN_AS_NODE=1. */
export function detectDesktopShell(platform = process.platform, env = process.env, execPath = process.execPath) {
	if (platform !== 'win32' || env.ELECTRON_RUN_AS_NODE !== '1') return null
	if (!/\.exe$/i.test(execPath) || /^node\.exe$/i.test(basename(execPath))) return null
	return { execPath }
}

/** Folders holding the all-users desktop and Start menu shortcuts. */
function sharedShortcutRoots(env = process.env) {
	const roots = []
	if (env.PUBLIC) roots.push(join(env.PUBLIC, 'Desktop'))
	const programData = env.ProgramData ?? env.ALLUSERSPROFILE
	if (programData) roots.push(join(programData, 'Microsoft', 'Windows', 'Start Menu'))
	return roots
}

/** Reduce one failed write to a reason shared by every shortcut it hit. */
export function describeShortcutFailure(path, error, sharedRoots) {
	const key = pathKey(path)
	if (sharedRoots.some((root) => key.startsWith(`${pathKey(root)}\\`))) return 'shared-denied'
	const message = (error ?? 'unknown').trim()
	if (/unable to save shortcut|无法保存快捷方式/i.test(message)) return 'save-blocked'
	return message.replace(/\s*(["'])[A-Za-z]:[\\/].*?\1/g, '').replace(/\s+/g, ' ').trim() || 'unknown'
}

const emptyState = () => ({ version: 1, iconId: null, shortcuts: {} })

export const pathKey = (path) => resolve(path).replaceAll('/', '\\').toLowerCase()

/** IconLocation path without its `,index` suffix. */
export function iconFile(icon) {
	const match = icon.match(/^(.*),-?\d+$/)
	return (match === null ? icon : match[1]).trim().replace(/^"|"$/g, '')
}

/** Whether an IconLocation points into the managed icon directory. */
export function isManagedIcon(icon, managedDir) {
	const file = iconFile(icon)
	if (file === '' || !isAbsolute(file)) return false
	const rel = relative(pathKey(managedDir), pathKey(file))
	return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel)
}

/**
 * Decide which shortcuts to rewrite for one desired IconLocation (`null`
 * restores). Pure: the caller commits a record only after its write succeeded.
 * `fileExists` guards the restore path: a recorded icon that another tool has
 * already deleted falls back to the executable's own icon instead of leaving a
 * shortcut pointing at a missing file.
 */
export function planAppIcon(state, shortcuts, desired, managedDir, fileExists = () => true) {
	const changes = []
	const records = {}
	const byKey = new Map(Object.entries(state.shortcuts).map(([path, record]) => [pathKey(path), record]))
	const seen = new Set()
	for (const shortcut of shortcuts) {
		const key = pathKey(shortcut.path)
		seen.add(key)
		const record = byKey.get(key)
		const ours = (record !== undefined && shortcut.icon === record.applied) || isManagedIcon(shortcut.icon, managedDir)
		const original = ours ? record?.original ?? `${shortcut.target},0` : shortcut.icon
		if (desired === null) {
			if (ours) {
				const restore = fileExists(iconFile(original)) ? original : `${shortcut.target},0`
				changes.push({ path: shortcut.path, icon: restore })
			}
			if (record !== undefined || ours) records[shortcut.path] = null
			continue
		}
		if (shortcut.icon !== desired) changes.push({ path: shortcut.path, icon: desired })
		records[shortcut.path] = { original, applied: desired }
	}
	for (const path of Object.keys(state.shortcuts)) if (!seen.has(pathKey(path))) records[path] = null
	return { changes, records }
}

const SCAN_SCRIPT = String.raw`
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Console]::OutputEncoding = [Text.Encoding]::UTF8
$exe = [IO.Path]::GetFullPath($env:HANA_ICON_EXE)
$roots = @(
  @{ path = [Environment]::GetFolderPath('Desktop'); deep = $false },
  @{ path = [Environment]::GetFolderPath('CommonDesktopDirectory'); deep = $false },
  @{ path = [Environment]::GetFolderPath('Programs'); deep = $true },
  @{ path = [Environment]::GetFolderPath('CommonPrograms'); deep = $true },
  @{ path = (Join-Path $env:APPDATA 'Microsoft\Internet Explorer\Quick Launch\User Pinned\TaskBar'); deep = $false }
)
# Put back any Start menu shortcut an interrupted refresh left renamed.
foreach ($root in $roots) {
  if (-not $root.deep -or -not $root.path -or -not (Test-Path -LiteralPath $root.path)) { continue }
  foreach ($parked in @(Get-ChildItem -LiteralPath $root.path -Filter '*.lnk.hana-refresh' -File -Recurse -ErrorAction SilentlyContinue)) {
    $restored = $parked.FullName.Substring(0, $parked.FullName.Length - '.hana-refresh'.Length)
    try {
      if (Test-Path -LiteralPath $restored) { Remove-Item -LiteralPath $parked.FullName -Force }
      else { Move-Item -LiteralPath $parked.FullName -Destination $restored }
    } catch {}
  }
}
$shell = New-Object -ComObject WScript.Shell
$found = @()
foreach ($root in $roots) {
  if (-not $root.path -or -not (Test-Path -LiteralPath $root.path)) { continue }
  foreach ($file in @(Get-ChildItem -LiteralPath $root.path -Filter *.lnk -File -Recurse:$root.deep -ErrorAction SilentlyContinue)) {
    try {
      $link = $shell.CreateShortcut($file.FullName)
      if ($link.TargetPath -and [string]::Equals([IO.Path]::GetFullPath($link.TargetPath), $exe, [StringComparison]::OrdinalIgnoreCase)) {
        $found += [pscustomobject]@{ path = $file.FullName; target = $link.TargetPath; icon = $link.IconLocation }
      }
    } catch {}
  }
}
ConvertTo-Json -InputObject @($found) -Compress
`

const WRITE_SCRIPT = String.raw`
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Console]::OutputEncoding = [Text.Encoding]::UTF8
$changes = ConvertFrom-Json -InputObject $env:HANA_ICON_CHANGES
$shell = New-Object -ComObject WScript.Shell
$results = @()
foreach ($change in $changes) {
  try {
    if (-not (Test-Path -LiteralPath $change.path)) { throw 'shortcut-missing' }
    $link = $shell.CreateShortcut($change.path)
    $link.IconLocation = $change.icon
    $link.Save()
    $results += [pscustomobject]@{ path = $change.path; ok = $true }
  } catch {
    $results += [pscustomobject]@{ path = $change.path; ok = $false; error = [string]$_.Exception.Message }
  }
}
# Start keeps its own app icon cache and only re-reads a shortcut it sees
# leave and return, so each rewritten Start menu shortcut is parked briefly
# under a non-.lnk name. The scan above recovers one an interruption strands.
$programs = @([Environment]::GetFolderPath('Programs'), [Environment]::GetFolderPath('CommonPrograms')) | Where-Object { $_ } | ForEach-Object { $_.TrimEnd('\') + '\' }
$parked = @()
foreach ($result in $results) {
  if (-not $result.ok) { continue }
  foreach ($prefix in $programs) {
    if ($result.path.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)) {
      try {
        Move-Item -LiteralPath $result.path -Destination ($result.path + '.hana-refresh')
        $parked += $result.path
      } catch {}
      break
    }
  }
}
if ($parked.Count -gt 0) {
  Start-Sleep -Seconds 3
  foreach ($path in $parked) { try { Move-Item -LiteralPath ($path + '.hana-refresh') -Destination $path } catch {} }
}
try {
  Add-Type -Namespace HanaAppearance -Name Shell -MemberDefinition '[DllImport("shell32.dll", CharSet = CharSet.Unicode)] public static extern void SHChangeNotify(int eventId, uint flags, string item1, System.IntPtr item2);'
  foreach ($result in $results) { if ($result.ok) { [HanaAppearance.Shell]::SHChangeNotify(0x2000, 0x0005, $result.path, [IntPtr]::Zero) } }
  [HanaAppearance.Shell]::SHChangeNotify(0x08000000, 0, $null, [IntPtr]::Zero)
} catch {}
ConvertTo-Json -InputObject @($results) -Compress
`

function runPowerShell(script, env) {
	return new Promise((resolve, reject) => {
		execFile(
			'powershell.exe',
			['-NoLogo', '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', Buffer.from(script, 'utf16le').toString('base64')],
			{
				env: { ...process.env, ...env },
				timeout: POWERSHELL_TIMEOUT_MS,
				windowsHide: true,
				maxBuffer: 4194304,
				encoding: 'utf8',
			},
			(error, stdout, stderr) => {
				if (error !== null) {
					reject(new Error(`app-icon-powershell: ${stderr.trim() || error.message}`))
					return
				}
				try {
					const text = stdout.replace(/^\uFEFF/, '').trim()
					resolve(text === '' ? [] : JSON.parse(text))
				} catch {
					reject(new Error('app-icon-powershell: invalid output'))
				}
			}
		)
	})
}

const powershellShortcutIo = {
	async scan(execPath) {
		const rows = await runPowerShell(SCAN_SCRIPT, { HANA_ICON_EXE: execPath })
		if (!Array.isArray(rows)) return []
		return rows.filter((row) => typeof row?.path === 'string' && typeof row.target === 'string' && typeof row.icon === 'string')
	},
	async write(changes) {
		const rows = await runPowerShell(WRITE_SCRIPT, { HANA_ICON_CHANGES: JSON.stringify(changes) })
		if (!Array.isArray(rows)) return changes.map((change) => ({ path: change.path, ok: false, error: 'invalid-output' }))
		return rows.map((row) => ({
			path: String(row?.path),
			ok: row?.ok === true,
			...(typeof row?.error === 'string' ? { error: row.error } : {}),
		}))
	},
}

const WINDOW_ICON_SCRIPT = String.raw`
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
Add-Type -AssemblyName System.Drawing
Add-Type -Namespace HanaAppearance -Name Window -MemberDefinition @'
public delegate bool EnumProc(System.IntPtr hwnd, System.IntPtr lParam);
[DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc callback, System.IntPtr lParam);
[DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(System.IntPtr hwnd, out uint pid);
[DllImport("user32.dll")] public static extern System.IntPtr GetWindow(System.IntPtr hwnd, uint cmd);
[DllImport("user32.dll")] public static extern bool IsWindow(System.IntPtr hwnd);
[DllImport("user32.dll")] public static extern System.IntPtr SendMessage(System.IntPtr hwnd, uint msg, System.IntPtr wParam, System.IntPtr lParam);
[DllImport("user32.dll")] public static extern int GetSystemMetrics(int index);
[DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
'@
[void][HanaAppearance.Window]::SetProcessDPIAware()
$target = [int]$env:HANA_ICON_PID
$big = New-Object System.Drawing.Icon($env:HANA_ICON_FILE, [HanaAppearance.Window]::GetSystemMetrics(11), [HanaAppearance.Window]::GetSystemMetrics(12))
$small = New-Object System.Drawing.Icon($env:HANA_ICON_FILE, [HanaAppearance.Window]::GetSystemMetrics(49), [HanaAppearance.Window]::GetSystemMetrics(50))
$replaced = @{}
# Console.In.ReadLineAsync is synchronous on Windows PowerShell 5.1; the raw
# stream's ReadAsync completes on the thread pool with a line or at EOF.
$command = [Console]::OpenStandardInput().ReadAsync((New-Object byte[] 16), 0, 16)
function Set-OwnedIcons {
  $windows = New-Object System.Collections.Generic.List[System.IntPtr]
  $callback = [HanaAppearance.Window+EnumProc]{
    param($hwnd, $lParam)
    $owner = [uint32]0
    [void][HanaAppearance.Window]::GetWindowThreadProcessId($hwnd, [ref]$owner)
    if ($owner -eq $target -and [HanaAppearance.Window]::GetWindow($hwnd, 4) -eq [IntPtr]::Zero) { $windows.Add($hwnd) }
    return $true
  }
  [void][HanaAppearance.Window]::EnumWindows($callback, [IntPtr]::Zero)
  foreach ($hwnd in $windows) {
    if ($replaced.ContainsKey($hwnd)) { continue }
    $previousSmall = [HanaAppearance.Window]::SendMessage($hwnd, 0x80, [IntPtr]0, $small.Handle)
    $previousBig = [HanaAppearance.Window]::SendMessage($hwnd, 0x80, [IntPtr]1, $big.Handle)
    $replaced[$hwnd] = @($previousSmall, $previousBig)
  }
}
try {
  while ($true) {
    if ($null -eq (Get-Process -Id $target -ErrorAction SilentlyContinue)) { exit 0 }
    Set-OwnedIcons
    if ($command.Wait(2000)) { break }
  }
} finally {
  foreach ($entry in $replaced.GetEnumerator()) {
    if ([HanaAppearance.Window]::IsWindow($entry.Key)) {
      [void][HanaAppearance.Window]::SendMessage($entry.Key, 0x80, [IntPtr]0, $entry.Value[0])
      [void][HanaAppearance.Window]::SendMessage($entry.Key, 0x80, [IntPtr]1, $entry.Value[1])
    }
  }
}
`

/** Owns at most one window-icon helper; `set` is idempotent per file. */
class WindowIconHolder {
	static owners = new Map()
	child
	file = null
	stopping = Promise.resolve()
	targetPid

	/** @param targetPid - the desktop main process, the parent of the host child. */
	constructor(targetPid = process.ppid) {
		this.targetPid = targetPid
	}

	set(file) {
		const previous = WindowIconHolder.owners.get(this.targetPid)
		if (file === this.file && (file === null || this.child !== undefined) && (previous === undefined || previous === this)) return
		this.stopping = previous?.stop() ?? this.stopping
		this.file = file
		if (file === null) return
		WindowIconHolder.owners.set(this.targetPid, this)
		this.stopping.then(() => {
			if (WindowIconHolder.owners.get(this.targetPid) !== this || this.file !== file || this.child !== undefined) return
			this.start(file)
		})
	}

	start(file) {
		const child = spawn('powershell.exe', ['-NoLogo', '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', Buffer.from(WINDOW_ICON_SCRIPT, 'utf16le').toString('base64')], {
			env: { ...process.env, HANA_ICON_FILE: file, HANA_ICON_PID: String(this.targetPid) },
			stdio: ['pipe', 'ignore', 'pipe'],
			windowsHide: true,
		})
		let stderr = ''
		child.stderr?.setEncoding('utf8')
		child.stderr?.on('data', (chunk) => {
			stderr = (stderr + chunk).slice(-4096)
		})
		child.on('error', (error) => {
			if (this.child === child) this.child = undefined
			console.error('[hana-appearance] window icon helper failed to start', error)
		})
		child.on('exit', (code) => {
			if (this.child === child) this.child = undefined
			if (code !== 0 && code !== null) console.error(`[hana-appearance] window icon helper exited with ${code}`, stderr.trim())
		})
		this.child = child
	}

	/** Ask the helper to restore the previous icons and exit; kill it if it lingers. */
	stop() {
		const child = this.child
		this.child = undefined
		this.file = null
		if (child === undefined) {
			this.stopping.then(() => {
				if (WindowIconHolder.owners.get(this.targetPid) === this && this.file === null) WindowIconHolder.owners.delete(this.targetPid)
			})
			return this.stopping
		}
		this.stopping = new Promise((resolve) => {
			const timer = setTimeout(() => {
				if (child.exitCode === null && child.signalCode === null) child.kill()
			}, 5000)
			timer.unref()
			child.once('close', () => {
				clearTimeout(timer)
				if (WindowIconHolder.owners.get(this.targetPid) === this && this.file === null) WindowIconHolder.owners.delete(this.targetPid)
				resolve()
			})
		})
		try {
			child.stdin?.end('stop\n')
		} catch {
			// stdin may already be closed
		}
		return this.stopping
	}
}

/** Keeps the shortcut state for one DSH home and serializes every pass. */
export class AppIconSync {
	constructor(home, shell, iconDir, iconIds, io = powershellShortcutIo, onIcon = () => {}) {
		this.shell = shell
		this.iconDir = iconDir
		this.iconIds = iconIds
		this.io = io
		this.onIcon = onIcon
		this.statePath = join(home, 'hana-appearance-app-icon.json')
		this.parkMarkerPath = join(home, 'hana-appearance-app-icon.parking')
		this.managedDir = join(home, 'hana-appearance-app-icons')
		this.customPath = join(home, 'hana-appearance-app-icon-custom.ico')
	}

	/** Existing, non-empty file of a plausible size. */
	static existingIcon(file) {
		try {
			const stat = statSync(file)
			return stat.isFile() && stat.size > 0 && stat.size <= MAX_UPLOAD_BYTES ? file : null
		} catch {
			return null
		}
	}

	iconSourceFile(iconId) {
		if (typeof iconId !== 'string') return null
		if (iconId === CUSTOM_ICON_ID) return AppIconSync.existingIcon(this.customPath)
		if (!this.iconIds.includes(iconId)) return null
		return AppIconSync.existingIcon(join(this.iconDir, `${iconId}.ico`))
	}

	/** Cache-busting version for the custom icon preview. */
	customVersion() {
		const file = AppIconSync.existingIcon(this.customPath)
		if (file === null) return null
		try {
			const bytes = readFileSync(file)
			return createHash('sha256').update(bytes).digest('hex').slice(0, 12)
		} catch {
			return null
		}
	}

	/** Persist a user-uploaded ICO and select it. */
	uploadCustom(bytes) {
		if (!Buffer.isBuffer(bytes) || !isIcoBuffer(bytes)) {
			return Promise.reject(new Error('invalid-ico'))
		}
		if (bytes.length > MAX_UPLOAD_BYTES) {
			return Promise.reject(new Error('icon-too-large'))
		}
		const temporary = `${this.customPath}.${process.pid}.tmp`
		mkdirSync(dirname(this.customPath), { recursive: true })
		writeFileSync(temporary, bytes)
		renameSync(temporary, this.customPath)
		return this.setIcon(CUSTOM_ICON_ID)
	}

	/** Delete the uploaded icon; restores the official icon when it is selected. */
	removeCustom() {
		return this.serial(async () => {
			rmSync(this.customPath, { force: true })
			const state = this.read()
			if (state.iconId !== CUSTOM_ICON_ID) return this.status()
			this.write({ ...state, iconId: null })
			return this.pass(null, true)
		})
	}

	/** Persist the selection, then apply it (or restore when `iconId` is null). */
	setIcon(iconId) {
		const selected = iconId === null || iconId === undefined ? null : iconId
		if (selected !== null && this.iconSourceFile(selected) === null) {
			return Promise.reject(new Error(`unknown-app-icon: ${selected}`))
		}
		return this.serial(async () => {
			this.write({ ...this.read(), iconId: selected })
			return this.pass(selected, true)
		})
	}

	/** Bring the shortcuts in line with the persisted selection; repairs a DSH update reset. */
	reconcile() {
		return this.serial(() => {
			const state = this.read()
			const iconId = state.iconId !== null && this.iconSourceFile(state.iconId) !== null ? state.iconId : null
			return this.pass(iconId)
		})
	}

	/** Finish queued writes before unloading the module that owns their queue. */
	drain() {
		return syncQueues.get(pathKey(this.statePath)) ?? Promise.resolve()
	}

	serial(task) {
		const key = pathKey(this.statePath)
		const run = (syncQueues.get(key) ?? Promise.resolve()).then(task, task)
		const settled = run.then(
			() => {},
			() => {}
		)
		syncQueues.set(key, settled)
		settled.then(() => {
			if (syncQueues.get(key) === settled) syncQueues.delete(key)
		})
		return run
	}

	async pass(iconId, scan = false) {
		const state = this.read()
		const sourceFile = iconId === null ? null : this.iconSourceFile(iconId)
		const effectiveId = sourceFile === null ? null : iconId
		const file = sourceFile === null ? null : this.install(sourceFile)
		this.onIcon(file)
		const customVersion = this.customVersion()
		if (!scan && file === null && Object.keys(state.shortcuts).length === 0 && !existsSync(this.parkMarkerPath) && !this.hasManagedIcons()) {
			return { supported: true, applied: null, hasCustom: customVersion !== null, customVersion, updated: 0, failed: 0 }
		}
		const desired = file === null ? null : `${file},0`
		const shortcuts = await this.io.scan(this.shell.execPath)
		rmSync(this.parkMarkerPath, { force: true })
		const plan = planAppIcon(state, shortcuts, desired, this.managedDir, (file) => existsSync(file))
		let results = []
		if (plan.changes.length > 0) {
			mkdirSync(dirname(this.parkMarkerPath), { recursive: true })
			writeFileSync(this.parkMarkerPath, '')
			results = await this.io.write(plan.changes)
			rmSync(this.parkMarkerPath, { force: true })
		}
		const failures = results.filter((result) => !result.ok)
		const failed = new Set(failures.map((result) => pathKey(result.path)))
		const next = { ...state, iconId: effectiveId, shortcuts: { ...state.shortcuts } }
		for (const [path, record] of Object.entries(plan.records)) {
			if (failed.has(pathKey(path))) continue
			if (record === null) delete next.shortcuts[path]
			else next.shortcuts[path] = record
		}
		this.write(next)
		const stranded = shortcuts.filter((shortcut) => failed.has(pathKey(shortcut.path)) && isManagedIcon(shortcut.icon, this.managedDir)).map((shortcut) => shortcut.icon)
		this.prune(desired, next, stranded)
		const sharedRoots = sharedShortcutRoots()
		const errors = [...new Set(failures.map((result) => describeShortcutFailure(result.path, result.error, sharedRoots)))]
		return {
			supported: true,
			applied: effectiveId,
			hasCustom: customVersion !== null,
			customVersion,
			updated: results.length - failed.size,
			failed: failed.size,
			...(errors.length > 0 ? { errors } : {}),
		}
	}

	hasManagedIcons() {
		try {
			return readdirSync(this.managedDir).some((file) => /\.ico$/i.test(file))
		} catch {
			return false
		}
	}

	/** Copy the ICO under a content-addressed name so the shortcut never points into a package. */
	install(source) {
		const bytes = readFileSync(source)
		const target = join(this.managedDir, `hana-${createHash('sha256').update(bytes).digest('hex').slice(0, 16)}.ico`)
		if (!existsSync(target)) {
			mkdirSync(this.managedDir, { recursive: true })
			const temporary = `${target}.${process.pid}.tmp`
			copyFileSync(source, temporary)
			renameSync(temporary, target)
		}
		return target
	}

	/** Remove managed ICOs no shortcut record still refers to. */
	prune(desired, state, stranded = []) {
		const keep = new Set([...Object.values(state.shortcuts).map((record) => record.applied), ...stranded].map((icon) => pathKey(iconFile(icon))))
		if (desired !== null) keep.add(pathKey(iconFile(desired)))
		let files
		try {
			files = readdirSync(this.managedDir)
		} catch {
			return
		}
		for (const file of files) {
			const full = join(this.managedDir, file)
			if (/\.ico$/i.test(file) && !keep.has(pathKey(full))) rmSync(full, { force: true })
		}
	}

	read() {
		try {
			const raw = JSON.parse(readFileSync(this.statePath, 'utf8'))
			const shortcuts = {}
			for (const [path, record] of Object.entries(raw.shortcuts ?? {})) {
				if (typeof record?.original === 'string' && typeof record.applied === 'string') shortcuts[path] = { original: record.original, applied: record.applied }
			}
			const iconId = typeof raw.iconId === 'string' && (this.iconIds.includes(raw.iconId) || raw.iconId === CUSTOM_ICON_ID) ? raw.iconId : null
			return { version: 1, iconId, shortcuts }
		} catch {
			return emptyState()
		}
	}

	write(state) {
		mkdirSync(dirname(this.statePath), { recursive: true })
		const temporary = `${this.statePath}.${process.pid}.tmp`
		writeFileSync(temporary, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
		renameSync(temporary, this.statePath)
	}

	status() {
		const state = this.read()
		const version = this.customVersion()
		return { supported: true, applied: state.iconId, hasCustom: version !== null, customVersion: version }
	}

	/** Bytes of the uploaded icon for the settings-page preview. */
	customIconBytes() {
		try {
			return readFileSync(this.customPath)
		} catch {
			return null
		}
	}
}

/**
 * Create the app-icon controller for the Windows desktop shell.
 * Returns null on every other platform/shape so the settings page can explain
 * that the feature is desktop-only.
 */
export function createAppIconControl({ home, iconDir, iconIds, log = () => {} }) {
	const shell = detectDesktopShell()
	if (shell === null) return null
	const windowIcon = new WindowIconHolder()
	let disposed = false
	const sync = new AppIconSync(home, shell, iconDir, iconIds, powershellShortcutIo, (file) => {
		if (!disposed) windowIcon.set(file)
	})
	Promise.resolve()
		.then(() => sync.reconcile())
		.catch((error) => log(error))
	return {
		control: {
			status: () => sync.status(),
			setIcon: (iconId) => sync.setIcon(iconId),
			reconcile: () => sync.reconcile(),
			uploadCustom: (bytes) => sync.uploadCustom(bytes),
			removeCustom: () => sync.removeCustom(),
			customIconBytes: () => sync.customIconBytes(),
		},
		dispose: async () => {
			disposed = true
			await Promise.all([windowIcon.stop(), sync.drain()])
		},
	}
}
