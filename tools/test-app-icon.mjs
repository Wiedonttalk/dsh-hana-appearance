// Unit tests for the Windows desktop app-icon planner (host half).
// Pure functions only: no PowerShell, no file system side effects.
import { describeShortcutFailure, iconFile, isManagedIcon, planAppIcon } from '../lib/app-icon.js'

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

console.log('app-icon planner tests passed')
process.exit(0)
