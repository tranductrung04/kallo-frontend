import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { offsetDate, scaleNutrition, todayKey } from '@/features/nutrition/utils';
import { useActivity } from '@/features/activity/ActivityProvider';
import type { RootStackParamList } from '@/navigation/types';
import {
  aggregatePeriodSummary,
  calculateMacroReport,
  calculateWeightTrendAndForecast,
  getPeriodDates,
} from '../utils';
import {
  DayCalorieSection,
  DayMacroSection,
  ReportDateNavigator,
  ReportHeader,
  TopFoodContributorsSection,
  WeeklyReportView,
  styles,
} from './ReportOverview';

type ScreenRouteProp = RouteProp<RootStackParamList, 'ReportOverview'>;
type ScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'ReportOverview'>;

export function ReportOverviewScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ScreenNavProp>();
  const route = useRoute<ScreenRouteProp>();

  const { state: nutritionState, foods, getSummary, getLogs } = useNutrition();
  const { state: activityState } = useActivity();

  // Route parameters
  const initialDate = route.params?.date || nutritionState.selectedDate || todayKey();
  const initialMetric = route.params?.metric || 'protein';

  // Screen State
  const [activeTab, setActiveTab] = useState<'day' | 'week'>('day');
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [contribMetric, setContribMetric] = useState<'protein' | 'carbs' | 'fat'>(
    initialMetric === 'carbs' || initialMetric === 'fat' ? initialMetric : 'protein'
  );

  // Daily Data
  const summary = useMemo(() => getSummary(selectedDate), [getSummary, selectedDate]);
  const dailyLogs = useMemo(() => getLogs(selectedDate), [getLogs, selectedDate]);

  // Macro Calculations
  const proteinGrams = Math.round(summary.protein);
  const carbsGrams = Math.round(summary.carbs);
  const fatGrams = Math.round(summary.fat);

  const proteinCals = proteinGrams * 4;
  const carbsCals = carbsGrams * 4;
  const fatCals = fatGrams * 9;
  const totalMacroCals = proteinCals + carbsCals + fatCals;

  const proteinPct = totalMacroCals > 0 ? Math.round((proteinCals / totalMacroCals) * 100) : 0;
  const carbsPct = totalMacroCals > 0 ? Math.round((carbsCals / totalMacroCals) * 100) : 0;
  const fatPct = totalMacroCals > 0 ? Math.round((fatCals / totalMacroCals) * 100) : 0;

  // Goals ratios
  const goalProtein = nutritionState.goals.protein || 90;
  const goalCarbs = nutritionState.goals.carbs || 224;
  const goalFat = nutritionState.goals.fat || 60;
  const goalCalories = summary.caloriesGoal || nutritionState.goals.calories || 1794;

  const goalProteinCals = goalProtein * 4;
  const goalCarbsCals = goalCarbs * 4;
  const goalFatCals = goalFat * 9;
  const goalTotalMacroCals = goalProteinCals + goalCarbsCals + goalFatCals;

  const targetProteinPct = goalTotalMacroCals > 0 ? Math.round((goalProteinCals / goalTotalMacroCals) * 100) : 20;
  const targetCarbsPct = goalTotalMacroCals > 0 ? Math.round((goalCarbsCals / goalTotalMacroCals) * 100) : 50;
  const targetFatPct = goalTotalMacroCals > 0 ? Math.round((goalFatCals / goalTotalMacroCals) * 100) : 30;

  // Progress bar calculation
  const caloProgressPercent = Math.min(100, Math.max(0, (summary.calories / goalCalories) * 100));

  // Date Formatting for Navigator: DD/MM
  const formatDayMonth = (dStr: string) => {
    const parts = dStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
    const d = new Date(dStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  // Weekly calculations
  const weekDatesList = useMemo(() => getPeriodDates('week', selectedDate), [selectedDate]);
  const weekSummary = useMemo(
    () =>
      aggregatePeriodSummary(
        'week',
        weekDatesList,
        nutritionState.foodLogs,
        activityState.activityLogs,
        activityState.syncLogs,
        nutritionState.waterLogs,
        nutritionState.weightLogs,
        foods,
        nutritionState.goals
      ),
    [
      weekDatesList,
      nutritionState.foodLogs,
      activityState.activityLogs,
      activityState.syncLogs,
      nutritionState.waterLogs,
      nutritionState.weightLogs,
      foods,
      nutritionState.goals,
    ]
  );

  const weekMacroData = useMemo(
    () => calculateMacroReport(weekSummary.days, nutritionState.goals),
    [weekSummary.days, nutritionState.goals]
  );

  const { trendPoints, forecast } = useMemo(
    () =>
      calculateWeightTrendAndForecast(
        nutritionState.weightLogs,
        nutritionState.goals.targetWeightKg,
        selectedDate
      ),
    [nutritionState.weightLogs, nutritionState.goals.targetWeightKg, selectedDate]
  );

  // Top Food Contributors for Daily view
  const topContributors = useMemo(() => {
    if (!dailyLogs || dailyLogs.length === 0) return [];

    const map = new Map<string, number>();
    for (const log of dailyLogs) {
      const food = foods.find((f) => f.id === log.foodId);
      const nut = log.nutritionSnapshot ?? (food ? scaleNutrition(food, log.grams) : null);
      if (!nut) continue;

      let value = 0;
      if (contribMetric === 'protein') value = nut.protein;
      else if (contribMetric === 'carbs') value = nut.carbs;
      else if (contribMetric === 'fat') value = nut.fat;

      if (value > 0) {
        const name = log.foodName || food?.name || 'Món ăn';
        map.set(name, (map.get(name) || 0) + value);
      }
    }

    const totalVal =
      contribMetric === 'protein'
        ? summary.protein
        : contribMetric === 'carbs'
        ? summary.carbs
        : summary.fat;

    return Array.from(map.entries())
      .map(([name, amount]) => ({
        name,
        amount: Math.round(amount * 10) / 10,
        pct: totalVal > 0 ? Math.min(100, Math.round((amount / totalVal) * 100)) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [dailyLogs, foods, contribMetric, summary.protein, summary.carbs, summary.fat]);

  // Secondary nutrients
  const saltGoal = 5;
  const sugarGoal = 49;
  const fiberGoal = 24;
  const saltCurrent = (summary as any).salt ?? (summary as any).sodium ?? 0;
  const sugarCurrent = (summary as any).sugar ?? 0;
  const fiberCurrent = (summary as any).fiber ?? 0;

  // Handlers
  const handlePrevDay = () => {
    if (activeTab === 'day') {
      setSelectedDate((curr) => offsetDate(curr, -1));
    } else {
      setSelectedDate((curr) => offsetDate(curr, -7));
    }
  };

  const handleNextDay = () => {
    if (activeTab === 'day') {
      setSelectedDate((curr) => offsetDate(curr, 1));
    } else {
      setSelectedDate((curr) => offsetDate(curr, 7));
    }
  };

  const handleLogFood = () => {
    navigation.navigate('FoodSearch', {
      date: selectedDate,
      meal: 'breakfast',
    });
  };

  const dateLabel =
    activeTab === 'day'
      ? formatDayMonth(selectedDate)
      : `${formatDayMonth(weekDatesList[0])} - ${formatDayMonth(weekDatesList[6])}`;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0B14" />

      {/* ── 1. Top Header ── */}
      <ReportHeader
        topInset={insets.top}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 2. Date Navigator Bar ── */}
        <ReportDateNavigator
          dateLabel={dateLabel}
          onPrev={handlePrevDay}
          onNext={handleNextDay}
        />

        {activeTab === 'day' ? (
          <>
            {/* ── 3. Section 1: Lượng calo trong ngày ── */}
            <DayCalorieSection
              calories={summary.calories}
              goalCalories={goalCalories}
              caloriesRemaining={summary.caloriesRemaining}
              progressPercent={caloProgressPercent}
              onLogFood={handleLogFood}
            />

            {/* ── 4. Section 2: Tổng quan dinh dưỡng & đa lượng ── */}
            <DayMacroSection
              calories={summary.calories}
              goalCalories={goalCalories}
              goalProtein={goalProtein}
              goalCarbs={goalCarbs}
              goalFat={goalFat}
              proteinGrams={proteinGrams}
              carbsGrams={carbsGrams}
              fatGrams={fatGrams}
              proteinPct={proteinPct}
              carbsPct={carbsPct}
              fatPct={fatPct}
              targetProteinPct={targetProteinPct}
              targetCarbsPct={targetCarbsPct}
              targetFatPct={targetFatPct}
              saltCurrent={saltCurrent}
              saltGoal={saltGoal}
              sugarCurrent={sugarCurrent}
              sugarGoal={sugarGoal}
              fiberCurrent={fiberCurrent}
              fiberGoal={fiberGoal}
              waterCurrent={summary.waterMl}
              waterGoal={nutritionState.goals.waterMl}
              hasLogs={dailyLogs.length > 0}
            />

            {/* ── 5. Section 3: Thực phẩm đóng góp nhiều nhất ── */}
            <TopFoodContributorsSection
              contribMetric={contribMetric}
              onMetricChange={setContribMetric}
              contributors={topContributors}
            />
          </>
        ) : (
          /* ── Weekly View Analytics ── */
          <WeeklyReportView
            weekSummary={weekSummary}
            weekMacroData={weekMacroData}
            trendPoints={trendPoints}
            forecast={forecast}
            waterGoal={nutritionState.goals.waterMl}
            caloriesGoal={nutritionState.goals.calories}
            targetWeightKg={nutritionState.goals.targetWeightKg}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
