export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'high' | 'veryHigh';
export type GoalType = 'lose' | 'maintain' | 'gain';
export type MacroName = 'protein' | 'carbs' | 'fat';

export type MacroPercentages = Record<MacroName, number>;
export type MacroTargets = MacroPercentages & {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
};

// ── Backend Enums (exact match with Spring Boot BE) ──────────────────────────
export type BackendGender = 'MALE' | 'FEMALE' | 'OTHER';
export type BackendActivityLevel =
  | 'SEDENTARY'
  | 'LIGHTLY_ACTIVE'
  | 'MODERATELY_ACTIVE'
  | 'VERY_ACTIVE'
  | 'EXTRA_ACTIVE';
export type BackendGoalType = 'LOSE_WEIGHT' | 'MAINTAIN_WEIGHT' | 'GAIN_WEIGHT';
export type BackendBmiCategory = 'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE';

// ── Bi-directional Mappers (FE UI <-> BE API) ───────────────────────────────
export function toBackendGender(gender?: Gender): BackendGender {
  switch (gender) {
    case 'male':
      return 'MALE';
    case 'female':
      return 'FEMALE';
    case 'other':
    default:
      return 'OTHER';
  }
}

export function fromBackendGender(gender?: BackendGender | string): Gender {
  switch (gender) {
    case 'MALE':
      return 'male';
    case 'FEMALE':
      return 'female';
    default:
      return 'other';
  }
}

export function toBackendActivityLevel(level?: ActivityLevel): BackendActivityLevel {
  switch (level) {
    case 'sedentary':
      return 'SEDENTARY';
    case 'light':
      return 'LIGHTLY_ACTIVE';
    case 'moderate':
      return 'MODERATELY_ACTIVE';
    case 'high':
      return 'VERY_ACTIVE';
    case 'veryHigh':
      return 'EXTRA_ACTIVE';
    default:
      return 'MODERATELY_ACTIVE';
  }
}

export function fromBackendActivityLevel(level?: BackendActivityLevel | string): ActivityLevel {
  switch (level) {
    case 'SEDENTARY':
      return 'sedentary';
    case 'LIGHTLY_ACTIVE':
      return 'light';
    case 'MODERATELY_ACTIVE':
      return 'moderate';
    case 'VERY_ACTIVE':
      return 'high';
    case 'EXTRA_ACTIVE':
      return 'veryHigh';
    default:
      return 'moderate';
  }
}

export function toBackendGoalType(goal?: GoalType): BackendGoalType {
  switch (goal) {
    case 'lose':
      return 'LOSE_WEIGHT';
    case 'gain':
      return 'GAIN_WEIGHT';
    case 'maintain':
    default:
      return 'MAINTAIN_WEIGHT';
  }
}

export function fromBackendGoalType(goal?: BackendGoalType | string): GoalType {
  switch (goal) {
    case 'LOSE_WEIGHT':
      return 'lose';
    case 'GAIN_WEIGHT':
      return 'gain';
    case 'MAINTAIN_WEIGHT':
    default:
      return 'maintain';
  }
}

// ── Backend API Request / Response Types ─────────────────────────────────────
export type HealthProfileRequestPayload = {
  gender: BackendGender;
  birthDate: string; // YYYY-MM-DD
  heightCm: number;
  weightKg: number;
  activityLevel: BackendActivityLevel;
  goalType: BackendGoalType;
  targetWeightKg?: number;
  weeklyRateKg?: number;
  customProteinPct?: number;
  customCarbsPct?: number;
  customFatPct?: number;
  customWaterGoalMl?: number;
  allergies?: string[];
};

export type HealthProfileResponse = {
  id: string;
  userId: string;
  gender: BackendGender;
  birthDate: string;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: BackendActivityLevel;
  goalType: BackendGoalType;
  targetWeightKg: number;
  weeklyRateKg: number;
  bmi: number;
  bmiCategory: BackendBmiCategory;
  bmiCategoryVi: string;
  bmr: number;
  tdee: number;
  dailyCalorieGoal: number;
  safetyClamped: boolean;
  proteinGoalG: number;
  carbsGoalG: number;
  fatGoalG: number;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
  customMacro: boolean;
  waterGoalMl: number;
  allergies: string[];
  recalculationRecommended: boolean;
  recommendedTdee?: number | null;
  recommendedDailyCalorieGoal?: number | null;
  latestLoggedWeightKg?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

// Kept for backward compatibility with local cache/drafts
export type HealthProfilePayload = {
  nickname?: string;
  gender: Gender;
  birthDate: string;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goalType: GoalType;
  targetWeightKg: number;
  weeklyRateKg: number;
  allergies: string[];
  dietaryPreference?: string;
  healthConditions?: string[];
  bmi: number;
  bmr: number;
  tdee: number;
  dailyCalorieGoal: number;
  proteinGoalGrams: number;
  carbsGoalGrams: number;
  fatGoalGrams: number;
  waterGoalMl: number;
};

export type HealthProfileCalculationResult = {
  bmi: number;
  bmr: number;
  tdee: number;
  dailyCalorieGoal: number;
  macros: MacroTargets;
  unsafe: boolean;
};

export type HealthProfileDraft = {
  nickname: string;
  dependent: string;
  gender: Gender;
  age: string;
  height: string;
  weight: string;
  activity: ActivityLevel;
  goal: GoalType;
  targetWeight: string;
  weeklyRate: string;
  allergies: string[];
  customAllergy: string;
  dietaryPreference: string;
  healthConditions: string[];
  macros: MacroPercentages;
};

export const COMMON_ALLERGIES = [
  'Hải sản',
  'Sữa & Chế phẩm sữa',
  'Đậu phộng & Hạt',
  'Trứng gà/vịt',
  'Gluten / Lúa mì',
  'Đậu nành',
];

export const ACTIVITY_OPTIONS: Array<[ActivityLevel, string]> = [
  ['sedentary', 'Ít vận động'],
  ['light', 'Nhẹ'],
  ['moderate', 'Vừa'],
  ['high', 'Nhiều'],
  ['veryHigh', 'Rất nhiều'],
];

export const GOAL_OPTIONS: Array<[GoalType, string]> = [
  ['lose', 'Giảm cân'],
  ['maintain', 'Giữ cân'],
  ['gain', 'Tăng cân'],
];
