// ─── Alert Component Suite Self-Check ────────────────────────────────────────
// Automated assertions for AppAlert, AlertModal, AlertContext, and useAlert hook
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

// 1. Check file existence
const appAlertPath = path.join(root, 'src', 'components', 'common', 'AppAlert.tsx');
const alertModalPath = path.join(root, 'src', 'components', 'common', 'AlertModal.tsx');
const alertContextPath = path.join(root, 'src', 'components', 'common', 'AlertContext.tsx');
const commonIndexPath = path.join(root, 'src', 'components', 'common', 'index.ts');
const statusBannerPath = path.join(root, 'src', 'components', 'common', 'StatusBanner.tsx');
const appPath = path.join(root, 'App.tsx');

assert.ok(fs.existsSync(appAlertPath), 'AppAlert.tsx must exist');
assert.ok(fs.existsSync(alertModalPath), 'AlertModal.tsx must exist');
assert.ok(fs.existsSync(alertContextPath), 'AlertContext.tsx must exist');
assert.ok(fs.existsSync(commonIndexPath), 'common/index.ts must exist');
assert.ok(fs.existsSync(statusBannerPath), 'StatusBanner.tsx must exist');

// 2. Check exports in common/index.ts
const commonIndexContent = fs.readFileSync(commonIndexPath, 'utf8');
assert.match(commonIndexContent, /export \{ AppAlert \} from '\.\/AppAlert';/, 'Must export AppAlert');
assert.match(commonIndexContent, /export type \{ AppAlertProps, AlertVariant, AlertStyleType \} from '\.\/AppAlert';/, 'Must export AppAlert types');
assert.match(commonIndexContent, /export \{ AlertModal \} from '\.\/AlertModal';/, 'Must export AlertModal');
assert.match(commonIndexContent, /export type \{ AlertModalProps, AlertModalButton, AlertModalVariant \} from '\.\/AlertModal';/, 'Must export AlertModal types');
assert.match(commonIndexContent, /export \{ AlertProvider, useAlert \} from '\.\/AlertContext';/, 'Must export AlertProvider and useAlert');
assert.match(commonIndexContent, /export \{ StatusBanner \} from '\.\/StatusBanner';/, 'Must retain backward-compat StatusBanner export');

// 3. Check AppAlert implementation details
const appAlertContent = fs.readFileSync(appAlertPath, 'utf8');
assert.match(appAlertContent, /accessibilityRole="alert"/, 'AppAlert must have accessibilityRole="alert"');
assert.match(appAlertContent, /accessibilityLiveRegion="polite"/, 'AppAlert must have accessibilityLiveRegion="polite"');
assert.match(appAlertContent, /variant === 'danger' \? 'error' : variant/, 'AppAlert must support danger as alias for error');
assert.match(appAlertContent, /CloseXIcon/, 'AppAlert must import and support CloseXIcon');
assert.match(appAlertContent, /onClose\?\.()/, 'AppAlert must trigger onClose callback');

// 4. Check AlertModal implementation details
const alertModalContent = fs.readFileSync(alertModalPath, 'utf8');
assert.match(alertModalContent, /accessibilityViewIsModal/, 'AlertModal must have accessibilityViewIsModal');
assert.match(alertModalContent, /accessibilityRole="alert"/, 'AlertModal must have accessibilityRole="alert"');
assert.match(alertModalContent, /onRequestClose/, 'AlertModal must handle back button / onRequestClose');
assert.match(alertModalContent, /loadingIndex/, 'AlertModal must support async loading states for buttons');

// 5. Check AlertContext & useAlert
const alertContextContent = fs.readFileSync(alertContextPath, 'utf8');
assert.match(alertContextContent, /export function useAlert\(\)/, 'Must export useAlert hook');
assert.match(alertContextContent, /export function AlertProvider/, 'Must export AlertProvider');
assert.match(alertContextContent, /showAlert/, 'Must provide showAlert method');
assert.match(alertContextContent, /showConfirm/, 'Must provide showConfirm method');
assert.match(alertContextContent, /hideAlert/, 'Must provide hideAlert method');

// 6. Check backward compatibility of StatusBanner
const statusBannerContent = fs.readFileSync(statusBannerPath, 'utf8');
assert.match(statusBannerContent, /from '\.\/AppAlert'/, 'StatusBanner must delegate to AppAlert');
assert.match(statusBannerContent, /export type StatusBannerProps/, 'StatusBanner must preserve StatusBannerProps type');

// 7. Check App.tsx integration
const appContent = fs.readFileSync(appPath, 'utf8');
assert.match(appContent, /AlertProvider/, 'App.tsx must import and mount AlertProvider');
assert.match(appContent, /<ThemeProvider>[\s\S]*?<AlertProvider>/, 'AlertProvider must be nested within ThemeProvider');

// 8. Verify ZERO remaining usages of native Alert.alert across src/
function scanDirectory(dir, filter) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(scanDirectory(fullPath, filter));
    } else if (filter(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

const srcFiles = scanDirectory(path.join(root, 'src'), (f) => f.endsWith('.ts') || f.endsWith('.tsx'));
const legacyAlertFiles = [];
for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  if (/\bAlert\.alert\(/.test(content) || /import\s*\{[^}]*\bAlert\b[^}]*\}\s*from\s*'react-native'/.test(content)) {
    legacyAlertFiles.push(path.relative(root, file));
  }
}
assert.deepEqual(legacyAlertFiles, [], `Found legacy Alert imports or calls: ${legacyAlertFiles.join(', ')}`);

console.log('Alert Component Suite self-check passed! (8/8 assertions verified)');
