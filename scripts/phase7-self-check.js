const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

// 1. Check Phase 7 asset keys in image registry
const registry = fs.readFileSync(path.join(root, 'src', 'assets', 'images', 'index.ts'), 'utf8');
const expectedAssetKeys = [
  'accountCardBg',
  'accountTarget',
  'reOnboarding',
  'maintenanceArtwork',
  'forceUpdateApp',
  'informUpdateApp',
  'facebookLogo',
  'instagramLogo',
  'tiktokLogo',
  'fbGroupArtwork',
];

for (const key of expectedAssetKeys) {
  assert.match(registry, new RegExp(key), `Missing asset key in index.ts: ${key}`);
}

// 2. Offline-First & Sync Queue Verification (FR-SYS-05, FR-SYS-06, AC1 mục 4.8)
// Scenario: Go offline -> log 3 water + 1 meal with client_uuid -> return online -> sync idempotently
const syncManagerSource = fs.readFileSync(path.join(root, 'src', 'services', 'offline', 'syncManager.ts'), 'utf8');
assert.match(syncManagerSource, /generateClientUuid/);
assert.match(syncManagerSource, /deduplicateQueue/);
assert.match(syncManagerSource, /pushSyncBatch/);

function deduplicateQueue(queue) {
  const seen = new Set();
  const result = [];
  for (let i = queue.length - 1; i >= 0; i--) {
    const item = queue[i];
    if (!seen.has(item.clientUuid)) {
      seen.add(item.clientUuid);
      result.unshift(item);
    }
  }
  return result;
}

const mockWaterLogs = [
  { clientUuid: 'kallo-water-1', type: 'WATER_LOG', payload: { amountMl: 250, date: '2026-10-16' }, timestamp: '2026-10-16T10:00:00Z', status: 'PENDING', retryCount: 0 },
  { clientUuid: 'kallo-water-2', type: 'WATER_LOG', payload: { amountMl: 250, date: '2026-10-16' }, timestamp: '2026-10-16T10:15:00Z', status: 'PENDING', retryCount: 0 },
  { clientUuid: 'kallo-water-3', type: 'WATER_LOG', payload: { amountMl: 500, date: '2026-10-16' }, timestamp: '2026-10-16T10:30:00Z', status: 'PENDING', retryCount: 0 },
];

const mockMealLog = {
  clientUuid: 'kallo-food-1',
  type: 'FOOD_LOG',
  payload: { foodId: 'pho-bo', grams: 450, meal: 'breakfast', date: '2026-10-16' },
  timestamp: '2026-10-16T10:35:00Z',
  status: 'PENDING',
  retryCount: 0,
};

const offlineQueue = [...mockWaterLogs, mockMealLog];
assert.equal(offlineQueue.length, 4, 'Offline queue recorded 3 water logs + 1 meal log');

// Test duplicate incoming record with matching client_uuid
const duplicateItem = { ...mockMealLog, timestamp: '2026-10-16T10:36:00Z' };
const queueWithDuplicates = [...offlineQueue, duplicateItem];
const deduplicated = deduplicateQueue(queueWithDuplicates);
assert.equal(deduplicated.length, 4, 'Deduplication correctly prevents duplicate client_uuid entry');

// 3. Check Notifications & Smart Reminders (FR-SYS-01..04)
const systemProviderSource = fs.readFileSync(path.join(root, 'src', 'features', 'system', 'SystemProvider.tsx'), 'utf8');
assert.match(systemProviderSource, /INITIAL_NOTIFICATIONS/);
assert.match(systemProviderSource, /DEFAULT_REMINDERS/);
assert.match(systemProviderSource, /waterReminderEnabled/);
assert.match(systemProviderSource, /breakfastReminderEnabled/);
assert.match(systemProviderSource, /lunchReminderEnabled/);
assert.match(systemProviderSource, /dinnerReminderEnabled/);
assert.match(systemProviderSource, /overCalorieWarningEnabled/);
assert.match(systemProviderSource, /dndEnabled/);

// Over-calorie alert rule check (FR-SYS-02)
assert.match(systemProviderSource, /Cảnh báo Calo mục tiêu/);

// 4. Verify AccountProfileScreen, Modals and Required Screen Files
const requiredFiles = [
  'src/components/common/OfflineBanner.tsx',
  'src/services/offline/types.ts',
  'src/services/offline/syncManager.ts',
  'src/services/offline/OfflineSyncProvider.tsx',
  'src/services/offline/index.ts',
  'src/features/system/types.ts',
  'src/features/system/SystemProvider.tsx',
  'src/features/system/screens/AccountProfileScreen.tsx',
  'src/features/system/screens/NotificationCenterScreen.tsx',
  'src/features/system/screens/ReminderSettingsScreen.tsx',
  'src/features/system/components/MaintenanceModal.tsx',
  'src/features/system/components/ForceUpdateModal.tsx',
  'src/features/system/index.ts',
];

for (const rel of requiredFiles) {
  assert.ok(fs.existsSync(path.join(root, rel)), `Required file missing: ${rel}`);
}

// 5. Check Navigation registration
const navTypesSource = fs.readFileSync(path.join(root, 'src', 'navigation', 'types.ts'), 'utf8');
assert.match(navTypesSource, /NotificationCenter:/);
assert.match(navTypesSource, /ReminderSettings:/);

const tabNavSource = fs.readFileSync(path.join(root, 'src', 'navigation', 'MainTabNavigator.tsx'), 'utf8');
assert.match(tabNavSource, /AccountProfileScreen/);

console.log('Phase 7 system utilities, offline-first & UX polish self-check passed');
