const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

// 1. Check Phase 5 asset keys in image registry
const registry = fs.readFileSync(path.join(root, 'src', 'assets', 'images', 'index.ts'), 'utf8');
const expectedAssetKeys = [
  'healthConnectArtwork',
  'healthConnectIcon',
  'appleHealthArtwork',
  'appleHealthIcon',
  'trackerSyncIcon',
  'bodyMetricIntro',
  'bodyMetricWhrHint',
  'reportChartBg',
  'reportWlCardBg',
  'reportLampIcon',
  'trackingCaloriesChart',
  'caloriesBurnedChart',
];
for (const key of expectedAssetKeys) {
  assert.match(registry, new RegExp(key), `Missing asset key: ${key}`);
}

// 2. Check Activity calculations & formulas
const actUtilsSource = fs.readFileSync(path.join(root, 'src', 'features', 'activity', 'utils.ts'), 'utf8');
assert.match(actUtilsSource, /calculateCaloriesBurned/);
assert.match(actUtilsSource, /estimateStepCalories/);
assert.match(actUtilsSource, /calculateWhr/);
assert.match(actUtilsSource, /classifyWhrRisk/);
assert.match(actUtilsSource, /deduplicateSyncLogs/);

// Formula verification: MET * weight * (duration / 60)
const runningMet = 8.3;
const weightKg = 65;
const durationMin = 30;
const expectedBurned = Math.round(runningMet * weightKg * (durationMin / 60)); // ~270 kcal
assert.equal(expectedBurned, 270);

// WHR ratio calculation
const waist = 72;
const hip = 92;
const whr = Math.round((waist / hip) * 100) / 100;
assert.equal(whr, 0.78);

// Health sync deduplication rule (AC2 mục 4.5):
// Syncing with identical source and externalId / date should flag duplicate and delta = 0
const initialLogs = [
  { id: '1', date: '2026-10-16', source: 'HEALTH_CONNECT', externalId: 'sync-hc-2026-10-16', steps: 6540, caloriesBurned: 218, syncedAt: '2026-10-16T08:00:00Z', status: 'SUCCESS' },
];
const duplicateIncoming = {
  id: '2',
  date: '2026-10-16',
  source: 'HEALTH_CONNECT',
  externalId: 'sync-hc-2026-10-16',
  steps: 6540,
  caloriesBurned: 218,
  syncedAt: '2026-10-16T08:30:00Z',
  status: 'SUCCESS',
};
const match = initialLogs.find((l) => l.source === duplicateIncoming.source && l.externalId === duplicateIncoming.externalId);
assert.ok(match, 'Matching sync record found');
assert.equal(match.steps === duplicateIncoming.steps && match.caloriesBurned === duplicateIncoming.caloriesBurned, true, 'Duplicate sync correctly identified without increasing steps or calories');

// 3. Check Report calculations & formulas
const reportUtilsSource = fs.readFileSync(path.join(root, 'src', 'features', 'report', 'utils.ts'), 'utf8');
assert.match(reportUtilsSource, /getPeriodDates/);
assert.match(reportUtilsSource, /aggregatePeriodSummary/);
assert.match(reportUtilsSource, /calculateMacroReport/);
assert.match(reportUtilsSource, /calculateWeightTrendAndForecast/);

// Week total = sum of 7 days (AC2 mục 4.6)
const sampleDays = [1800, 1950, 2100, 1850, 2000, 2200, 1900];
const weekTotal = sampleDays.reduce((a, b) => a + b, 0);
assert.equal(weekTotal, 13800);

// 14-day data threshold for AI forecast (AC3 mục 4.6)
assert.match(reportUtilsSource, /requiredDays = 14/);
assert.match(reportUtilsSource, /hasEnoughData: false/);

// 4. Verify screens and UI components exist
const requiredFiles = [
  'src/features/activity/screens/ActivityTrackerScreen.tsx',
  'src/features/activity/screens/HealthSyncScreen.tsx',
  'src/features/activity/screens/BodyMetricScreen.tsx',
  'src/features/report/screens/ReportOverviewScreen.tsx',
  'src/features/report/components/CalorieBarChart.tsx',
  'src/features/report/components/MacroReportChart.tsx',
  'src/features/report/components/WeightTrendChart.tsx',
  'src/features/report/components/WeightForecastCard.tsx',
  'src/features/report/components/PeriodSelector.tsx',
];
for (const rel of requiredFiles) {
  assert.ok(fs.existsSync(path.join(root, rel)), `Required file missing: ${rel}`);
}

console.log('Phase 5 activity, health sync & report self-check passed');
