// ─── Toast Component Suite Self-Check ─────────────────────────────────────────
// Automated assertions for AppToast, ToastContext, useToast hook, and toast singleton
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

// 1. Check file existence
const appToastPath = path.join(root, 'src', 'components', 'common', 'AppToast.tsx');
const toastContextPath = path.join(root, 'src', 'components', 'common', 'ToastContext.tsx');
const commonIndexPath = path.join(root, 'src', 'components', 'common', 'index.ts');
const appPath = path.join(root, 'App.tsx');

assert.ok(fs.existsSync(appToastPath), 'AppToast.tsx must exist');
assert.ok(fs.existsSync(toastContextPath), 'ToastContext.tsx must exist');
assert.ok(fs.existsSync(commonIndexPath), 'common/index.ts must exist');
assert.ok(fs.existsSync(appPath), 'App.tsx must exist');

// 2. Check exports in common/index.ts
const commonIndexContent = fs.readFileSync(commonIndexPath, 'utf8');
assert.match(commonIndexContent, /export \{ AppToast \} from '\.\/AppToast';/, 'Must export AppToast');
assert.match(commonIndexContent, /export type \{ AppToastProps, ToastType, ToastPosition, ToastAction, ToastItem \} from '\.\/AppToast';/, 'Must export AppToast types');
assert.match(commonIndexContent, /export \{ ToastProvider, useToast, toast \} from '\.\/ToastContext';/, 'Must export ToastProvider, useToast, and toast');
assert.match(commonIndexContent, /export type \{ ToastOptions, ToastContextValue, PromiseToastMessages \} from '\.\/ToastContext';/, 'Must export ToastContext types');

// 3. Check AppToast implementation details
const appToastContent = fs.readFileSync(appToastPath, 'utf8');
assert.match(appToastContent, /accessibilityRole="alert"/, 'AppToast must have accessibilityRole="alert"');
assert.match(appToastContent, /accessibilityLiveRegion="polite"/, 'AppToast must have accessibilityLiveRegion="polite"');
assert.match(appToastContent, /useSafeAreaInsets/, 'AppToast must use useSafeAreaInsets for notch/island compliance');
assert.match(appToastContent, /PanResponder/, 'AppToast must implement PanResponder for swipe gestures');
assert.match(appToastContent, /CloseXIcon/, 'AppToast must support CloseXIcon close button');
assert.match(appToastContent, /progressBarTrack/, 'AppToast must render a progress bar track for countdown');
assert.match(appToastContent, /pauseTimer/, 'AppToast must support pausing countdown on touch/press');
assert.match(appToastContent, /action\?\.onPress/, 'AppToast must support custom action callback');

// 4. Check ToastContext & toast imperative singleton
const toastContextContent = fs.readFileSync(toastContextPath, 'utf8');
assert.match(toastContextContent, /export function useToast\(\)/, 'Must export useToast hook');
assert.match(toastContextContent, /export function ToastProvider/, 'Must export ToastProvider');
assert.match(toastContextContent, /export const toast = \{/, 'Must export toast imperative singleton');
assert.match(toastContextContent, /success:/, 'Must provide toast.success');
assert.match(toastContextContent, /error:/, 'Must provide toast.error');
assert.match(toastContextContent, /warning:/, 'Must provide toast.warning');
assert.match(toastContextContent, /info:/, 'Must provide toast.info');
assert.match(toastContextContent, /loading:/, 'Must provide toast.loading');
assert.match(toastContextContent, /promise:/, 'Must provide toast.promise');
assert.match(toastContextContent, /dismiss:/, 'Must provide toast.dismiss');

// 5. Check App.tsx integration
const appContent = fs.readFileSync(appPath, 'utf8');
assert.match(appContent, /ToastProvider/, 'App.tsx must import and mount ToastProvider');
assert.match(appContent, /<AlertProvider>[\s\S]*?<ToastProvider>/, 'ToastProvider must be nested within AlertProvider and ThemeProvider');

// 6. Check ActivityProvider integration
const activityProviderPath = path.join(root, 'src', 'features', 'activity', 'ActivityProvider.tsx');
assert.ok(fs.existsSync(activityProviderPath), 'ActivityProvider.tsx must exist');
const activityProviderContent = fs.readFileSync(activityProviderPath, 'utf8');
assert.match(activityProviderContent, /import\s*\{[^}]*\btoast\b[^}]*\}\s*from\s*'@\/components\/common'/, 'ActivityProvider must import toast');
assert.match(activityProviderContent, /toast\.success\(/, 'ActivityProvider must call toast.success in addActivityLog');

console.log('Toast Component Suite self-check passed! (6/6 assertions verified)');

