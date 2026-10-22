import type { MealPlan, MealPlanGoal } from './types';
import { generateMealPlan, VIETNAMESE_RECIPES } from './utils';

export type CuratedPlan = {
  id: string;
  title: string;
  subtitle: string;
  category: 'all' | 'eat_clean' | 'muscle_gain' | 'weight_loss' | 'budget' | 'keto' | 'vegan';
  categoryLabel: string;
  tag: string;
  targetCalories: number;
  durationDays: 7;
  dailyBudgetVnd: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  sampleDishes: string[];
  goal: MealPlanGoal;
};

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
  {
    id: 'curated-eatclean-1500',
    title: 'Eat Clean Món Việt Dinh Dưỡng',
    subtitle: 'Cân bằng vi chất, thanh lọc cơ thể, dùng 100% nguyên liệu tươi sạch bản địa.',
    category: 'eat_clean',
    categoryLabel: 'Eat Clean',
    tag: 'Phổ biến nhất',
    targetCalories: 1500,
    durationDays: 7,
    dailyBudgetVnd: 85000,
    macros: { protein: 105, carbs: 165, fat: 42 },
    sampleDishes: ['Phở gà gạo lứt', 'Ức gà áp chảo sốt mè', 'Cá hồi măng tây', 'Sữa chua hạt chia'],
    goal: {
      durationDays: 7,
      targetCalories: 1500,
      proteinTarget: 105,
      carbsTarget: 165,
      fatTarget: 42,
      dailyBudgetVnd: 85000,
      excludedAllergens: [],
    },
  },
  {
    id: 'curated-muscle-2000',
    title: 'High-Protein Tăng Cơ & Cắt Nét',
    subtitle: 'Tối đa hóa tổng hợp cơ bắp cho người tập gym, tăng lượng đạm sạch nạc.',
    category: 'muscle_gain',
    categoryLabel: 'Tăng cơ',
    tag: 'Gymer & Thể thao',
    targetCalories: 2000,
    durationDays: 7,
    dailyBudgetVnd: 120000,
    macros: { protein: 150, carbs: 215, fat: 55 },
    sampleDishes: ['Bánh mì 2 trứng ốp la', 'Cơm bò xào bông cải', 'Bún chả nạc nướng', 'Chuối & whey protein'],
    goal: {
      durationDays: 7,
      targetCalories: 2000,
      proteinTarget: 150,
      carbsTarget: 215,
      fatTarget: 55,
      dailyBudgetVnd: 120000,
      excludedAllergens: [],
    },
  },
  {
    id: 'curated-deficit-1350',
    title: 'Giảm Mỡ Thâm Hụt Calo An Toàn',
    subtitle: 'Thâm hụt nhẹ nhàng ~400 kcal/ngày, kiểm soát đường huyết và no lâu.',
    category: 'weight_loss',
    categoryLabel: 'Giảm mỡ',
    tag: 'Thâm hụt calo',
    targetCalories: 1350,
    durationDays: 7,
    dailyBudgetVnd: 75000,
    macros: { protein: 98, carbs: 135, fat: 38 },
    sampleDishes: ['Cháo yến mạch ức gà', 'Bún gạo lứt xào bò nạc', 'Salad cá ngừ trứng luộc', 'Táo giòn hạnh nhân'],
    goal: {
      durationDays: 7,
      targetCalories: 1350,
      proteinTarget: 98,
      carbsTarget: 135,
      fatTarget: 38,
      dailyBudgetVnd: 75000,
      excludedAllergens: [],
    },
  },
  {
    id: 'curated-budget-1700',
    title: 'Thực Đơn Tiết Kiệm Dinh Dưỡng',
    subtitle: 'Tối ưu ngân sách cho sinh viên và người bận rộn, chỉ từ 55.000 đ/ngày.',
    category: 'budget',
    categoryLabel: 'Tiết kiệm',
    tag: 'Tối ưu ngân sách',
    targetCalories: 1700,
    durationDays: 7,
    dailyBudgetVnd: 55000,
    macros: { protein: 88, carbs: 230, fat: 48 },
    sampleDishes: ['Bánh mì trứng pate dưa chuột', 'Đậu hũ dồn thịt sốt cà', 'Thịt heo nạc luộc mắm gừng', 'Sữa đậu nành'],
    goal: {
      durationDays: 7,
      targetCalories: 1700,
      proteinTarget: 88,
      carbsTarget: 230,
      fatTarget: 48,
      dailyBudgetVnd: 55000,
      excludedAllergens: [],
    },
  },
  {
    id: 'curated-lowcarb-1600',
    title: 'Low-Carb / Keto Thuần Việt',
    subtitle: 'Cắt giảm tinh bột nhanh, tăng cường chất béo tốt và rau củ xanh đậm.',
    category: 'keto',
    categoryLabel: 'Low-Carb / Keto',
    tag: 'Đốt mỡ tự nhiên',
    targetCalories: 1600,
    durationDays: 7,
    dailyBudgetVnd: 105000,
    macros: { protein: 115, carbs: 35, fat: 110 },
    sampleDishes: ['Trứng cuộn nấm mộc nhĩ', 'Gà nướng muối ớt salad bơ', 'Bò xào cần tây tỏi tươi', 'Hạt mắc ca sấy'],
    goal: {
      durationDays: 7,
      targetCalories: 1600,
      proteinTarget: 115,
      carbsTarget: 35,
      fatTarget: 110,
      dailyBudgetVnd: 105000,
      excludedAllergens: [],
    },
  },
  {
    id: 'curated-vegan-1450',
    title: 'Thuần Chay Thanh Lọc Cơ Thể',
    subtitle: 'Đạm thực vật từ đậu hũ non, nấm và các loại hạt, nhẹ bụng và giàu chất xơ.',
    category: 'vegan',
    categoryLabel: 'Thuần chay',
    tag: 'Thuần chay xanh',
    targetCalories: 1450,
    durationDays: 7,
    dailyBudgetVnd: 60000,
    macros: { protein: 72, carbs: 210, fat: 38 },
    sampleDishes: ['Bún xào nấm đùi gà chay', 'Cơm lứt nấm kho tiêu', 'Chả giò chay áp chảo', 'Sữa hạt điều yến mạch'],
    goal: {
      durationDays: 7,
      targetCalories: 1450,
      proteinTarget: 72,
      carbsTarget: 210,
      fatTarget: 38,
      dailyBudgetVnd: 60000,
      excludedAllergens: ['Hải sản', 'Tôm'],
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
