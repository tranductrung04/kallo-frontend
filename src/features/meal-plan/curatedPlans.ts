import type { MealPlan, MealPlanGoal } from './types';
import { generateMealPlan, VIETNAMESE_RECIPES } from './utils';
import { images } from '@/assets/images';

export type CalorieRange = '< 2200 Cal' | '2200-2400 Cal' | '2400-2600 Cal' | '> 2600 Cal';

export type CuratedPlan = {
  id: string;
  title: string;
  subtitle: string;
  category: 'all' | 'eat_clean' | 'muscle_gain' | 'weight_loss' | 'budget' | 'keto' | 'vegan';
  categoryLabel: string;
  tag: string;
  calorieRange: CalorieRange;
  targetCalories: number;
  durationDays: 7;
  dailyBudgetVnd: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  sampleDishes: string[];
  coverImage?: any;
  goal: MealPlanGoal;
};

export const CALORIE_FILTER_TABS: CalorieRange[] = [
  '< 2200 Cal',
  '2200-2400 Cal',
  '2400-2600 Cal',
  '> 2600 Cal',
];

export const DIET_CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'eat_clean', label: 'Eat Clean' },
  { id: 'weight_loss', label: 'Giảm mỡ' },
  { id: 'muscle_gain', label: 'Tăng cơ' },
  { id: 'keto', label: 'Low-Carb / Keto' },
  { id: 'budget', label: 'Tiết kiệm' },
  { id: 'vegan', label: 'Thuần chay' },
] as const;

export const CURATED_MEAL_PLANS: CuratedPlan[] = [
  // ── 2400 - 2600 Cal (Featured in Mockup) ─────────────────────────────
  {
    id: 'curated-gym-2400-2600',
    title: 'Meal plan chuẩn gym: Tăng cơ, Giảm mỡ, Sống khỏe',
    subtitle: '2400 - 2600 cal / ngày',
    category: 'muscle_gain',
    categoryLabel: 'Tăng cơ',
    tag: 'Chuẩn Gym',
    calorieRange: '2400-2600 Cal',
    targetCalories: 2500,
    durationDays: 7,
    dailyBudgetVnd: 135000,
    macros: { protein: 165, carbs: 275, fat: 68 },
    sampleDishes: ['Bò bít tết khoai lang', 'Bún chả nạc nướng', 'Salad ức gà áp chảo', 'Yến mạch chuối hạt chia'],
    coverImage: images.mealPlanCardSample,
    goal: {
      durationDays: 7,
      targetCalories: 2500,
      proteinTarget: 165,
      carbsTarget: 275,
      fatTarget: 68,
      dailyBudgetVnd: 135000,
      excludedAllergens: [],
    },
  },
  {
    id: 'curated-athlete-2550',
    title: 'Năng Lượng Đỉnh Cao Cho Vận Động Thể Thao',
    subtitle: '2450 - 2600 cal / ngày',
    category: 'muscle_gain',
    categoryLabel: 'Thể thao',
    tag: 'Vận động viên',
    calorieRange: '2400-2600 Cal',
    targetCalories: 2550,
    durationDays: 7,
    dailyBudgetVnd: 140000,
    macros: { protein: 170, carbs: 290, fat: 70 },
    sampleDishes: ['Cơm gạo lứt thịt bò xào', 'Phở bò tái nạm', 'Cá hồi áp chảo bơ tỏi', 'Sinh tố bơ hạt chia'],
    coverImage: images.mealPlanCardSample,
    goal: {
      durationDays: 7,
      targetCalories: 2550,
      proteinTarget: 170,
      carbsTarget: 290,
      fatTarget: 70,
      dailyBudgetVnd: 140000,
      excludedAllergens: [],
    },
  },

  // ── 2200 - 2400 Cal ───────────────────────────────────────────────────
  {
    id: 'curated-muscle-2300',
    title: 'High-Protein Clean Bulking: Tăng Cơ Nạc Món Việt',
    subtitle: '2200 - 2400 cal / ngày',
    category: 'muscle_gain',
    categoryLabel: 'Tăng cơ',
    tag: 'Clean Bulk',
    calorieRange: '2200-2400 Cal',
    targetCalories: 2300,
    durationDays: 7,
    dailyBudgetVnd: 125000,
    macros: { protein: 155, carbs: 245, fat: 62 },
    sampleDishes: ['Bánh mì nguyên cám 2 trứng ốp la', 'Cơm bò xào bông cải', 'Bún chả nạc nướng', 'Chuối tiêu sữa chua'],
    coverImage: images.mealPlanCardSample,
    goal: {
      durationDays: 7,
      targetCalories: 2300,
      proteinTarget: 155,
      carbsTarget: 245,
      fatTarget: 62,
      dailyBudgetVnd: 125000,
      excludedAllergens: [],
    },
  },
  {
    id: 'curated-endurance-2250',
    title: 'Eat Clean Duy Trì Thể Lực & Sức Bền',
    subtitle: '2200 - 2350 cal / ngày',
    category: 'eat_clean',
    categoryLabel: 'Eat Clean',
    tag: 'Sức bền',
    calorieRange: '2200-2400 Cal',
    targetCalories: 2250,
    durationDays: 7,
    dailyBudgetVnd: 110000,
    macros: { protein: 140, carbs: 260, fat: 58 },
    sampleDishes: ['Phở gà đùi nạc', 'Cơm lứt cá thu kho thơm', 'Canh sườn hầm rau củ', 'Sữa hạt sen đậu đen'],
    coverImage: images.mealPlanCardSample,
    goal: {
      durationDays: 7,
      targetCalories: 2250,
      proteinTarget: 140,
      carbsTarget: 260,
      fatTarget: 58,
      dailyBudgetVnd: 110000,
      excludedAllergens: [],
    },
  },

  // ── < 2200 Cal ────────────────────────────────────────────────────────
  {
    id: 'curated-eatclean-1600',
    title: 'Eat Clean Món Việt Giảm Mỡ Thâm Hụt',
    subtitle: '1600 - 1800 cal / ngày',
    category: 'eat_clean',
    categoryLabel: 'Eat Clean',
    tag: 'Phổ biến nhất',
    calorieRange: '< 2200 Cal',
    targetCalories: 1700,
    durationDays: 7,
    dailyBudgetVnd: 85000,
    macros: { protein: 110, carbs: 185, fat: 45 },
    sampleDishes: ['Phở gà gạo lứt', 'Ức gà áp chảo sốt mè', 'Cá hồi măng tây', 'Sữa chua hạt chia'],
    coverImage: images.mealPlanCardSample,
    goal: {
      durationDays: 7,
      targetCalories: 1700,
      proteinTarget: 110,
      carbsTarget: 185,
      fatTarget: 45,
      dailyBudgetVnd: 85000,
      excludedAllergens: [],
    },
  },
  {
    id: 'curated-deficit-1400',
    title: 'Giảm Mỡ Thâm Hụt Calo An Toàn',
    subtitle: '1400 - 1600 cal / ngày',
    category: 'weight_loss',
    categoryLabel: 'Giảm mỡ',
    tag: 'Thâm hụt calo',
    calorieRange: '< 2200 Cal',
    targetCalories: 1500,
    durationDays: 7,
    dailyBudgetVnd: 75000,
    macros: { protein: 105, carbs: 150, fat: 40 },
    sampleDishes: ['Cháo yến mạch ức gà', 'Bún gạo lứt xào bò nạc', 'Salad cá ngừ trứng luộc', 'Táo giòn hạnh nhân'],
    coverImage: images.mealPlanCardSample,
    goal: {
      durationDays: 7,
      targetCalories: 1500,
      proteinTarget: 105,
      carbsTarget: 150,
      fatTarget: 40,
      dailyBudgetVnd: 75000,
      excludedAllergens: [],
    },
  },
  {
    id: 'curated-budget-1800',
    title: 'Thực Đơn Sinh Viên Tiết Kiệm Chuẩn Calo',
    subtitle: '1700 - 1900 cal / ngày',
    category: 'budget',
    categoryLabel: 'Tiết kiệm',
    tag: 'Tối ưu ngân sách',
    calorieRange: '< 2200 Cal',
    targetCalories: 1800,
    durationDays: 7,
    dailyBudgetVnd: 55000,
    macros: { protein: 95, carbs: 240, fat: 50 },
    sampleDishes: ['Bánh mì trứng pate dưa chuột', 'Đậu hũ dồn thịt sốt cà', 'Thịt heo nạc luộc mắm gừng', 'Sữa đậu nành'],
    coverImage: images.mealPlanCardSample,
    goal: {
      durationDays: 7,
      targetCalories: 1800,
      proteinTarget: 95,
      carbsTarget: 240,
      fatTarget: 50,
      dailyBudgetVnd: 55000,
      excludedAllergens: [],
    },
  },

  // ── > 2600 Cal ────────────────────────────────────────────────────────
  {
    id: 'curated-heavy-lifter-2800',
    title: 'Thực Đơn Tăng Cân & Sức Mạnh Nâng Cao',
    subtitle: '2650 - 2850 cal / ngày',
    category: 'muscle_gain',
    categoryLabel: 'Tăng khối',
    tag: 'Sức mạnh nâng cao',
    calorieRange: '> 2600 Cal',
    targetCalories: 2750,
    durationDays: 7,
    dailyBudgetVnd: 150000,
    macros: { protein: 185, carbs: 320, fat: 80 },
    sampleDishes: ['Cơm sườn nạc trứng ốp la', 'Bò sốt tiêu đen khoai tây', 'Gà nướng ngũ vị', 'Sữa hạt dinh dưỡng'],
    coverImage: images.mealPlanCardSample,
    goal: {
      durationDays: 7,
      targetCalories: 2750,
      proteinTarget: 185,
      carbsTarget: 320,
      fatTarget: 80,
      dailyBudgetVnd: 150000,
      excludedAllergens: [],
    },
  },
];

export function buildMealPlanFromCurated(curated: CuratedPlan): MealPlan {
  const plan = generateMealPlan(curated.goal, VIETNAMESE_RECIPES);
  return {
    ...plan,
    id: `plan-${curated.id}-${Date.now()}`,
    title: curated.title,
    status: 'active',
  };
}
