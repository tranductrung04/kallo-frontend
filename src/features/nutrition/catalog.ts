import type { Food } from './types';

export const starterFoods: Food[] = [
  { id: 'pho-bo', name: 'Phở bò', servingGrams: 450, calories: 90, protein: 5.2, carbs: 10.5, fat: 2.7, allergens: ['Gluten'] },
  { id: 'com-tam', name: 'Cơm tấm sườn', servingGrams: 350, calories: 180, protein: 7.5, carbs: 23, fat: 6.2, allergens: [] },
  { id: 'banh-mi', name: 'Bánh mì thịt', servingGrams: 180, calories: 260, protein: 10, carbs: 31, fat: 10, allergens: ['Gluten', 'Sữa'] },
  { id: 'bun-cha', name: 'Bún chả', servingGrams: 350, calories: 155, protein: 8.5, carbs: 15, fat: 6.5, allergens: ['Gluten'] },
  { id: 'ga-ran', name: 'Gà rán', servingGrams: 150, calories: 246, protein: 18, carbs: 8, fat: 16, allergens: ['Gluten'] },
  { id: 'trung-luoc', name: 'Trứng luộc', servingGrams: 50, calories: 155, protein: 13, carbs: 1.1, fat: 11, allergens: ['Trứng'] },
  { id: 'chuoi', name: 'Chuối', servingGrams: 100, calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, allergens: [] },
  { id: 'com-trang', name: 'Cơm trắng', servingGrams: 100, calories: 130, protein: 2.7, carbs: 28, fat: 0.3, allergens: [] },
];
