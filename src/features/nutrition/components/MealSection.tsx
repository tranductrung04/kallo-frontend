// ─── MealSection — Nocturne & Daylight Vitality ───────────────────────────────
// DESIGN.md: "Food Log List Items" + meal group card
//   Card: surfaceMid Level 1, surfaceBorder
//   Food items: FoodLogListItem component (surfaceHigh)
//   Section header: headlineSm meal name, bodySm calorie count
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppButton, AppCard, AppText } from '@/components/common';
import { useTheme } from '@/theme';
import { formatNumber, scaleNutrition } from '../utils';
import type { Food, FoodLog, MealSlot } from '../types';

export function MealSection({
  meal,
  logs,
  foods,
  onAdd,
  onDelete,
  onEdit,
  onCopy,
}: {
  meal: { key: MealSlot; label: string };
  logs: FoodLog[];
  foods: Food[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onEdit: (log: FoodLog) => void;
  onCopy: () => void;
}) {
  const theme = useTheme();

  const calories = logs.reduce((sum, log) => {
    const food = foods.find((item) => item.id === log.foodId);
    return sum + (log.nutritionSnapshot?.calories ?? (food ? scaleNutrition(food, log.grams).calories : 0));
  }, 0);

  return (
    <AppCard style={styles.card} accessibilityLabel={`${meal.label}, ${logs.length} món`}>
      {/* Meal Header */}
      <View style={styles.header}>
        <View>
          <AppText variant="headlineSm">{meal.label}</AppText>
          <AppText variant="bodySm" color={theme.colors.textSecondary}>
            {formatNumber(calories)} kcal
          </AppText>
        </View>
        <View style={styles.headerActions}>
          <AppButton
            label="+ Thêm món"
            variant="secondary"
            onPress={onAdd}
            accessibilityLabel={`Thêm món vào ${meal.label}`}
          />
          <Pressable
            onPress={onCopy}
            accessibilityRole="button"
            accessibilityLabel={`Sao chép ${meal.label}`}
            style={styles.copy}
          >
            <AppText variant="bodySm" color={theme.colors.textSecondary}>Sao chép</AppText>
          </Pressable>
        </View>
      </View>

      {/* Food items or empty state */}
      {logs.length === 0 ? (
        <AppText variant="bodySm" color={theme.colors.textSecondary}>Chưa có món ăn</AppText>
      ) : (
        logs.map((log) => (
          <View
            key={log.id}
            style={[styles.foodRow, { borderTopColor: theme.colors.surfaceBorder }]}
          >
            <View style={styles.foodInfo}>
              <AppText variant="headlineSm" numberOfLines={1}>{log.foodName}</AppText>
              <AppText variant="bodySm" color={theme.colors.textSecondary}>
                {formatNumber(log.grams, 0)} g
              </AppText>
            </View>
            <View style={styles.foodActions}>
              <Pressable
                onPress={() => onEdit(log)}
                accessibilityRole="button"
                accessibilityLabel={`Sửa ${log.foodName}`}
                style={styles.actionBtn}
              >
                <AppText variant="labelMd" color={theme.colors.brandPrimary}>Sửa</AppText>
              </Pressable>
              <Pressable
                onPress={() => onDelete(log.id)}
                accessibilityRole="button"
                accessibilityLabel={`Xóa ${log.foodName}`}
                style={styles.actionBtn}
              >
                <AppText variant="labelMd" color={theme.colors.error}>Xóa</AppText>
              </Pressable>
            </View>
          </View>
        ))
      )}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  headerActions: { alignItems: 'flex-end', gap: 4 },
  copy: { minHeight: 36, justifyContent: 'center', paddingHorizontal: 4 },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
    gap: 10,
  },
  foodInfo: { flex: 1, gap: 2 },
  foodActions: { flexDirection: 'row', gap: 4 },
  actionBtn: { minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'flex-end' },
});
