// Unit tests for the Windows desktop app-icon planner (host half).
// Pure functions only: no PowerShell, no file system side effects.
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { AppIconSync, decodeBase64Ico, describeShortcutFailure, iconFile, isIcoBuffer, isManagedIcon, planAppIcon } from '../lib/app-icon.js'

const assert = (cond, message) => {
  if (!cond) throw new Error('ASSERT FAILED: ' + message)
  console.log('ok -', message)
}

const managedDir = 'C:\\Users\\Admin\\.dsh\\hana-appearance-app-icons'
const managedIcon = `${managedDir}\\hana-0123456789abcdef.ico,0`
const exeIcon = 'E:\\Deepseek Harness\\DeepSeek Harness.exe,0'

const shortcut = (path, icon) => ({ path, target: 'E:\\Deepseek Harness\\DeepSeek Harness.exe', icon })

// 1) First apply: every matching shortcut gets rewritten and its original icon recorded.
{
  const state = { version: 1, iconId: null, shortcuts: {} }
  const shortcuts = [shortcut('C:\\Users\\Admin\\Desktop\\DeepSeek Harness.lnk', exeIcon), shortcut('C:\\Users\\Admin\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\DeepSeek Harness.lnk', exeIcon)]
  const plan = planAppIcon(state, shortcuts, managedIcon, managedDir)
  assert(plan.changes.length === 2, 'apply rewrites both shortcuts')
  assert(plan.changes.every((change) => change.icon === managedIcon), 'apply points shortcuts at the managed ICO')
  assert(Object.values(plan.records).every((record) => record.original === exeIcon && record.applied === managedIcon), 'apply records the original icon')
}

// 2) Restore: shortcuts still showing our icon go back to the recorded original.
{
  const state = {
    version: 1,
    iconId: 'plum',
    shortcuts: {
      'C:\\Users\\Admin\\Desktop\\DeepSeek Harness.lnk': { original: exeIcon, applied: managedIcon },
    },
  }
  const shortcuts = [shortcut('C:\\Users\\Admin\\Desktop\\DeepSeek Harness.lnk', managedIcon)]
  const plan = planAppIcon(state, shortcuts, null, managedDir)
  assert(plan.changes.length === 1 && plan.changes[0].icon === exeIcon, 'restore puts the original icon back')
  assert(plan.records['C:\\Users\\Admin\\Desktop\\DeepSeek Harness.lnk'] === null, 'restore drops the shortcut record')
}

// 3) Restore never touches an icon the user changed by hand.
{
  const state = {
    version: 1,
    iconId: 'plum',
    shortcuts: {
      'C:\\Users\\Admin\\Desktop\\DeepSeek Harness.lnk': { original: exeIcon, applied: managedIcon },
    },
  }
  const custom = 'D:\\custom\\my-icon.ico,0'
  const plan = planAppIcon(state, [shortcut('C:\\Users\\Admin\\Desktop\\DeepSeek Harness.lnk', custom)], null, managedDir)
  assert(plan.changes.length === 0, 'restore leaves a user-changed icon alone')
}

// 3b) A recorded original that another tool already deleted falls back to the exe icon.
{
  const deleted = 'C:\\Users\\Admin\\.dsh\\skin-manager\\desktop-icons\\gone.ico,0'
  const state = {
    version: 1,
    iconId: 'plum',
    shortcuts: {
      'C:\\Users\\Admin\\Desktop\\DeepSeek Harness.lnk': { original: deleted, applied: managedIcon },
    },
  }
  const plan = planAppIcon(state, [shortcut('C:\\Users\\Admin\\Desktop\\DeepSeek Harness.lnk', managedIcon)], null, managedDir, (file) => file !== 'C:\\Users\\Admin\\.dsh\\skin-manager\\desktop-icons\\gone.ico')
  assert(plan.changes.length === 1 && plan.changes[0].icon === exeIcon, 'missing original falls back to the executable icon')
}

// 4) A requested icon that already matches does not churn the shortcut.
{
  const state = { version: 1, iconId: 'plum', shortcuts: {} }
  const shortcuts = [shortcut('C:\\Users\\Admin\\Desktop\\DeepSeek Harness.lnk', managedIcon)]
  const plan = planAppIcon(state, shortcuts, managedIcon, managedDir)
  assert(plan.changes.length === 0 && plan.records['C:\\Users\\Admin\\Desktop\\DeepSeek Harness.lnk'].applied === managedIcon, 'already-applied icon records without a rewrite')
}

// 5) Shortcuts that vanished are dropped from the state.
{
  const state = {
    version: 1,
    iconId: 'plum',
    shortcuts: { 'C:\\Old\\DeepSeek Harness.lnk': { original: exeIcon, applied: managedIcon } },
  }
  const plan = planAppIcon(state, [], managedIcon, managedDir)
  assert(plan.records['C:\\Old\\DeepSeek Harness.lnk'] === null, 'vanished shortcut record is dropped')
}

// 6) IconLocation parsing and managed-dir detection.
assert(iconFile('C:\\a\\b.ico,3') === 'C:\\a\\b.ico', 'iconFile strips the resource index')
assert(iconFile('"C:\\a\\b.ico",0') === 'C:\\a\\b.ico', 'iconFile strips surrounding quotes')
assert(isManagedIcon(`${managedDir}\\x.ico,0`, managedDir) === true, 'managed icon directory is recognised')
assert(isManagedIcon('E:\\Deepseek Harness\\DeepSeek Harness.exe,0', managedDir) === false, 'exe icon is not managed')

// 7) Failure classification used by the settings-page message.
const sharedRoots = ['C:\\Users\\Public\\Desktop', 'C:\\ProgramData\\Microsoft\\Windows\\Start Menu']
assert(describeShortcutFailure('C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\DeepSeek Harness.lnk', 'Access denied', sharedRoots) === 'shared-denied', 'shared shortcuts report shared-denied')
assert(describeShortcutFailure('C:\\Users\\Admin\\Desktop\\DeepSeek Harness.lnk', 'Unable to save shortcut', sharedRoots) === 'save-blocked', 'security-blocked writes report save-blocked')
assert(describeShortcutFailure('C:\\Users\\Admin\\Desktop\\DeepSeek Harness.lnk', 'shortcut-missing', sharedRoots) === 'shortcut-missing', 'other failures pass through')

// 8) ICO header validation used by the custom-icon upload route.
const icoHeader = (count) => {
  const buffer = Buffer.alloc(6)
  buffer.writeUInt16LE(0, 0)
  buffer.writeUInt16LE(1, 2)
  buffer.writeUInt16LE(count, 4)
  return buffer
}
assert(isIcoBuffer(icoHeader(1)) === true, 'a valid ICO header is accepted')
assert(isIcoBuffer(icoHeader(7)) === true, 'multi-size ICO headers are accepted')
assert(isIcoBuffer(Buffer.from([0, 0, 1, 0, 0, 0])) === false, 'an ICO without images is rejected')
assert(isIcoBuffer(Buffer.from('not an icon')) === false, 'arbitrary bytes are rejected')
assert(isIcoBuffer(Buffer.from([0, 0, 5, 0, 1, 0])) === false, 'a non-ICO type is rejected')

// 8b) Base64 upload channel used by the desktop settings page.
const base64Header = icoHeader(1).toString('base64')
assert(isIcoBuffer(decodeBase64Ico(base64Header)) === true, 'base64 upload decodes to the ICO bytes')
assert(isIcoBuffer(decodeBase64Ico(' ' + base64Header + '\n')) === true, 'base64 upload tolerates whitespace')
const base64Throws = (value) => {
  try {
    decodeBase64Ico(value)
    return false
  } catch (error) {
    return error.message === 'invalid-ico'
  }
}
assert(base64Throws('') === true, 'empty base64 uploads are rejected')
assert(base64Throws('AAAA') === true, 'too-short base64 uploads are rejected')
assert(base64Throws('not base64!!') === true, 'malformed base64 uploads are rejected')

// 9) Custom icon lifecycle against a temporary DSH home and a stub scanner.
{
  const home = mkdtempSync(join(tmpdir(), 'hana-icon-test-'))
  const iconDir = join(home, 'bundled')
  mkdirSync(iconDir)
  writeFileSync(join(iconDir, 'orchid.ico'), icoHeader(1))

  const io = {
    async scan() {
      return []
    },
    async write(changes) {
      return changes.map((change) => ({ path: change.path, ok: true }))
    },
  }
  const windowIcons = []
  const sync = new AppIconSync(home, { execPath: 'C:\\app\\DeepSeek Harness.exe' }, iconDir, ['orchid'], io, (file) => windowIcons.push(file))

  await sync.reconcile()
  const uploaded = icoHeader(1)
  const uploadedResult = await sync.uploadCustom(uploaded)
  assert(uploadedResult.applied === 'custom', 'uploading a custom icon selects it')
  assert(existsSync(join(home, 'hana-appearance-app-icon-custom.ico')) === true, 'custom ICO is persisted under DSH_HOME')
  assert(sync.status().hasCustom === true && typeof sync.status().customVersion === 'string', 'status reports the custom icon and its version')
  assert(
    windowIcons.some((file) => file !== null && file.includes('hana-appearance-app-icons')),
    'window icon helper received a managed copy of the custom ICO'
  )

  const selectedBuiltin = await sync.setIcon('orchid')
  assert(selectedBuiltin.applied === 'orchid', 'built-in icons still work after a custom upload')
  assert(sync.status().hasCustom === true, 'custom icon stays stored while another icon is selected')

  const removed = await sync.removeCustom()
  assert(removed.applied === 'orchid', 'removing the custom icon keeps the current built-in selection')
  assert(sync.status().hasCustom === false, 'removed custom icon disappears from the status')

  const rejected = await sync.uploadCustom(Buffer.from('not an icon')).then(
    () => false,
    () => true
  )
  assert(rejected === true, 'invalid uploads are rejected')
  rmSync(home, { recursive: true, force: true })
}

console.log('app-icon planner tests passed')
process.exit(0)
