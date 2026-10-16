import type { Food, FoodLog, MealSlot, NutritionSummary, NutritionValues, WeightLog } from './types';

export function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function dateLabel(date: string) {
  const value = new Date(`${date}T12:00:00`);
  return value.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' });
}

export function offsetDate(date: string, days: number) {
  const value = new Date(`${date}T12:00:00`);
  value.setDate(value.getDate() + days);
  return todayKey(value);
}

export function weekDates(centerDate: string) {
  const center = new Date(`${centerDate}T12:00:00`);
  const day = center.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return Array.from({ length: 7 }, (_, index) => {
    const value = new Date(center);
    value.setDate(center.getDate() + mondayOffset + index);
    return todayKey(value);
  });
}

export function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function scaleNutrition(food: Food, grams: number): NutritionValues {
  const ratio = Math.max(0, grams) / 100;
  return { calories: food.calories * ratio, protein: food.protein * ratio, carbs: food.carbs * ratio, fat: food.fat * ratio };
}

export function summarizeLogs(logs: FoodLog[], foods: Food[], waterMl: number, weightKg: number | undefined, goals: { calories: number; protein: number; carbs: number; fat: number; waterMl: number; targetWeightKg: number }, caloriesBurned = 0): NutritionSummary {
  const values = logs.reduce<NutritionValues>((total, log) => {
    const food = foods.find((item) => item.id === log.foodId);
    const nutrition = log.nutritionSnapshot ?? (food ? scaleNutrition(food, log.grams) : undefined);
    if (!nutrition) return total;
    return { calories: total.calories + nutrition.calories, protein: total.protein + nutrition.protein, carbs: total.carbs + nutrition.carbs, fat: total.fat + nutrition.fat };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  return { ...values, caloriesRemaining: Math.max(0, goals.calories - values.calories + caloriesBurned), waterMl, weightKg, targetWeightKg: goals.targetWeightKg, waterGoalMl: goals.waterMl, caloriesGoal: goals.calories, proteinGoal: goals.protein, carbsGoal: goals.carbs, fatGoal: goals.fat, caloriesBurned };
}

export function mealLabel(meal: MealSlot) {
  return { breakfast: 'Bữa sáng', lunch: 'Bữa trưa', dinner: 'Bữa tối', snack: 'Bữa phụ' }[meal];
}

export function isValidWaterAmount(value: number) { return Number.isFinite(value) && value > 0 && value <= 5000; }
export function isValidWeightLog(value: number) { return Number.isFinite(value) && value >= 20 && value <= 300; }

export function latestWeight(date: string, logs: WeightLog[]) {
  return logs.filter((log) => log.date <= date).sort((a, b) => b.date.localeCompare(a.date))[0]?.weightKg;
}

export function formatNumber(value: number, digits = 0) {
  return value.toLocaleString('vi-VN', { maximumFractionDigits: digits, minimumFractionDigits: digits });
}
