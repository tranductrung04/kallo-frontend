const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

// 1. Verify lucide-react-native in package.json dependencies
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
assert.ok(
  packageJson.dependencies && packageJson.dependencies['lucide-react-native'],
  'lucide-react-native must be installed under dependencies'
);

// 2. Verify legacy monolithic AppIcons.tsx is removed
assert.ok(
  !fs.existsSync(path.join(root, 'src', 'components', 'icons', 'AppIcons.tsx')),
  'src/components/icons/AppIcons.tsx must be removed'
);

// 3. Verify modular structure exists
const requiredFiles = [
  path.join(root, 'src', 'components', 'icons', 'types.ts'),
  path.join(root, 'src', 'components', 'icons', 'lucide.tsx'),
  path.join(root, 'src', 'components', 'icons', 'custom', 'index.tsx'),
  path.join(root, 'src', 'components', 'icons', 'illustrations', 'index.tsx'),
  path.join(root, 'src', 'components', 'icons', 'index.ts'),
];

for (const file of requiredFiles) {
  assert.ok(fs.existsSync(file), `Expected module does not exist: ${file}`);
}

// 4. Verify no duplicated icon export names across lucide and custom
const lucideContent = fs.readFileSync(path.join(root, 'src', 'components', 'icons', 'lucide.tsx'), 'utf8');
const customContent = fs.readFileSync(path.join(root, 'src', 'components', 'icons', 'custom', 'index.tsx'), 'utf8');

const lucideExports = [...lucideContent.matchAll(/export const ([A-Za-z0-9_]+)/g)].map((m) => m[1]);
const customExports = [...customContent.matchAll(/export (?:const|function) ([A-Za-z0-9_]+)/g)].map((m) => m[1]);

const duplicates = lucideExports.filter((name) => customExports.includes(name));
assert.deepEqual(duplicates, [], `Found duplicate icon exports between lucide.tsx and custom/index.tsx: ${duplicates.join(', ')}`);

// 5. Verify core icon exports are present across the icon package
const indexContent = fs.readFileSync(path.join(root, 'src', 'components', 'icons', 'index.ts'), 'utf8');
assert.match(indexContent, /export \* from '\.\/types';/);
assert.match(indexContent, /export \* from '\.\/lucide';/);
assert.match(indexContent, /export \* from '\.\/custom';/);
assert.match(indexContent, /export \* from '\.\/illustrations';/);

const allExportedIcons = new Set([...lucideExports, ...customExports]);

const expectedCoreIcons = [
  // Navigation & Common
  'ChevronLeftIcon',
  'ChevronRightIcon',
  'ChevronDownIcon',
  'ChevronUpIcon',
  'CloseXIcon',
  'PlusIcon',
  'CirclePlusIcon',
  'CheckIcon',
  'InfoIcon',
  'MenuIcon',
  'SearchIcon',
  'QuickSearchIcon',
  'SunIcon',
  'MoonIcon',
  'CalendarIcon',
  'FlagIcon',
  // Tab Bar & Navigation
  'HomeTabIcon',
  'DiaryTabIcon',
  'MealPlanTabIcon',
  'ProfileTabIcon',
  // Quick Actions, Scanner & Account
  'FlameIcon',
  'QuickBarcodeIcon',
  'ViewfinderBarcodeIcon',
  'BarcodeSquareIcon',
  'QuickSparklesIcon',
  'SparklesIcon',
  'QuickVoiceIcon',
  'ScannerSparkleFlashIcon',
  'GalleryAddIcon',
  'AppleScanIcon',
  'GearSettingsIcon',
  'MailInboxIcon',
  'LockClosedIcon',
  'ShieldSecurityIcon',
  'ClipboardCopyIcon',
  'ShareNodesIcon',
  'UsersIcon',
  'UserSingleIcon',
  'TrophyIcon',
  'BookIcon',
  // Nutrition & Macros
  'CutleryIcon',
  'LightningIcon',
  'LightningBoltIcon',
  'DropletIcon',
  'WheatIcon',
  'SugarIcon',
  'WaterGlassPlusIcon',
  'BodyStickFigureIcon',
  'SaltIcon',
  'FiberIcon',
  // Activity
  'BicycleIcon',
  'FootprintsIcon',
  'RunningIcon',
  'ShuttlecockIcon',
  'PickleballIcon',
  'YogaIcon',
  'MoreActivitiesIcon',
  // Status & Feedback (D5)
  'TriangleAlertIcon',
  'CircleAlertIcon',
  'CircleCheckIcon',
  // Health
  'HeartIcon',
  'ClockIcon',
  'CloudIcon',
];

for (const icon of expectedCoreIcons) {
  assert.ok(
    allExportedIcons.has(icon) || lucideContent.includes(`function ${icon}`) || customContent.includes(`function ${icon}`),
    `Missing core icon export: ${icon}`
  );
}

console.log('Phase 8 icon migration self-check passed');
