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

export type HealthProfilePayload = {
  gender: Gender;
  birthDate: string;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goalType: GoalType;
  targetWeightKg: number;
  weeklyRateKg: number;
  allergies: string[];
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
  macros: MacroPercentages;
};

export const COMMON_ALLERGIES = ['Hải sản', 'Đậu phộng', 'Sữa', 'Trứng', 'Gluten'];

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
