import type { Food, FoodLog, MealSlot, NutritionValues } from '../../types';
import { offsetDate, scaleNutrition, todayKey } from '../../utils';

export const BASE_HOURS = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
];

/** Ánh xạ khung giờ sang bữa ăn tương ứng */
export function getMealSlotForHour(hourStr: string): MealSlot {
  const hour = parseInt(hourStr.split(':')[0], 10);
  if (hour >= 5 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 15) return 'lunch';
  if (hour >= 15 && hour < 18) return 'snack';
  if (hour >= 18 && hour < 22) return 'dinner';
  return 'snack';
}

/** Tên hiển thị tiếng Việt của bữa ăn */
export function getMealSlotLabel(meal: MealSlot): string {
  switch (meal) {
    case 'breakfast': return 'Bữa sáng';
    case 'lunch': return 'Bữa trưa';
    case 'dinner': return 'Bữa tối';
    case 'snack': return 'Bữa phụ';
  }
}

/** Tiêu đề ngày hiển thị trên header (Hôm nay, Hôm qua, Ngày mai, hoặc ngày thường như "25 thg 10") */
export function getDateTitle(dateKey: string): string {
  const today = todayKey();
  if (dateKey === today) return 'Hôm nay';
  if (dateKey === offsetDate(today, -1)) return 'Hôm qua';
  if (dateKey === offsetDate(today, 1)) return 'Ngày mai';

  const d = new Date(`${dateKey}T12:00:00`);
  return `${d.getDate()} thg ${d.getMonth() + 1}`;
}

/** Tiêu đề ngày đầy đủ cho lịch mở rộng (ví dụ: "Hôm nay, 21 Tháng 10") */
export function getFullDateHeaderTitle(dateKey: string): string {
  const today = todayKey();
  const d = new Date(`${dateKey}T12:00:00`);
  const day = d.getDate();
  const month = d.getMonth() + 1;

  if (dateKey === today) return `Hôm nay, ${day} Tháng ${month}`;
  if (dateKey === offsetDate(today, -1)) return `Hôm qua, ${day} Tháng ${month}`;
  if (dateKey === offsetDate(today, 1)) return `Ngày mai, ${day} Tháng ${month}`;

  return `${day} Tháng ${month}`;
}


/** Lấy thông tin dinh dưỡng của một dòng nhật ký món ăn */
export function getLogNutrition(log: FoodLog, foods: Food[]): NutritionValues {
  if (log.nutritionSnapshot) return log.nutritionSnapshot;
  const food = foods.find((f) => f.id === log.foodId);
  if (food) return scaleNutrition(food, log.grams);
  return { calories: 0, protein: 0, carbs: 0, fat: 0 };
}
