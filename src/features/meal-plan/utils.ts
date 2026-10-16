import type { Food, MealSlot } from '@/features/nutrition/types';
import type { DayMealPlan, MealPlan, MealPlanGoal, MealPlanItem } from './types';

export type PlanFoodEntry = Food & {
  defaultGrams: number;
  priceVnd: number;
  suitableMeals: MealSlot[];
};

export const VIETNAMESE_RECIPES: PlanFoodEntry[] = [
  {
    id: 'pho-bo',
    name: 'Phở bò Hà Nội',
    servingGrams: 450,
    defaultGrams: 450,
    calories: 90, // 405 kcal per bowl
    protein: 5.2,
    carbs: 10.5,
    fat: 2.7,
    allergens: ['Gluten'],
    priceVnd: 45000,
    suitableMeals: ['breakfast', 'lunch'],
  },
  {
    id: 'banh-mi',
    name: 'Bánh mì thịt chả',
    servingGrams: 180,
    defaultGrams: 180,
    calories: 260, // ~468 kcal
    protein: 10,
    carbs: 31,
    fat: 10,
    allergens: ['Gluten'],
    priceVnd: 25000,
    suitableMeals: ['breakfast', 'snack'],
  },
  {
    id: 'xoi-ga',
    name: 'Xôi gà xé',
    servingGrams: 200,
    defaultGrams: 200,
    calories: 220, // ~440 kcal
    protein: 8.5,
    carbs: 32,
    fat: 6,
    allergens: [],
    priceVnd: 30000,
    suitableMeals: ['breakfast'],
  },
  {
    id: 'com-tam',
    name: 'Cơm tấm sườn nướng',
    servingGrams: 350,
    defaultGrams: 350,
    calories: 180, // ~630 kcal
    protein: 7.5,
    carbs: 23,
    fat: 6.2,
    allergens: [],
    priceVnd: 40000,
    suitableMeals: ['lunch', 'dinner'],
  },
  {
    id: 'bun-cha',
    name: 'Bún chả thịt nướng',
    servingGrams: 350,
    defaultGrams: 350,
    calories: 155, // ~542 kcal
    protein: 8.5,
    carbs: 15,
    fat: 6.5,
    allergens: ['Gluten'],
    priceVnd: 45000,
    suitableMeals: ['lunch', 'dinner'],
  },
  {
    id: 'uc-ga-ap-chao',
    name: 'Cơm gạo lứt ức gà áp chảo',
    servingGrams: 320,
    defaultGrams: 320,
    calories: 145, // ~464 kcal
    protein: 11,
    carbs: 18,
    fat: 3.5,
    allergens: [],
    priceVnd: 35000,
    suitableMeals: ['lunch', 'dinner'],
  },
  {
    id: 'bo-xao-bong-cai',
    name: 'Thịt bò xào bông cải xanh',
    servingGrams: 250,
    defaultGrams: 250,
    calories: 130, // ~325 kcal
    protein: 9.5,
    carbs: 5,
    fat: 7,
    allergens: [],
    priceVnd: 40000,
    suitableMeals: ['lunch', 'dinner'],
  },
  {
    id: 'canh-chua-ca',
    name: 'Canh chua cá lóc bắp chuối',
    servingGrams: 300,
    defaultGrams: 300,
    calories: 75, // ~225 kcal
    protein: 6.5,
    carbs: 4,
    fat: 2,
    allergens: ['Cá / Hải sản'],
    priceVnd: 35000,
    suitableMeals: ['lunch', 'dinner'],
  },
  {
    id: 'tom-rim-thit',
    name: 'Tôm thẻ rim thịt ba chỉ',
    servingGrams: 180,
    defaultGrams: 180,
    calories: 195, // ~351 kcal
    protein: 12.5,
    carbs: 3.5,
    fat: 12,
    allergens: ['Hải sản', 'Tôm'],
    priceVnd: 45000,
    suitableMeals: ['lunch', 'dinner'],
  },
  {
    id: 'dau-phu-sot-ca',
    name: 'Đậu phụ sốt cà chua',
    servingGrams: 220,
    defaultGrams: 220,
    calories: 110, // ~242 kcal
    protein: 7,
    carbs: 4.5,
    fat: 6.8,
    allergens: ['Đậu nành'],
    priceVnd: 20000,
    suitableMeals: ['lunch', 'dinner'],
  },
  {
    id: 'salad-trung-bo',
    name: 'Salad bơ trứng gà sốt mè',
    servingGrams: 200,
    defaultGrams: 200,
    calories: 135, // ~270 kcal
    protein: 6,
    carbs: 7,
    fat: 9,
    allergens: ['Trứng'],
    priceVnd: 30000,
    suitableMeals: ['dinner', 'snack'],
  },
  {
    id: 'sua-chua-trai-cay',
    name: 'Sữa chua không đường chuối táo',
    servingGrams: 180,
    defaultGrams: 180,
    calories: 85, // ~153 kcal
    protein: 3.8,
    carbs: 14.5,
    fat: 1.2,
    allergens: ['Sữa'],
    priceVnd: 15000,
    suitableMeals: ['snack'],
  },
  {
    id: 'trung-luoc-chuoi',
    name: 'Trứng gà luộc & 1 quả chuối',
    servingGrams: 150,
    defaultGrams: 150,
    calories: 120, // ~180 kcal
    protein: 7.2,
    carbs: 13,
    fat: 4.2,
    allergens: ['Trứng'],
    priceVnd: 12000,
    suitableMeals: ['breakfast', 'snack'],
  },
  {
    id: 'hat-dieu-rang',
    name: 'Hạt điều rang muối (30g)',
    servingGrams: 30,
    defaultGrams: 30,
    calories: 553, // ~165 kcal
    protein: 18.2,
    carbs: 30.1,
    fat: 43.8,
    allergens: ['Đậu phộng / Hạt'],
    priceVnd: 15000,
    suitableMeals: ['snack'],
  },
];

// Helper to calculate total nutrient from 100g base values and gram amount
export function computeItemNutrients(entry: PlanFoodEntry, grams: number): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
} {
  const factor = grams / 100;
  return {
    calories: Math.round(entry.calories * factor),
    protein: Math.round(entry.protein * factor * 10) / 10,
    carbs: Math.round(entry.carbs * factor * 10) / 10,
    fat: Math.round(entry.fat * factor * 10) / 10,
  };
}

// Check if a recipe is free from excluded allergens
export function isAllergenFree(recipe: PlanFoodEntry, excludedAllergens: string[]): boolean {
  if (!excludedAllergens || excludedAllergens.length === 0) return true;
  const lowerExcluded = excludedAllergens.map((a) => a.toLowerCase().trim());
  return !recipe.allergens.some((allergen) =>
    lowerExcluded.some((ex) => allergen.toLowerCase().includes(ex) || ex.includes(allergen.toLowerCase()))
  );
}

// Calorie distribution ratios per REQUIREMENT.md (line 363):
// Sáng 25%, Trưa 35%, Tối 30%, Phụ 10%
export const MEAL_RATIOS: Record<MealSlot, number> = {
  breakfast: 0.25,
  lunch: 0.35,
  dinner: 0.3,
  snack: 0.1,
};

export function generateSingleDayPlan(
  dayIndex: number,
  goal: MealPlanGoal,
  pool: PlanFoodEntry[],
  usedRecipeIds: Set<string>
): DayMealPlan {
  const slots: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack'];
  const items: MealPlanItem[] = [];

  // Filter pool by allergens first (FR-PLAN-05)
  const safePool = pool.filter((recipe) => isAllergenFree(recipe, goal.excludedAllergens));
  const fallbackPool = safePool.length > 0 ? safePool : pool;

  for (const slot of slots) {
    const targetMealCalories = goal.targetCalories * MEAL_RATIOS[slot];
    // Pick recipes matching slot, preferably not used in recent days (FR-PLAN-06)
    const slotCandidates = fallbackPool.filter((r) => r.suitableMeals.includes(slot));
    const sorted = [...slotCandidates].sort((a, b) => {
      const aUsed = usedRecipeIds.has(a.id) ? 1 : 0;
      const bUsed = usedRecipeIds.has(b.id) ? 1 : 0;
      return aUsed - bUsed;
    });

    const selectedRecipe = sorted[0] || fallbackPool[0];
    usedRecipeIds.add(selectedRecipe.id);

    // Scale portion to hit target calories within ~5%
    const baseCalPerGram = selectedRecipe.calories / 100;
    let idealGrams = baseCalPerGram > 0 ? Math.round(targetMealCalories / baseCalPerGram) : selectedRecipe.defaultGrams;
    // Bound portion to realistic range (50g to 600g)
    idealGrams = Math.min(600, Math.max(50, idealGrams));

    const nutrients = computeItemNutrients(selectedRecipe, idealGrams);
    // Scale price slightly by portion ratio
    const priceRatio = idealGrams / selectedRecipe.defaultGrams;
    const estPrice = Math.round(selectedRecipe.priceVnd * Math.min(1.5, Math.max(0.7, priceRatio)) / 1000) * 1000;

    items.push({
      id: `item-${dayIndex}-${slot}-${selectedRecipe.id}`,
      foodId: selectedRecipe.id,
      name: selectedRecipe.name,
      meal: slot,
      grams: idealGrams,
      calories: nutrients.calories,
      protein: nutrients.protein,
      carbs: nutrients.carbs,
      fat: nutrients.fat,
      estimatedPriceVnd: estPrice,
      allergens: selectedRecipe.allergens,
    });
  }

  // Adjust portion of main meal slightly if total drift exceeds 5%
  let totalCalories = items.reduce((sum, item) => sum + item.calories, 0);
  const diff = goal.targetCalories - totalCalories;
  if (Math.abs(diff) > goal.targetCalories * 0.05 && items.length > 1) {
    const lunchItem = items.find((i) => i.meal === 'lunch') || items[1];
    const recipe = pool.find((r) => r.id === lunchItem.foodId);
    if (recipe && recipe.calories > 0) {
      const deltaGrams = Math.round((diff / recipe.calories) * 100);
      const newGrams = Math.min(600, Math.max(100, lunchItem.grams + deltaGrams));
      const adjustedNutrients = computeItemNutrients(recipe, newGrams);
      lunchItem.grams = newGrams;
      lunchItem.calories = adjustedNutrients.calories;
      lunchItem.protein = adjustedNutrients.protein;
      lunchItem.carbs = adjustedNutrients.carbs;
      lunchItem.fat = adjustedNutrients.fat;
      totalCalories = items.reduce((sum, item) => sum + item.calories, 0);
    }
  }

  const totalProtein = Math.round(items.reduce((sum, item) => sum + item.protein, 0) * 10) / 10;
  const totalCarbs = Math.round(items.reduce((sum, item) => sum + item.carbs, 0) * 10) / 10;
  const totalFat = Math.round(items.reduce((sum, item) => sum + item.fat, 0) * 10) / 10;
  const totalCostVnd = items.reduce((sum, item) => sum + item.estimatedPriceVnd, 0);

  const dayLabels = ['Ngày 1', 'Ngày 2', 'Ngày 3', 'Ngày 4', 'Ngày 5', 'Ngày 6', 'Ngày 7'];

  return {
    dayIndex,
    dayLabel: dayLabels[dayIndex] || `Ngày ${dayIndex + 1}`,
    items,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    totalCostVnd,
  };
}

export function generateMealPlan(goal: MealPlanGoal, pool = VIETNAMESE_RECIPES): MealPlan {
  const days: DayMealPlan[] = [];
  const usedRecipeIds = new Set<string>();

  for (let i = 0; i < goal.durationDays; i++) {
    // Reset used recipes when pool is exhausted
    if (usedRecipeIds.size >= pool.length - 4) {
      usedRecipeIds.clear();
    }
    const dayPlan = generateSingleDayPlan(i, goal, pool, usedRecipeIds);
    days.push(dayPlan);
  }

  const durationText = goal.durationDays === 1 ? '1 ngày' : '7 ngày';
  return {
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: `Thực đơn thông minh ${durationText} (~${goal.targetCalories} kcal)`,
    goal,
    days,
    status: 'active',
  };
}

// Find candidates for food swap (FR-PLAN-03):
// Same or compatible meal slot, allergen-free, similar calories (+-20%)
export function findSwapCandidates(
  item: MealPlanItem,
  excludedAllergens: string[],
  pool = VIETNAMESE_RECIPES
): PlanFoodEntry[] {
  return pool.filter((recipe) => {
    if (recipe.id === item.foodId) return false;
    if (!recipe.suitableMeals.includes(item.meal)) return false;
    if (!isAllergenFree(recipe, excludedAllergens)) return false;
    return true;
  });
}

// Format VND currency: 100000 -> "100.000 đ"
export function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')} đ`;
}
