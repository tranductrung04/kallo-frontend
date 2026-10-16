export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'high' | 'veryHigh';
export type GoalType = 'lose' | 'maintain' | 'gain';
export type MacroName = 'protein' | 'carbs' | 'fat';

export type MacroPercentages = Record<MacroName, number>;
export type MacroTargets = MacroPercentages & { proteinGrams: number; carbsGrams: number; fatGrams: number };

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

const activityFactors: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  veryHigh: 1.9,
};

export function isValidHeight(value: number) { return Number.isFinite(value) && value >= 100 && value <= 250; }
export function isValidWeight(value: number) { return Number.isFinite(value) && value >= 20 && value <= 300; }
export function isValidAge(value: number) { return Number.isInteger(value) && value >= 13 && value <= 120; }
export function isValidWeeklyRate(value: number) { return Number.isFinite(value) && value >= 0 && value <= 1; }

export function calculateBmi(weightKg: number, heightCm: number) {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}


export function bmiCategory(bmi: number) {
  if (bmi < 18.5) return 'Thiếu cân';
  if (bmi < 23) return 'Bình thường';
  if (bmi < 25) return 'Thừa cân';
  return 'Béo phì';
}

export function calculateBmr(gender: Gender, weightKg: number, heightCm: number, age: number) {
  return 10 * weightKg + 6.25 * heightCm - 5 * age + (gender === 'female' ? -161 : 5);
}

export function calculateTdee(bmr: number, activityLevel: ActivityLevel) { return bmr * activityFactors[activityLevel]; }

export function defaultMacroPercentages(goalType: GoalType): MacroPercentages {
  if (goalType === 'lose') return { protein: 30, carbs: 40, fat: 30 };
  if (goalType === 'gain') return { protein: 25, carbs: 50, fat: 25 };
  return { protein: 30, carbs: 45, fat: 25 };
}

export function normalizeMacroPercentages(percentages: MacroPercentages): MacroPercentages {
  const safe = {
    protein: Math.max(0, Number(percentages.protein) || 0),
    carbs: Math.max(0, Number(percentages.carbs) || 0),
    fat: Math.max(0, Number(percentages.fat) || 0),
  };
  const total = safe.protein + safe.carbs + safe.fat;
  if (!total) return { protein: 30, carbs: 40, fat: 30 };
  return { protein: safe.protein * 100 / total, carbs: safe.carbs * 100 / total, fat: safe.fat * 100 / total };
}

export function updateMacroPercentage(percentages: MacroPercentages, changed: MacroName, value: number): MacroPercentages {
  const nextValue = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
  const others = (Object.keys(percentages) as MacroName[]).filter((name) => name !== changed);
  const remaining = 100 - nextValue;
  const otherTotal = percentages[others[0]] + percentages[others[1]];
  if (!otherTotal) return { ...percentages, [changed]: nextValue, [others[0]]: remaining / 2, [others[1]]: remaining / 2 };
  return { ...percentages, [changed]: nextValue, [others[0]]: remaining * percentages[others[0]] / otherTotal, [others[1]]: remaining * percentages[others[1]] / otherTotal };
}

export function calculateMacroTargets(calories: number, percentages: MacroPercentages): MacroTargets {
  const normalized = normalizeMacroPercentages(percentages);
  return {
    ...normalized,
    proteinGrams: calories * normalized.protein / 100 / 4,
    carbsGrams: calories * normalized.carbs / 100 / 4,
    fatGrams: calories * normalized.fat / 100 / 9,
  };
}

export function calculateDailyCalorieGoal(tdee: number, bmr: number, gender: Gender, goalType: GoalType, weeklyRateKg: number) {
  const adjustment = Math.min(1000, Math.max(0, weeklyRateKg) * 7700 / 7);
  const minimum = Math.max(bmr, gender === 'female' ? 1200 : 1500);
  const raw = goalType === 'lose' ? tdee - adjustment : goalType === 'gain' ? tdee + adjustment : tdee;
  return Math.round(Math.max(minimum, raw));
}

export function hasUnsafeCalorieTarget(tdee: number, bmr: number, gender: Gender, goalType: GoalType, weeklyRateKg: number) {
  if (goalType !== 'lose') return false;
  const adjustment = Math.max(0, weeklyRateKg) * 7700 / 7;
  const minimum = Math.max(bmr, gender === 'female' ? 1200 : 1500);
  return adjustment > 1000 || tdee - adjustment < minimum;
}

export function calculateHealthProfile(input: {
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goalType: GoalType;
  weeklyRateKg: number;
  macroPercentages: MacroPercentages;
}) {
  const bmi = calculateBmi(input.weightKg, input.heightCm);
  const bmr = calculateBmr(input.gender, input.weightKg, input.heightCm, input.age);
  const tdee = calculateTdee(bmr, input.activityLevel);
  const dailyCalorieGoal = calculateDailyCalorieGoal(tdee, bmr, input.gender, input.goalType, input.weeklyRateKg);
  return { bmi, bmr, tdee, dailyCalorieGoal, macros: calculateMacroTargets(dailyCalorieGoal, input.macroPercentages), unsafe: hasUnsafeCalorieTarget(tdee, bmr, input.gender, input.goalType, input.weeklyRateKg) };
}
