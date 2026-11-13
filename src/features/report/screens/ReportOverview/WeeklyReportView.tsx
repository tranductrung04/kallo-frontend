import React from 'react';
import { Text, View } from 'react-native';
import { formatNumber } from '@/features/nutrition/utils';
import {
  CalorieBarChart,
  MacroReportChart,
  WeightForecastCard,
  WeightTrendChart,
} from '../../components';
import type {
  MacroReportData,
  PeriodSummary,
  WeightForecast,
  WeightTrendPoint,
} from '../../types';
import { useReportStyles } from './ReportOverviewScreen.styles';

export type WeeklyReportViewProps = {
  weekSummary: PeriodSummary;
  weekMacroData: MacroReportData;
  trendPoints: WeightTrendPoint[];
  forecast: WeightForecast;
  waterGoal: number;
  caloriesGoal: number;
  targetWeightKg: number;
};

export function WeeklyReportView({
  weekSummary,
  weekMacroData,
  trendPoints,
  forecast,
  waterGoal,
  caloriesGoal,
  targetWeightKg,
}: WeeklyReportViewProps) {
  const { theme, styles } = useReportStyles();

  return (
    <View style={styles.weeklyContainer}>
      {/* High-level Summary Metrics Cards */}
      <View style={styles.weeklySummaryGrid}>
        <View style={styles.weeklySummaryCard}>
          <Text style={styles.weeklyCardLabel}>Tổng Calo Nạp</Text>
          <Text style={[styles.weeklyCardValue, { color: theme.colors.brandPrimary }]}>
            {formatNumber(weekSummary.totalCaloriesIn)}
          </Text>
          <Text style={styles.weeklyCardSub}>
            TB: {formatNumber(weekSummary.avgCaloriesIn)} kcal/ngày
          </Text>
        </View>

        <View style={styles.weeklySummaryCard}>
          <Text style={styles.weeklyCardLabel}>Tổng Tiêu hao</Text>
          <Text style={[styles.weeklyCardValue, { color: theme.colors.macroProtein }]}>
            {formatNumber(weekSummary.totalCaloriesBurned)}
          </Text>
          <Text style={styles.weeklyCardSub}>
            TB: {formatNumber(weekSummary.avgCaloriesBurned)} kcal/ngày
          </Text>
        </View>

        <View style={styles.weeklySummaryCard}>
          <Text style={styles.weeklyCardLabel}>Nước uống TB</Text>
          <Text style={[styles.weeklyCardValue, { color: theme.colors.trackerWater }]}>
            {formatNumber(weekSummary.avgWaterMl)} ml
          </Text>
          <Text style={styles.weeklyCardSub}>
            Mục tiêu: {formatNumber(waterGoal)} ml
          </Text>
        </View>

        <View style={styles.weeklySummaryCard}>
          <Text style={styles.weeklyCardLabel}>Bước chân TB</Text>
          <Text style={[styles.weeklyCardValue, { color: theme.colors.quickScanner }]}>
            {formatNumber(weekSummary.avgSteps)}
          </Text>
          <Text style={styles.weeklyCardSub}>bước/ngày</Text>
        </View>
      </View>

      {/* Calorie In vs Burned Grouped Bar Chart */}
      <CalorieBarChart
        days={weekSummary.days}
        targetCalories={caloriesGoal}
      />

      {/* Macro Distribution Donut Chart */}
      <MacroReportChart macroData={weekMacroData} />

      {/* Weight Trend Line Chart */}
      <WeightTrendChart
        points={trendPoints}
        targetWeightKg={targetWeightKg}
      />

      {/* AI Weight Forecast Card with Lamp Icon */}
      <WeightForecastCard forecast={forecast} />
    </View>
  );
}
