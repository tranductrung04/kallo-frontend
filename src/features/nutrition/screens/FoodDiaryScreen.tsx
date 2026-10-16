// ─── FoodDiaryScreen — Nocturne & Daylight Vitality ─────────────────────────
// DESIGN.md Phase 4:
//   canvasBase background, WeekCalendar (DateSelectorStrip), MealSection cards
//   20px horizontal margins, surfaceMid meal cards, brandPrimary date selection
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppText } from '@/components/common';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useNutrition } from '../NutritionProvider';
import { CalorieSummaryCard, MealSection, WaterTrackerCard, WeekCalendar, WeightTrackerCard } from '../components';
import { MEAL_SLOTS } from '../types';
import { offsetDate } from '../utils';

type Props = BottomTabScreenProps<MainTabParamList, 'Diary'>;
type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export function FoodDiaryScreen({ navigation }: Props) {
  const theme = useTheme();
  const { state, foods, getSummary, getLogs, addWater, addWeight, setSelectedDate, deleteFoodLog, copyMeal } = useNutrition();
  const root = navigation.getParent() as RootNavigation | undefined;
  const date = state.selectedDate;
  const summary = getSummary(date);
  const hasLogs = getLogs(date).length > 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* ── Screen Header ──────────────────────────────────────────── */}
        <View style={styles.screenHeader}>
          <AppText variant="headlineMd">Nhật ký dinh dưỡng</AppText>
          <AppText variant="bodySm" color={theme.colors.textSecondary}>
            Theo dõi từng bữa ăn của bạn
          </AppText>
        </View>

        {/* ── Date Selector Strip ────────────────────────────────────── */}
        <WeekCalendar date={date} onChange={setSelectedDate} />

        {/* ── AI Meal Plan Shortcut ─────────────────────────────────── */}
        <View style={styles.aiBannerRow}>
          <AppButton
            label="✨ Xem Gợi ý Thực đơn AI hôm nay"
            variant="secondary"
            onPress={() => root?.navigate('MealPlanOverview')}
            accessibilityLabel="Mở gợi ý thực đơn AI"
          />
        </View>

        {/* ── Empty State (first time) ───────────────────────────────── */}
        {!hasLogs ? (
          <AppCard style={styles.intro}>
            <Image
              source={images.foodDiaryIntroduce}
              style={styles.introImage}
              resizeMode="contain"
              accessibilityLabel="Minh họa nhật ký dinh dưỡng"
            />
            <AppText variant="headlineSm" align="center">Bắt đầu ghi nhật ký</AppText>
            <AppText variant="bodySm" color={theme.colors.textSecondary} align="center">
              Thêm món ăn vào từng bữa để theo dõi calo và macro.
            </AppText>
          </AppCard>
        ) : null}

        {/* ── Daily Calorie Summary ──────────────────────────────────── */}
        <CalorieSummaryCard summary={summary} />

        {/* ── Meal Sections: Sáng / Trưa / Tối / Bữa phụ ────────────── */}
        {MEAL_SLOTS.map((meal) => (
          <MealSection
            key={meal.key}
            meal={meal}
            logs={getLogs(date, meal.key)}
            foods={foods}
            onAdd={() => root?.navigate('FoodSearch', { date, meal: meal.key })}
            onDelete={deleteFoodLog}
            onEdit={(log) => root?.navigate('FoodDetail', {
              foodId: log.foodId,
              date,
              meal: log.meal,
              logId: log.id,
              source: log.source,
            })}
            onCopy={() => copyMeal(offsetDate(date, -1), date, meal.key)}
          />
        ))}

        {/* ── Water & Weight Trackers ────────────────────────────────── */}
        <WaterTrackerCard
          amountMl={summary.waterMl}
          goalMl={summary.waterGoalMl}
          onAdd={(amount) => addWater(date, amount)}
        />
        <WeightTrackerCard
          weightKg={summary.weightKg}
          targetKg={summary.targetWeightKg}
          onSave={(weight) => addWeight(date, weight)}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16, gap: 16, paddingBottom: 32 },
  screenHeader: { gap: 2 },
  intro: { gap: 10, alignItems: 'center' },
  introImage: { width: '100%', height: 130 },
  aiBannerRow: { marginVertical: 2 },
});
