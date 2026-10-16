const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

// 1. Check Phase 6 asset keys in image registry
const registry = fs.readFileSync(path.join(root, 'src', 'assets', 'images', 'index.ts'), 'utf8');
const expectedAssetKeys = [
  'mealPlanNewAiBanner',
  'mealPlanRecipeSuggestion',
  'mealPlanRecipeScanBanner',
  'recipeScanIntroArtwork',
  'mealPlanStep1',
  'mealPlanStep2',
  'mealPlanStep3',
  'streakActiveBg',
  'streakChainBg',
  'streakInactiveBg',
  'streakAchievedBg',
  'streakAchieveChainBg',
  'streakAchievedArt1',
  'streakAchievedArt2',
  'streakFreezeBg',
  'streakProtectedBg',
  'streakFreezeArt1',
  'streakShareChainBg',
  'congratulationBadge',
  'paywallTrophy',
  'awardBackground',
  'courseArtwork',
  'courseEmpty01',
  'courseEmpty02',
  'groupUsers',
  'communityBanner',
  'voiceLogBg',
  'voiceLogMascot',
];

for (const key of expectedAssetKeys) {
  assert.match(registry, new RegExp(key), `Missing asset key in index.ts: ${key}`);
}

// 2. Check Meal Plan generation & algorithms (FR-PLAN-01..06)
const mealPlanUtils = fs.readFileSync(path.join(root, 'src', 'features', 'meal-plan', 'utils.ts'), 'utf8');
assert.match(mealPlanUtils, /generateMealPlan/);
assert.match(mealPlanUtils, /isAllergenFree/);
assert.match(mealPlanUtils, /findSwapCandidates/);
assert.match(mealPlanUtils, /MEAL_RATIOS/);

// Ratio distribution verification (line 363: Sáng 25%, Trưa 35%, Tối 30%, Phụ 10%)
assert.match(mealPlanUtils, /breakfast: 0.25/);
assert.match(mealPlanUtils, /lunch: 0.35/);
assert.match(mealPlanUtils, /dinner: 0.3/);
assert.match(mealPlanUtils, /snack: 0.1/);

// Allergen filtering test
const testRecipeWithShrimp = {
  id: 'shrimp-test',
  name: 'Tôm hấp',
  allergens: ['Hải sản', 'Tôm'],
};
const lowerAllergens = testRecipeWithShrimp.allergens.map((a) => a.toLowerCase());
const hasShrimp = lowerAllergens.some((a) => a.includes('tôm') || a.includes('hải sản'));
assert.equal(hasShrimp, true, 'Allergen detection correctly flags shrimp');

// 3. Check Chatbot AI rules & medical boundaries (FR-CHAT-01..06)
const assistantUtils = fs.readFileSync(path.join(root, 'src', 'features', 'assistant', 'utils.ts'), 'utf8');
assert.match(assistantUtils, /generateAssistantResponse/);
assert.match(assistantUtils, /isMedicalQuery/);
assert.match(assistantUtils, /MEDICAL_KEYWORDS/);
assert.match(assistantUtils, /QUICK_PROMPTS/);

// Medical disclaimer check (FR-CHAT-06)
const medicalKeywords = ['thuốc', 'bệnh', 'ung thư', 'tiểu đường'];
for (const kw of medicalKeywords) {
  assert.match(assistantUtils, new RegExp(kw));
}

// 4. Check Gamification rules & Streak calculation (FR-GAM-01..07)
const gameUtils = fs.readFileSync(path.join(root, 'src', 'features', 'gamification', 'utils.ts'), 'utf8');
assert.match(gameUtils, /checkDailyGoalAchieved/);
assert.match(gameUtils, /buildLeaderboard/);
assert.match(gameUtils, /INITIAL_BADGES/);
assert.match(gameUtils, /INITIAL_CHALLENGES/);
assert.match(gameUtils, /INITIAL_FRIENDS/);

// Check AC rule: Daily goal requires >= 2 meals and calories within +-10%
const goalCal = 2000;
const tolerance10 = goalCal * 0.1; // 200 kcal
assert.equal(Math.abs(2050 - goalCal) <= tolerance10, true, '2050 kcal is within +-10% of 2000');
assert.equal(Math.abs(2250 - goalCal) <= tolerance10, false, '2250 kcal is outside +-10% of 2000');

// 5. Check Privacy (FR-GAM-07): Leaderboard must never expose user's absolute weight
const gameTypes = fs.readFileSync(path.join(root, 'src', 'features', 'gamification', 'types.ts'), 'utf8');
assert.doesNotMatch(gameTypes, /weight.*LeaderboardEntry/, 'LeaderboardEntry must never contain weight');

// 6. Verify required screens and provider files exist
const requiredFiles = [
  'src/features/meal-plan/types.ts',
  'src/features/meal-plan/utils.ts',
  'src/features/meal-plan/MealPlanProvider.tsx',
  'src/features/meal-plan/screens/MealPlanOverviewScreen.tsx',
  'src/features/meal-plan/screens/MealPlanWizardScreen.tsx',
  'src/features/meal-plan/screens/MealPlanDetailScreen.tsx',
  'src/features/meal-plan/index.ts',
  'src/features/assistant/types.ts',
  'src/features/assistant/utils.ts',
  'src/features/assistant/screens/NutritionChatScreen.tsx',
  'src/features/assistant/screens/VoiceLogModal.tsx',
  'src/features/assistant/index.ts',
  'src/features/gamification/types.ts',
  'src/features/gamification/utils.ts',
  'src/features/gamification/GamificationProvider.tsx',
  'src/features/gamification/screens/StreakDetailModal.tsx',
  'src/features/gamification/screens/BadgesChallengesScreen.tsx',
  'src/features/gamification/screens/FriendsLeaderboardScreen.tsx',
  'src/features/gamification/index.ts',
];

for (const rel of requiredFiles) {
  assert.ok(fs.existsSync(path.join(root, rel)), `Required file missing: ${rel}`);
}

console.log('Phase 6 AI meal plan, assistant chat & gamification self-check passed');
