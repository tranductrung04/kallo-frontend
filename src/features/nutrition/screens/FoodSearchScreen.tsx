import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppInput, AppText, EmptyStateView } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useNutrition } from '../NutritionProvider';
import { normalizeSearch } from '../utils';
import type { Food } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'FoodSearch'>;
type SearchTab = 'all' | 'recent' | 'mine';

export function FoodSearchScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { foods, state } = useNutrition();
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [tab, setTab] = useState<SearchTab>('all');
  useEffect(() => { const timer = setTimeout(() => setDebounced(query), 300); return () => clearTimeout(timer); }, [query]);
  const results = useMemo(() => {
    const term = normalizeSearch(debounced);
    return foods.filter((food) => (tab === 'mine' ? food.isCustom : tab === 'recent' ? state.recentFoodIds.includes(food.id) : true) && (!term || normalizeSearch(food.name).includes(term)));
  }, [debounced, foods, state.recentFoodIds, tab]);
  const openFood = (food: Food) => navigation.navigate('FoodDetail', { foodId: food.id, date: route.params.date, meal: route.params.meal });
  return <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}><ScrollView contentContainerStyle={styles.content}>
    <View><AppText variant="title">Tìm món ăn</AppText><AppText color={theme.colors.textMuted}>Tìm theo tên món, có hỗ trợ tìm không dấu</AppText></View>
    <AppInput value={query} onChangeText={setQuery} placeholder="Ví dụ: pho bo" autoFocus accessibilityLabel="Tìm kiếm món ăn" />
    <View style={styles.tabs}>{[['all', 'Tất cả'], ['recent', 'Gần đây'], ['mine', 'Món của tôi']].map(([key, label]) => <Pressable key={key} onPress={() => setTab(key as SearchTab)} accessibilityRole="tab" accessibilityState={{ selected: tab === key }} style={[styles.tab, { borderColor: tab === key ? theme.colors.primary : theme.colors.border, backgroundColor: tab === key ? theme.colors.primarySurface : theme.colors.surface }]}><AppText color={tab === key ? theme.colors.primaryPressed : theme.colors.text}>{label}</AppText></Pressable>)}</View>
    <AppButton label="+ Tạo món ăn tùy chỉnh" variant="outline" onPress={() => navigation.navigate('CustomFoodForm', { date: route.params.date, meal: route.params.meal })} accessibilityLabel="Tạo món ăn tùy chỉnh" />
    {results.length === 0 ? <EmptyStateView variant={tab === 'recent' ? 'favorite' : 'search'} title="Không tìm thấy món ăn" message="Thử từ khóa khác hoặc tạo món ăn của riêng bạn." /> : results.map((food) => <FoodRow key={food.id} food={food} onPress={() => openFood(food)} />)}
  </ScrollView></SafeAreaView>;
}
function FoodRow({ food, onPress }: { food: Food; onPress: () => void }) { const theme = useTheme(); return <AppCard onPress={onPress} accessibilityLabel={`Chọn món ${food.name}`} style={styles.food}><View style={styles.foodText}><AppText variant="bodyMedium">{food.name}</AppText><AppText variant="caption" color={theme.colors.textMuted}>{food.calories} kcal / 100 g · P {food.protein} g · C {food.carbs} g · F {food.fat} g</AppText></View><AppText color={theme.colors.primary}>›</AppText></AppCard>; }
const styles = StyleSheet.create({ safe: { flex: 1 }, content: { padding: 16, gap: 14, paddingBottom: 30 }, tabs: { flexDirection: 'row', gap: 8 }, tab: { minHeight: 44, borderWidth: 1, borderRadius: 22, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' }, food: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, foodText: { flex: 1, gap: 4 } });
