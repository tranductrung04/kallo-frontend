import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '@/theme';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { formatNumber, offsetDate, scaleNutrition, todayKey } from '@/features/nutrition/utils';
import { useActivity } from '@/features/activity/ActivityProvider';
import type { RootStackParamList } from '@/navigation/types';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DropletIcon,
  EmptyFolderIllustration,
  FiberIcon,
  FlameIcon,
  LightningIcon,
  PlusIcon,
  SaltIcon,
  SparklesIcon,
  SugarIcon,
  WheatIcon,
} from '@/components/icons';
import {
  CalorieBarChart,
  MacroReportChart,
  WeightForecastCard,
  WeightTrendChart,
} from '../components';
import {
  aggregatePeriodSummary,
  calculateMacroReport,
  calculateWeightTrendAndForecast,
  getPeriodDates,
} from '../utils';

type ScreenRouteProp = RouteProp<RootStackParamList, 'ReportOverview'>;
type ScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'ReportOverview'>;

export function ReportOverviewScreen() {
  const theme = useTheme();
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
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
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

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0B14" />

      {/* ── 1. Top Header ──────────────────────────────────────────────────────── */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(8, insets.top) }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <ChevronLeftIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Báo cáo dinh dưỡng</Text>

          {/* Balance spacer */}
          <View style={styles.headerSpacer} />
        </View>

        {/* Sub-tabs: Ngày | Tuần */}
        <View style={styles.tabBarRow}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'day' && styles.tabButtonActive]}
            onPress={() => setActiveTab('day')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'day' }}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'day' ? styles.tabButtonTextActive : styles.tabButtonTextInactive,
              ]}
            >
              Ngày
            </Text>
            {activeTab === 'day' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'week' && styles.tabButtonActive]}
            onPress={() => setActiveTab('week')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'week' }}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'week' ? styles.tabButtonTextActive : styles.tabButtonTextInactive,
              ]}
            >
              Tuần
            </Text>
            {activeTab === 'week' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        </View>
        <View style={styles.headerBorderBottom} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 2. Date Navigator Bar ────────────────────────────────────────────── */}
        <View style={styles.dateNavigatorContainer}>
          <TouchableOpacity
            onPress={handlePrevDay}
            style={styles.dateNavChevron}
            accessibilityLabel="Ngày trước"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronLeftIcon size={18} color="#C4C0D4" />
          </TouchableOpacity>

          <Text style={styles.dateNavText}>
            {activeTab === 'day'
              ? formatDayMonth(selectedDate)
              : `${formatDayMonth(weekDatesList[0])} - ${formatDayMonth(weekDatesList[6])}`}
          </Text>

          <TouchableOpacity
            onPress={handleNextDay}
            style={styles.dateNavChevron}
            accessibilityLabel="Ngày sau"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronRightIcon size={18} color="#C4C0D4" />
          </TouchableOpacity>
        </View>

        {activeTab === 'day' ? (
          <>
            {/* ── 3. Section 1: Lượng calo trong ngày ────────────────────────────── */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Lượng calo trong ngày</Text>

              {/* Main Calorie Intake Card */}
              <View style={styles.cardSurface}>
                <View style={styles.calorieTopRow}>
                  <View>
                    <Text style={styles.cardLabelText}>Calo nạp vào</Text>
                    <View style={styles.calorieValuesRow}>
                      <Text style={styles.calorieCurrentText}>
                        {formatNumber(summary.calories)}
                      </Text>
                      <Text style={styles.calorieGoalText}>
                        /{formatNumber(goalCalories)} cal
                      </Text>
                    </View>
                  </View>

                  <View style={styles.logFoodContainer}>
                    <Text style={styles.logFoodText}>Ghi món ăn</Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('FoodSearch', {
                          date: selectedDate,
                          meal: 'breakfast',
                        })
                      }
                      style={styles.plusButtonCircle}
                      accessibilityRole="button"
                      accessibilityLabel="Ghi món ăn"
                    >
                      <PlusIcon size={16} color="#9E64F7" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Progress Bar with Flame & Target Marker */}
                <View style={styles.progressBarWrapper}>
                  <View style={styles.flameCircleBadge}>
                    <FlameIcon size={16} color="#9E64F7" />
                  </View>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${caloProgressPercent}%` },
                      ]}
                    />
                    {/* Goal indicator line mark */}
                    <View style={styles.progressTargetLine} />
                  </View>
                </View>
              </View>

              {/* Wao Insight / Motivation Card */}
              <View style={[styles.cardSurface, styles.insightCard]}>
                <View style={styles.insightHeaderRow}>
                  <SparklesIcon size={18} color="#9E64F7" />
                  <Text style={styles.insightTitle}>
                    {summary.calories === 0
                      ? 'Bạn chưa ghi món ăn hôm nay!'
                      : `Đã nạp ${formatNumber(summary.calories)} cal hôm nay!`}
                  </Text>
                </View>
                <Text style={styles.insightSubtitle}>
                  {summary.calories === 0
                    ? 'Bắt đầu log để Wao theo dõi lượng calo và xu hướng ăn uống của bạn.'
                    : `Bạn còn ${formatNumber(summary.caloriesRemaining)} cal để đạt mục tiêu dinh dưỡng.`}
                </Text>
              </View>
            </View>

            {/* ── 4. Section 2: Tổng quan dinh dưỡng & đa lượng ──────────────────── */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Tổng quan dinh dưỡng & đa lượng</Text>

              {/* 3 Macro Columns Card */}
              <View style={styles.cardSurface}>
                <View style={styles.macroColumnsRow}>
                  {/* Column 1: Đạm */}
                  <View style={styles.macroColumn}>
                    <View style={styles.macroColHeader}>
                      <LightningIcon size={13} color="#FF6B6B" />
                      <Text style={[styles.macroColTitle, { color: '#FF6B6B' }]}>
                        CHẤT ĐẠM
                      </Text>
                    </View>
                    <Text style={styles.macroColValue}>{proteinGrams} g</Text>
                    <View style={styles.macroPillBadge}>
                      <Text style={styles.pillNumWhite}>{proteinPct}</Text>
                      <Text style={styles.pillNumPurple}> / {targetProteinPct}%</Text>
                    </View>
                  </View>

                  {/* Column 2: Đường bột */}
                  <View style={styles.macroColumn}>
                    <View style={styles.macroColHeader}>
                      <WheatIcon size={14} color="#3B82F6" />
                      <Text style={[styles.macroColTitle, { color: '#3B82F6' }]}>
                        ĐƯỜNG BỘT
                      </Text>
                    </View>
                    <Text style={styles.macroColValue}>{carbsGrams} g</Text>
                    <View style={styles.macroPillBadge}>
                      <Text style={styles.pillNumWhite}>{carbsPct}</Text>
                      <Text style={styles.pillNumPurple}> / {targetCarbsPct}%</Text>
                    </View>
                  </View>

                  {/* Column 3: Chất béo */}
                  <View style={styles.macroColumn}>
                    <View style={styles.macroColHeader}>
                      <DropletIcon size={13} color="#FBBF24" />
                      <Text style={[styles.macroColTitle, { color: '#FBBF24' }]}>
                        CHẤT BÉO
                      </Text>
                    </View>
                    <Text style={styles.macroColValue}>{fatGrams} g</Text>
                    <View style={styles.macroPillBadge}>
                      <Text style={styles.pillNumWhite}>{fatPct}</Text>
                      <Text style={styles.pillNumPurple}> / {targetFatPct}%</Text>
                    </View>
                  </View>
                </View>

                {/* Collapsible Button: So sánh các chỉ số khác */}
                <TouchableOpacity
                  onPress={() => setIsExpanded(!isExpanded)}
                  style={styles.expandButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.expandButtonText}>
                    {isExpanded ? 'Thu gọn chỉ số khác' : 'So sánh các chỉ số khác'}
                  </Text>
                  {isExpanded ? (
                    <ChevronUpIcon size={16} color="#A59EBD" />
                  ) : (
                    <ChevronDownIcon size={16} color="#A59EBD" />
                  )}
                </TouchableOpacity>

                {/* Expanded Micro-nutrients */}
                {isExpanded && (
                  <View style={styles.expandedNutrientsContainer}>
                    <View style={styles.nutrientRow}>
                      <View style={styles.nutrientLabelGroup}>
                        <SaltIcon size={15} color="#FDE68A" />
                        <Text style={styles.nutrientLabel}>Muối (Salt)</Text>
                      </View>
                      <Text style={styles.nutrientValue}>
                        {formatNumber(saltCurrent)} / {formatNumber(saltGoal)} g
                      </Text>
                    </View>

                    <View style={styles.nutrientRow}>
                      <View style={styles.nutrientLabelGroup}>
                        <SugarIcon size={15} color="#38BDF8" />
                        <Text style={styles.nutrientLabel}>Đường (Sugar)</Text>
                      </View>
                      <Text style={styles.nutrientValue}>
                        {formatNumber(sugarCurrent)} / {formatNumber(sugarGoal)} g
                      </Text>
                    </View>

                    <View style={styles.nutrientRow}>
                      <View style={styles.nutrientLabelGroup}>
                        <FiberIcon size={15} color="#4ADE80" />
                        <Text style={styles.nutrientLabel}>Chất xơ (Fiber)</Text>
                      </View>
                      <Text style={styles.nutrientValue}>
                        {formatNumber(fiberCurrent)} / {formatNumber(fiberGoal)} g
                      </Text>
                    </View>

                    <View style={styles.nutrientRow}>
                      <View style={styles.nutrientLabelGroup}>
                        <DropletIcon size={14} color="#60A5FA" />
                        <Text style={styles.nutrientLabel}>Nước uống</Text>
                      </View>
                      <Text style={styles.nutrientValue}>
                        {formatNumber(summary.waterMl)} / {formatNumber(nutritionState.goals.waterMl)} ml
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Meal Optimization Card */}
              <View style={[styles.cardSurface, styles.optimizationCard]}>
                <View style={styles.optBadgeContainer}>
                  <SparklesIcon size={14} color="#7C3AED" />
                  <Text style={styles.optBadgeText}>Tối ưu bữa ăn</Text>
                </View>

                <Text style={styles.optimizationTitle}>
                  {dailyLogs.length === 0 ? 'Hôm nay vẫn chưa có gì' : 'Phân bổ calo bữa ăn'}
                </Text>
                <Text style={styles.optimizationSubtitle}>
                  {dailyLogs.length === 0
                    ? 'Thêm món ăn vào nhật ký để Wao có thể hiểu rõ hơn thói quen ăn uống của bạn.'
                    : `Bữa ăn hôm nay đã phân bổ hợp lý theo mục tiêu calo.`}
                </Text>
              </View>
            </View>

            {/* ── 5. Section 3: Thực phẩm đóng góp nhiều nhất ────────────────── */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Thực phẩm đóng góp nhiều nhất</Text>

              {/* Filter Pills */}
              <View style={styles.filterPillsRow}>
                <TouchableOpacity
                  style={[
                    styles.filterPill,
                    contribMetric === 'protein' && styles.filterPillActive,
                  ]}
                  onPress={() => setContribMetric('protein')}
                >
                  <LightningIcon
                    size={14}
                    color={contribMetric === 'protein' ? '#FFFFFF' : '#FF6B6B'}
                  />
                  <Text
                    style={[
                      styles.filterPillText,
                      contribMetric === 'protein' && styles.filterPillTextActive,
                    ]}
                  >
                    Chất đạm
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterPill,
                    contribMetric === 'carbs' && styles.filterPillActive,
                  ]}
                  onPress={() => setContribMetric('carbs')}
                >
                  <WheatIcon
                    size={15}
                    color={contribMetric === 'carbs' ? '#FFFFFF' : '#3B82F6'}
                  />
                  <Text
                    style={[
                      styles.filterPillText,
                      contribMetric === 'carbs' && styles.filterPillTextActive,
                    ]}
                  >
                    Đường bột
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterPill,
                    contribMetric === 'fat' && styles.filterPillActive,
                  ]}
                  onPress={() => setContribMetric('fat')}
                >
                  <DropletIcon
                    size={14}
                    color={contribMetric === 'fat' ? '#FFFFFF' : '#FBBF24'}
                  />
                  <Text
                    style={[
                      styles.filterPillText,
                      contribMetric === 'fat' && styles.filterPillTextActive,
                    ]}
                  >
                    Chất béo
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Content Box */}
              {topContributors.length === 0 ? (
                <View style={styles.emptyDashedBox}>
                  <EmptyFolderIllustration size={130} />
                  <Text style={styles.emptyDashedText}>Bạn chưa có dữ liệu</Text>
                </View>
              ) : (
                <View style={styles.contributorsCard}>
                  {topContributors.map((item, index) => (
                    <View key={`${item.name}-${index}`} style={styles.contribItemRow}>
                      <View style={styles.contribItemLeft}>
                        <Text style={styles.contribRank}>#{index + 1}</Text>
                        <Text style={styles.contribName} numberOfLines={1}>
                          {item.name}
                        </Text>
                      </View>
                      <View style={styles.contribItemRight}>
                        <Text style={styles.contribAmount}>
                          {item.amount} g ({item.pct}%)
                        </Text>
                        <View style={styles.contribMiniTrack}>
                          <View
                            style={[
                              styles.contribMiniFill,
                              {
                                width: `${item.pct}%`,
                                backgroundColor:
                                  contribMetric === 'protein'
                                    ? '#FF6B6B'
                                    : contribMetric === 'carbs'
                                    ? '#3B82F6'
                                    : '#FBBF24',
                              },
                            ]}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </>
        ) : (
          /* ── Weekly View Analytics ────────────────────────────────────────── */
          <View style={styles.weeklyContainer}>
            {/* High-level Summary Metrics Cards */}
            <View style={styles.weeklySummaryGrid}>
              <View style={styles.weeklySummaryCard}>
                <Text style={styles.weeklyCardLabel}>Tổng Calo Nạp</Text>
                <Text style={[styles.weeklyCardValue, { color: '#9E64F7' }]}>
                  {formatNumber(weekSummary.totalCaloriesIn)}
                </Text>
                <Text style={styles.weeklyCardSub}>
                  TB: {formatNumber(weekSummary.avgCaloriesIn)} kcal/ngày
                </Text>
              </View>

              <View style={styles.weeklySummaryCard}>
                <Text style={styles.weeklyCardLabel}>Tổng Tiêu hao</Text>
                <Text style={[styles.weeklyCardValue, { color: '#FF6B6B' }]}>
                  {formatNumber(weekSummary.totalCaloriesBurned)}
                </Text>
                <Text style={styles.weeklyCardSub}>
                  TB: {formatNumber(weekSummary.avgCaloriesBurned)} kcal/ngày
                </Text>
              </View>

              <View style={styles.weeklySummaryCard}>
                <Text style={styles.weeklyCardLabel}>Nước uống TB</Text>
                <Text style={[styles.weeklyCardValue, { color: '#38BDF8' }]}>
                  {formatNumber(weekSummary.avgWaterMl)} ml
                </Text>
                <Text style={styles.weeklyCardSub}>
                  Mục tiêu: {formatNumber(nutritionState.goals.waterMl)} ml
                </Text>
              </View>

              <View style={styles.weeklySummaryCard}>
                <Text style={styles.weeklyCardLabel}>Bước chân TB</Text>
                <Text style={[styles.weeklyCardValue, { color: '#4ADE80' }]}>
                  {formatNumber(weekSummary.avgSteps)}
                </Text>
                <Text style={styles.weeklyCardSub}>bước/ngày</Text>
              </View>
            </View>

            {/* Calorie In vs Burned Grouped Bar Chart */}
            <CalorieBarChart
              days={weekSummary.days}
              targetCalories={nutritionState.goals.calories}
            />

            {/* Macro Distribution Donut Chart */}
            <MacroReportChart macroData={weekMacroData} />

            {/* Weight Trend Line Chart */}
            <WeightTrendChart
              points={trendPoints}
              targetWeightKg={nutritionState.goals.targetWeightKg}
            />

            {/* AI Weight Forecast Card with Lamp Icon */}
            <WeightForecastCard forecast={forecast} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0D0B14',
  },

  // ── Header ──
  headerContainer: {
    backgroundColor: '#0D0B14',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  headerSpacer: {
    width: 36,
  },
  tabBarRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabButtonActive: {},
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabButtonTextInactive: {
    color: '#7E7998',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '10%',
    right: '10%',
    height: 3,
    backgroundColor: '#9E64F7',
    borderRadius: 2,
  },
  headerBorderBottom: {
    height: 1,
    backgroundColor: '#1E192D',
  },

  // ── Scroll Content ──
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // ── Date Navigator ──
  dateNavigatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  dateNavChevron: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#181524',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNavText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    minWidth: 70,
    textAlign: 'center',
  },

  // ── Section ──
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: -0.3,
  },

  // ── Card Surface ──
  cardSurface: {
    backgroundColor: '#181524',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#262038',
    padding: 16,
    marginBottom: 12,
  },

  // ── Calorie In Card ──
  calorieTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardLabelText: {
    fontSize: 13,
    color: '#A5A0B8',
    marginBottom: 4,
  },
  calorieValuesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  calorieCurrentText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  calorieGoalText: {
    fontSize: 14,
    color: '#A5A0B8',
    marginLeft: 2,
    fontWeight: '500',
  },
  logFoodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logFoodText: {
    fontSize: 13,
    color: '#C4C0D8',
    fontWeight: '500',
  },
  plusButtonCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2A243D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flameCircleBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2C1F45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    flex: 1,
    height: 14,
    backgroundColor: '#262035',
    borderRadius: 7,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9E64F7',
    borderRadius: 7,
  },
  progressTargetLine: {
    position: 'absolute',
    right: '25%',
    width: 3,
    height: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
  },

  // ── Insight Card ──
  insightCard: {
    paddingVertical: 14,
    backgroundColor: '#191526',
  },
  insightHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  insightSubtitle: {
    fontSize: 13,
    color: '#9B96B0',
    lineHeight: 19,
  },

  // ── Macro 3 Columns ──
  macroColumnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  macroColumn: {
    flex: 1,
    alignItems: 'center',
  },
  macroColHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  macroColTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  macroColValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  macroPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#241E33',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillNumWhite: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pillNumPurple: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9E64F7',
  },

  // ── Expand Button ──
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#241E33',
    borderRadius: 20,
    paddingVertical: 10,
    marginTop: 16,
    gap: 6,
  },
  expandButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A59EBD',
  },
  expandedNutrientsContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#252035',
    gap: 10,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nutrientLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nutrientLabel: {
    fontSize: 13,
    color: '#A59EBD',
  },
  nutrientValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ── Meal Optimization Card ──
  optimizationCard: {
    marginTop: 2,
  },
  optBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 10,
  },
  optBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2A1A4A',
  },
  optimizationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  optimizationSubtitle: {
    fontSize: 13,
    color: '#9B96B0',
    lineHeight: 19,
  },

  // ── Section 3: Filter Pills ──
  filterPillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1C182A',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#262038',
  },
  filterPillActive: {
    backgroundColor: '#4B1E85',
    borderColor: '#7C3AED',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A59EBD',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // ── Empty Dashed Box ──
  emptyDashedBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#2E2742',
    backgroundColor: '#13101E',
    borderRadius: 18,
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDashedText: {
    fontSize: 13,
    color: '#7E7998',
    marginTop: 12,
  },

  // ── Food Contributors List ──
  contributorsCard: {
    backgroundColor: '#181524',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#262038',
    padding: 16,
    gap: 14,
  },
  contribItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contribItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  contribRank: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9E64F7',
    width: 26,
  },
  contribName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  contribItemRight: {
    alignItems: 'flex-end',
    width: 90,
  },
  contribAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A59EBD',
    marginBottom: 4,
  },
  contribMiniTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#262035',
    borderRadius: 2,
    overflow: 'hidden',
  },
  contribMiniFill: {
    height: '100%',
    borderRadius: 2,
  },

  // ── Weekly View Styles ──
  weeklyContainer: {
    gap: 16,
  },
  weeklySummaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  weeklySummaryCard: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: '#181524',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#262038',
    padding: 14,
    gap: 4,
  },
  weeklyCardLabel: {
    fontSize: 12,
    color: '#7E7998',
  },
  weeklyCardValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  weeklyCardSub: {
    fontSize: 11,
    color: '#7E7998',
  },
});
