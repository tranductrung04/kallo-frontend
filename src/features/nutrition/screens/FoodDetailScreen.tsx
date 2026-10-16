import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppInput, AppText } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useNutrition } from '../NutritionProvider';
import { formatNumber, scaleNutrition } from '../utils';
import { MEAL_SLOTS, type MealSlot } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'FoodDetail'>;

export function FoodDetailScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { findFood, getLogs, addFoodLog, updateFoodLog } = useNutrition();
  const food = findFood(route.params.foodId);
  const existingLog = route.params.logId ? getLogs(route.params.date).find((log) => log.id === route.params.logId) : undefined;
  const [grams, setGrams] = useState(String(existingLog?.grams ?? food?.servingGrams ?? 100));
  const [meal, setMeal] = useState<MealSlot>(existingLog?.meal ?? route.params.meal ?? 'snack');
  const nutrition = useMemo(() => food ? scaleNutrition(food, Number(grams) || 0) : undefined, [food, grams]);
  const source = route.params.source ?? (food?.isCustom ? 'CUSTOM' : 'SEARCH');
  if (!food) return <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}><View style={styles.center}><AppText variant="title">Không tìm thấy món ăn</AppText><AppButton label="Quay lại" onPress={navigation.goBack} /></View></SafeAreaView>;
  return <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}><ScrollView contentContainerStyle={styles.content}>
    <View><AppText variant="title">{food.name}</AppText><AppText color={theme.colors.textMuted}>Thông tin dinh dưỡng theo khẩu phần</AppText></View>
    {food.allergens.length > 0 ? <AppCard style={[styles.warning, { backgroundColor: `${theme.colors.danger}18`, borderColor: theme.colors.danger }]}><AppText variant="bodyMedium" color={theme.colors.danger}>Có thể chứa: {food.allergens.join(', ')}</AppText><AppText variant="caption">Kiểm tra dị ứng trước khi lưu vào nhật ký.</AppText></AppCard> : null}
    <AppCard style={styles.card}><AppInput label="Khối lượng ăn (g)" value={grams} onChangeText={setGrams} keyboardType="decimal-pad" accessibilityLabel="Khối lượng món ăn" />{nutrition ? <View style={styles.metrics}>{[['Calo', `${formatNumber(nutrition.calories)} kcal`], ['Protein', `${formatNumber(nutrition.protein, 1)} g`], ['Carbs', `${formatNumber(nutrition.carbs, 1)} g`], ['Fat', `${formatNumber(nutrition.fat, 1)} g`]].map(([label, value]) => <View key={label} style={styles.metric}><AppText variant="caption" color={theme.colors.textMuted}>{label}</AppText><AppText variant="heading">{value}</AppText></View>)}</View> : null}</AppCard>
    <AppText variant="heading">Chọn buổi ăn</AppText><View style={styles.meals}>{MEAL_SLOTS.map((item) => <Pressable key={item.key} onPress={() => setMeal(item.key)} accessibilityRole="radio" accessibilityState={{ selected: meal === item.key }} style={[styles.meal, { borderColor: meal === item.key ? theme.colors.primary : theme.colors.border, backgroundColor: meal === item.key ? theme.colors.primarySurface : theme.colors.surface }]}><AppText color={meal === item.key ? theme.colors.primaryPressed : theme.colors.text}>{item.label}</AppText></Pressable>)}</View>
    <AppButton label={route.params.logId ? 'Cập nhật nhật ký' : 'Lưu vào nhật ký'} onPress={() => { if (route.params.logId) updateFoodLog(route.params.logId, { meal, grams: Number(grams) || food.servingGrams }); else addFoodLog({ date: route.params.date, meal, foodId: food.id, grams: Number(grams) || food.servingGrams, source }); navigation.pop(2); }} accessibilityLabel="Lưu bữa ăn vào nhật ký" />
    {food.isCustom ? <AppButton label="Sửa món tùy chỉnh" variant="ghost" onPress={() => navigation.navigate('CustomFoodForm', { foodId: food.id, date: route.params.date, meal })} /> : null}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1 }, content: { padding: 16, gap: 14, paddingBottom: 32 }, warning: { gap: 4 }, card: { gap: 14 }, metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, metric: { width: '45%', gap: 2 }, meals: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, meal: { minHeight: 44, borderWidth: 1, borderRadius: 22, paddingHorizontal: 14, justifyContent: 'center' }, center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 } });
