import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppInput, AppText, useAlert } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useNutrition } from '../NutritionProvider';
import { formatNumber, scaleNutrition } from '../utils';
import { MEAL_SLOTS, type Food, type MealSlot } from '../types';
import { FOOD_CATEGORY_LABELS } from '../foodTypes';

type Props = NativeStackScreenProps<RootStackParamList, 'FoodDetail'>;

export function FoodDetailScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { showAlert } = useAlert();
  const {
    findFood,
    fetchFoodDetail,
    getLogs,
    addFoodLog,
    updateFoodLog,
    deleteCustomFoodAsync,
  } = useNutrition();

  const cachedFood = findFood(route.params.foodId);
  const [food, setFood] = useState<Food | undefined>(cachedFood);
  const [loading, setLoading] = useState(!cachedFood);

  const existingLog = route.params.logId
    ? getLogs(route.params.date).find((log) => log.id === route.params.logId)
    : undefined;

  const [grams, setGrams] = useState(
    String(existingLog?.grams ?? cachedFood?.servingGrams ?? 100)
  );
  const [meal, setMeal] = useState<MealSlot>(
    existingLog?.meal ?? route.params.meal ?? 'snack'
  );

  // Fetch full food detail from backend if needed
  useEffect(() => {
    if (!food || !food.ingredients || food.ingredients.length === 0) {
      fetchFoodDetail(route.params.foodId).then((fetched) => {
        if (fetched) {
          setFood(fetched);
          if (!existingLog && (!cachedFood || !cachedFood.servingGrams)) {
            setGrams(String(fetched.servingGrams || 100));
          }
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [route.params.foodId, fetchFoodDetail, existingLog, cachedFood, food]);

  const nutrition = useMemo(() => {
    if (!food) return undefined;
    const g = Number(grams) || 0;
    const base = scaleNutrition(food, g);
    const ratio = Math.max(0, g) / 100;
    const sugar = (food.sugarPer100g ?? food.sugar ?? 0) * ratio;
    const fiber = (food.fiberPer100g ?? food.fiber ?? 0) * ratio;
    return { ...base, sugar, fiber };
  }, [food, grams]);

  const source = route.params.source ?? (food?.isCustom ? 'CUSTOM' : 'SEARCH');

  const handleDeleteCustomFood = () => {
    if (!food?.id) return;
    showAlert({
      title: 'Xóa món ăn',
      message: `Bạn có chắc muốn xóa món "${food.name}" khỏi danh sách món cá nhân?`,
      variant: 'warning',
      buttons: [
        { text: 'Hủy', variant: 'secondary' },
        {
          text: 'Xóa',
          variant: 'primary',
          onPress: async () => {
            try {
              await deleteCustomFoodAsync(food.id);
              showAlert({
                title: 'Thành công',
                message: 'Đã xóa món ăn khỏi danh mục.',
                variant: 'success',
                buttons: [{ text: 'OK', onPress: () => navigation.goBack() }],
              });
            } catch {
              showAlert({
                title: 'Lỗi',
                message: 'Không thể xóa món ăn này.',
                variant: 'error',
              });
            }
          },
        },
      ],
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <AppText color={theme.colors.textMuted}>Đang tải chi tiết món ăn...</AppText>
        </View>
      </SafeAreaView>
    );
  }

  if (!food) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
        <View style={styles.center}>
          <AppText variant="title">Không tìm thấy món ăn</AppText>
          <AppButton label="Quay lại" onPress={navigation.goBack} />
        </View>
      </SafeAreaView>
    );
  }

  const categoryLabel = food.category ? FOOD_CATEGORY_LABELS[food.category] : undefined;
  const sourceLabel =
    food.source === 'SYSTEM'
      ? 'Chuẩn hệ thống'
      : food.source === 'OFF'
      ? 'Open Food Facts'
      : food.isCustom
      ? 'Món tự tạo'
      : undefined;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Title & Badges */}
        <View style={styles.headerBlock}>
          <View style={styles.badgeRow}>
            {sourceLabel && (
              <View style={[styles.badge, { backgroundColor: `${theme.colors.primary}20` }]}>
                <AppText variant="caption" color={theme.colors.primary}>
                  {sourceLabel}
                </AppText>
              </View>
            )}
            {categoryLabel && (
              <View style={[styles.badge, { backgroundColor: `${theme.colors.border}` }]}>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  {categoryLabel}
                </AppText>
              </View>
            )}
            {food.isVerified && (
              <View style={[styles.badge, { backgroundColor: '#10B98120' }]}>
                <AppText variant="caption" color="#10B981">
                  ✓ Đã kiểm chứng
                </AppText>
              </View>
            )}
          </View>
          <AppText variant="title">{food.name}</AppText>
          {food.defaultServingName ? (
            <AppText color={theme.colors.textMuted}>
              Khẩu phần mặc định: {food.defaultServingName} ({food.servingGrams}g)
            </AppText>
          ) : (
            <AppText color={theme.colors.textMuted}>Thông tin dinh dưỡng theo khẩu phần</AppText>
          )}
        </View>

        {/* Allergen Warning */}
        {food.allergens && food.allergens.length > 0 && (
          <AppCard
            style={[
              styles.warning,
              { backgroundColor: `${theme.colors.danger}18`, borderColor: theme.colors.danger },
            ]}
          >
            <AppText variant="bodyMedium" color={theme.colors.danger}>
              ⚠️ Có thể chứa: {food.allergens.join(', ')}
            </AppText>
            <AppText variant="caption">Kiểm tra dị ứng trước khi lưu vào nhật ký.</AppText>
          </AppCard>
        )}

        {/* Nutrition Scaling Card */}
        <AppCard style={styles.card}>
          <AppInput
            label="Khối lượng ăn (g)"
            value={grams}
            onChangeText={setGrams}
            keyboardType="decimal-pad"
            accessibilityLabel="Khối lượng món ăn"
          />
          {nutrition && (
            <View style={styles.metrics}>
              {[
                ['Calo', `${formatNumber(nutrition.calories)} kcal`],
                ['Protein', `${formatNumber(nutrition.protein, 1)} g`],
                ['Carbs', `${formatNumber(nutrition.carbs, 1)} g`],
                ['Fat', `${formatNumber(nutrition.fat, 1)} g`],
                ['Đường', `${formatNumber(nutrition.sugar, 1)} g`],
                ['Chất xơ', `${formatNumber(nutrition.fiber, 1)} g`],
              ].map(([label, value]) => (
                <View key={label} style={styles.metric}>
                  <AppText variant="caption" color={theme.colors.textMuted}>
                    {label}
                  </AppText>
                  <AppText variant="heading">{value}</AppText>
                </View>
              ))}
            </View>
          )}
        </AppCard>

        {/* Ingredients breakdown (if available) */}
        {food.ingredients && food.ingredients.length > 0 && (
          <AppCard style={styles.ingredientsCard}>
            <AppText variant="heading">Nguyên liệu thành phần</AppText>
            <View style={styles.ingredientsList}>
              {food.ingredients.map((item, idx) => (
                <View key={item.ingredientId || String(idx)} style={styles.ingredientRow}>
                  <AppText variant="bodyMedium">
                    • {item.ingredientName}
                    {item.isAllergen ? ' ⚠️ (Dị ứng)' : ''}
                  </AppText>
                  {item.quantityGrams ? (
                    <AppText color={theme.colors.textMuted}>{item.quantityGrams}g</AppText>
                  ) : null}
                </View>
              ))}
            </View>
          </AppCard>
        )}

        {/* Meal slot selection */}
        <AppText variant="heading">Chọn buổi ăn</AppText>
        <View style={styles.meals}>
          {MEAL_SLOTS.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setMeal(item.key)}
              accessibilityRole="radio"
              accessibilityState={{ selected: meal === item.key }}
              style={[
                styles.meal,
                {
                  borderColor: meal === item.key ? theme.colors.primary : theme.colors.border,
                  backgroundColor:
                    meal === item.key ? theme.colors.primarySurface : theme.colors.surface,
                },
              ]}
            >
              <AppText
                color={meal === item.key ? theme.colors.primaryPressed : theme.colors.text}
              >
                {item.label}
              </AppText>
            </Pressable>
          ))}
        </View>

        {/* Save button */}
        <AppButton
          label={route.params.logId ? 'Cập nhật nhật ký' : 'Lưu vào nhật ký'}
          onPress={() => {
            const finalGrams = Number(grams) || food.servingGrams || 100;
            if (route.params.logId) {
              updateFoodLog(route.params.logId, { meal, grams: finalGrams });
            } else {
              addFoodLog({
                date: route.params.date,
                meal,
                foodId: food.id,
                grams: finalGrams,
                source,
              });
            }
            navigation.pop(2);
          }}
          accessibilityLabel="Lưu bữa ăn vào nhật ký"
        />

        {/* Custom food options: Edit / Delete */}
        {food.isCustom && (
          <View style={styles.customActions}>
            <AppButton
              label="Sửa món tùy chỉnh"
              variant="ghost"
              onPress={() =>
                navigation.navigate('CustomFoodForm', {
                  foodId: food.id,
                  date: route.params.date,
                  meal,
                })
              }
            />
            <AppButton
              label="Xóa món tùy chỉnh"
              variant="ghost"
              onPress={handleDeleteCustomFood}
              style={{ borderColor: theme.colors.danger }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, gap: 14, paddingBottom: 32 },
  headerBlock: { gap: 6 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  warning: { gap: 4 },
  card: { gap: 14 },
  ingredientsCard: { gap: 10 },
  ingredientsList: { gap: 6 },
  ingredientRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metric: { width: '45%', gap: 2 },
  meals: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  meal: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  customActions: { gap: 8, marginTop: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
});
