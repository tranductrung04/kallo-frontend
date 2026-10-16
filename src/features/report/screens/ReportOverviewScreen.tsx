import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { AppCard, AppText } from '@/components/common';
import { useTheme } from '@/theme';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { formatNumber, todayKey } from '@/features/nutrition/utils';
import { useActivity } from '@/features/activity/ActivityProvider';
import {
  CalorieBarChart,
  MacroReportChart,
  PeriodSelector,
  WeightForecastCard,
  WeightTrendChart,
} from '../components';
import type { PeriodType } from '../types';
import {
  aggregatePeriodSummary,
  calculateMacroReport,
  calculateWeightTrendAndForecast,
  getPeriodDates,
} from '../utils';

export function ReportOverviewScreen() {
  const theme = useTheme();
  const { state: nutritionState, foods } = useNutrition();
  const { state: activityState } = useActivity();

  const [period, setPeriod] = useState<PeriodType>('week');
  const today = todayKey();

  // Aggregate period statistics
  const periodDates = useMemo(() => getPeriodDates(period, today), [period, today]);

  const summary = useMemo(
    () =>
      aggregatePeriodSummary(
        period,
        periodDates,
        nutritionState.foodLogs,
        activityState.activityLogs,
        activityState.syncLogs,
        nutritionState.waterLogs,
        nutritionState.weightLogs,
        foods,
        nutritionState.goals
      ),
    [
      period,
      periodDates,
      nutritionState.foodLogs,
      activityState.activityLogs,
      activityState.syncLogs,
      nutritionState.waterLogs,
      nutritionState.weightLogs,
      foods,
      nutritionState.goals,
    ]
  );

  const macroData = useMemo(
    () => calculateMacroReport(summary.days, nutritionState.goals),
    [summary.days, nutritionState.goals]
  );

  const { trendPoints, forecast } = useMemo(
    () =>
      calculateWeightTrendAndForecast(
        nutritionState.weightLogs,
        nutritionState.goals.targetWeightKg,
        today
      ),
    [nutritionState.weightLogs, nutritionState.goals.targetWeightKg, today]
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <AppText variant="title">Báo cáo & Thống kê</AppText>
          <AppText color={theme.colors.textMuted}>
            Tổng hợp tiến độ calo, macro, vận động và dự báo cân nặng
          </AppText>
        </View>

        {/* Period Selector: Ngày | Tuần | Tháng */}
        <PeriodSelector period={period} onChange={setPeriod} />

        {/* High-level Summary Metrics Cards */}
        <View style={styles.summaryGrid}>
          <AppCard style={styles.summaryCard}>
            <AppText variant="caption" color={theme.colors.textMuted}>
              Tổng Calo Nạp
            </AppText>
            <AppText variant="heading" color={theme.colors.calorieIn}>
              {formatNumber(summary.totalCaloriesIn)}
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              TB: {formatNumber(summary.avgCaloriesIn)} kcal/ngày
            </AppText>
          </AppCard>

          <AppCard style={styles.summaryCard}>
            <AppText variant="caption" color={theme.colors.textMuted}>
              Tổng Tiêu hao
            </AppText>
            <AppText variant="heading" color={theme.colors.calorieBurned}>
              {formatNumber(summary.totalCaloriesBurned)}
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              TB: {formatNumber(summary.avgCaloriesBurned)} kcal/ngày
            </AppText>
          </AppCard>

          <AppCard style={styles.summaryCard}>
            <AppText variant="caption" color={theme.colors.textMuted}>
              Nước uống TB
            </AppText>
            <AppText variant="heading" color={theme.colors.water}>
              {formatNumber(summary.avgWaterMl)} ml
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              Mục tiêu: {formatNumber(nutritionState.goals.waterMl)} ml
            </AppText>
          </AppCard>

          <AppCard style={styles.summaryCard}>
            <AppText variant="caption" color={theme.colors.textMuted}>
              Bước chân TB
            </AppText>
            <AppText variant="heading" color={theme.colors.primary}>
              {formatNumber(summary.avgSteps)}
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              bước/ngày
            </AppText>
          </AppCard>
        </View>

        {/* Calorie In vs Burned Grouped Bar Chart */}
        <CalorieBarChart
          days={summary.days}
          targetCalories={nutritionState.goals.calories}
        />

        {/* Macro Distribution Donut Chart */}
        <MacroReportChart macroData={macroData} />

        {/* Weight Trend Line Chart */}
        <WeightTrendChart
          points={trendPoints}
          targetWeightKg={nutritionState.goals.targetWeightKg}
        />

        {/* AI Weight Forecast Card with Lamp Icon */}
        <WeightForecastCard forecast={forecast} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 36 },
  header: { gap: 4 },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    minWidth: '46%',
    padding: 12,
    gap: 4,
  },
});
