import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppInput, AppText } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useNutrition } from '../NutritionProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomFoodForm'>;

export function CustomFoodFormScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { findFood, saveCustomFood } = useNutrition();
  const existing = route.params.foodId ? findFood(route.params.foodId) : undefined;
  const [name, setName] = useState(existing?.name ?? '');
  const [grams, setGrams] = useState(String(existing?.servingGrams ?? 100));
  const [calories, setCalories] = useState(existing ? String(existing.calories) : '');
  const [protein, setProtein] = useState(existing ? String(existing.protein) : '');
  const [carbs, setCarbs] = useState(existing ? String(existing.carbs) : '');
  const [fat, setFat] = useState(existing ? String(existing.fat) : '');
  const [barcode, setBarcode] = useState(route.params.barcode ?? existing?.barcode ?? '');
  const [error, setError] = useState('');
  const save = () => {
    const values = { grams: Number(grams), calories: Number(calories), protein: Number(protein), carbs: Number(carbs), fat: Number(fat) };
    if (!name.trim()) return setError('Vui lòng nhập tên món ăn.');
    if (!Number.isFinite(values.grams) || values.grams <= 0 || values.grams > 5000) return setError('Khẩu phần phải lớn hơn 0 và không quá 5.000 g.');
    if (Object.values(values).slice(1).some((value) => !Number.isFinite(value) || value < 0)) return setError('Calo và macro phải là số không âm.');
    const id = saveCustomFood({ id: existing?.id, name: name.trim(), servingGrams: values.grams, calories: values.calories, protein: values.protein, carbs: values.carbs, fat: values.fat, allergens: [], barcode: barcode.trim() || undefined });
    setError('');
    navigation.replace('FoodDetail', { foodId: id, date: route.params.date, meal: route.params.meal });
  };
  return <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}><ScrollView contentContainerStyle={styles.content}>
    <View><AppText variant="title">{existing ? 'Sửa món ăn' : 'Tạo món ăn tùy chỉnh'}</AppText><AppText color={theme.colors.textMuted}>Nhập thông tin dinh dưỡng trên khẩu phần chuẩn.</AppText></View>
    <AppInput label="Tên món ăn" value={name} onChangeText={setName} placeholder="Ví dụ: Salad nhà làm" />
    <AppInput label="Khẩu phần chuẩn (g)" value={grams} onChangeText={setGrams} keyboardType="decimal-pad" />
    <AppInput label="Calo (kcal / 100 g)" value={calories} onChangeText={setCalories} keyboardType="decimal-pad" />
    <AppInput label="Protein (g / 100 g)" value={protein} onChangeText={setProtein} keyboardType="decimal-pad" />
    <AppInput label="Carbs (g / 100 g)" value={carbs} onChangeText={setCarbs} keyboardType="decimal-pad" />
    <AppInput label="Fat (g / 100 g)" value={fat} onChangeText={setFat} keyboardType="decimal-pad" />
    <AppInput label="Mã vạch (tuỳ chọn)" value={barcode} onChangeText={setBarcode} keyboardType="number-pad" placeholder="893..." />
    {error ? <AppText color={theme.colors.danger} accessibilityLiveRegion="polite">{error}</AppText> : null}
    <AppButton label="Lưu món ăn" onPress={save} accessibilityLabel="Lưu món ăn tùy chỉnh" />
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1 }, content: { padding: 16, gap: 14, paddingBottom: 32 } });
