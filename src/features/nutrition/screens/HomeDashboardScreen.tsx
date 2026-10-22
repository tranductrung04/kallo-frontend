// ─── HomeDashboardScreen — Nocturne & Daylight Vitality ───────────────────────
// Dùng lại component trong @/components/common (AppText, AppCard, AppButton,
// ProgressBar, CircularProgress) và token của theme, nên tự đổi theo light ↔ dark.
//   • Icon        → ./HomeDashboard/HomeIcons.tsx
//   • Stylesheet  → ./HomeDashboard/HomeDashboardScreen.styles.ts (chỉ còn layout)
//   • Khối lặp    → ./HomeDashboard/HomeWidgets.tsx (MacroColumn, ActivityGrid, WeightChart)
//   • Helper ngày → ./HomeDashboard/dateUtils.ts
// ─────────────────────────────────────────────────────────────────────────────

import React, { useMemo } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  useWindowDimensions,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppText, CircularProgress } from '@/components/common';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useNutrition } from '../NutritionProvider';
import { useActivity } from '@/features/activity';
import { useGamification } from '@/features/gamification';
import { formatNumber, todayKey } from '../utils';
import { formatHeaderDate, getWeekDays } from './HomeDashboard/dateUtils';
import { createStyles } from './HomeDashboard/HomeDashboardScreen.styles';
import {
  CalendarIcon,
  CloudAddIcon,
  CutleryIcon,
  DropletIcon,
  EmptyCupIcon,
  FlagIcon,
  FlameIcon,
  FullCupIcon,
  HealthConnectIcon,
  LeafIcon,
  LightningIcon,
  PlusIcon,
  ScaleIcon,
} from './HomeDashboard/HomeIcons';
import { ActivityGrid, MacroColumn, WeightChart } from './HomeDashboard/HomeWidgets';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;
type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

// ─── Component ────────────────────────────────────────────────────────────────

export function HomeDashboardScreen({ navigation }: Props) {
  const theme = useTheme();
  const { colors, spacing } = theme;
  const { width: screenWidth } = useWindowDimensions();
  const styles = useMemo(() => createStyles(theme, screenWidth), [theme, screenWidth]);

  const { state, getSummary, addWater, setSelectedDate } = useNutrition();
  const { getTotalCaloriesBurnedForDate } = useActivity();
  const { streak } = useGamification();

  const selectedDate = state.selectedDate || todayKey();
  const caloriesBurned = getTotalCaloriesBurnedForDate(selectedDate);
  const summary = getSummary(selectedDate, caloriesBurned);
  const root = navigation.getParent() as RootNavigation | undefined;

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);
  const dateTitle = useMemo(() => formatHeaderDate(selectedDate), [selectedDate]);

  // Calories
  const caloriesGoal = summary.caloriesGoal || 1794;
  const caloriesConsumed = summary.calories || 0;
  const caloriesRemaining = Math.max(0, caloriesGoal - caloriesConsumed + caloriesBurned);
  const progress = caloriesGoal > 0 ? caloriesConsumed / caloriesGoal : 0;
  // Vẫn hiện một cung nhỏ khi chưa nạp calo (CircularProgress tự clamp 0–1)
  const ringValue = progress > 0 ? progress : 0.08;

  // Macro goals (fallback khi chưa có dữ liệu)
  const proteinGoal = summary.proteinGoal || 90;
  const carbsGoal = summary.carbsGoal || 224;
  const fatGoal = summary.fatGoal || 60;

  const currentWeight = summary.weightKg || 60;

  // Chiều rộng biểu đồ = màn hình − padding màn hình − padding card (mỗi bên)
  const weightChartWidth = screenWidth - (spacing.lg + spacing.md) * 2;

  const openActivityTracker = () => root?.navigate('ActivityTracker', { date: selectedDate });

  const handleUpgradePress = () => {
    Alert.alert(
      'Kallo Premium',
      'Nâng cấp gói Kallo Premium để mở khóa phân tích dinh dưỡng chuyên sâu, thực đơn AI không giới hạn và nhận diện hình ảnh thông minh!',
      [{ text: 'Đóng', style: 'cancel' }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle={theme.scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.canvasBase}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── 1. Top Header ────────────────────────────────────────────── */}
        <View style={styles.topHeader}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Nâng cấp gói"
            style={({ pressed }) => [styles.upgradePillTop, pressed && styles.pressedOpacity]}
            onPress={handleUpgradePress}
          >
            <AppText variant="labelLg" color={colors.onUpgradeAccent}>Nâng cấp gói</AppText>
          </Pressable>

          <View style={styles.headerRightRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Chuỗi ${streak.currentStreak} ngày`}
              style={styles.streakContainer}
              onPress={() => root?.navigate('StreakDetail')}
            >
              <FlameIcon size={16} color={colors.textSecondary} />
              <AppText variant="labelLg">{streak.currentStreak || 0}</AppText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mở lịch"
              style={styles.calendarBtn}
              onPress={() => setSelectedDate(todayKey())}
            >
              <CalendarIcon size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        {/* ── 2. Date Strip / Weekday Selector ────────────────────────── */}
        <View style={styles.weekSection}>
          <AppText variant="labelMd" color={colors.textSecondary} style={styles.weekDateTitle}>
            {dateTitle}
          </AppText>
          <View style={styles.weekRow}>
            {weekDays.map((item) => (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                accessibilityLabel={`Chọn ${item.label}`}
                accessibilityState={{ selected: item.isSelected }}
                onPress={() => setSelectedDate(item.key)}
                style={item.isSelected ? styles.daySelectedCircle : styles.dayItem}
              >
                <AppText
                  variant="labelLg"
                  color={item.isSelected ? colors.onBrand : colors.textSecondary}
                >
                  {item.label}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── 3. Mục tiêu calo (Calorie Target) ────────────────────────── */}
        <View style={styles.calorieSection}>
          <View style={styles.sectionHeaderRow}>
            <AppText variant="headlineSm">Mục tiêu calo</AppText>
            <AppButton
              label="Xem báo cáo"
              variant="secondary"
              onPress={() => root?.navigate('ReportOverview')}
            />
          </View>

          {/* Large Circular Gauge */}
          <View style={styles.gaugeContainer}>
            <CircularProgress
              value={ringValue}
              size={190}
              strokeWidth={10}
              centerText={formatNumber(caloriesRemaining)}
              label="Calo còn lại"
            />
          </View>

          {/* Sub-row under Gauge: Date + Nâng cấp gói */}
          <View style={styles.gaugeSubRow}>
            <AppText variant="labelMd" color={colors.textSecondary} style={styles.gaugeSubDateText}>
              {dateTitle}
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Nâng cấp gói"
              style={({ pressed }) => [styles.upgradePillSmall, pressed && styles.pressedOpacity]}
              onPress={handleUpgradePress}
            >
              <AppText variant="labelMd" color={colors.onUpgradeAccent}>Nâng cấp gói</AppText>
            </Pressable>
          </View>

          {/* 3 Metric Columns */}
          <View style={styles.calorieStatsRow}>
            <View style={styles.calorieStatCol}>
              <AppText variant="headlineSm" style={styles.statColNumber}>
                {formatNumber(caloriesGoal)}
              </AppText>
              <View style={styles.statColLabelRow}>
                <FlagIcon size={12} color={colors.textSecondary} />
                <AppText variant="bodySm" color={colors.textSecondary}>Mục tiêu</AppText>
              </View>
            </View>

            <View style={styles.calorieStatCol}>
              <AppText variant="headlineSm" style={styles.statColNumber}>
                {formatNumber(caloriesConsumed)}
              </AppText>
              <View style={styles.statColLabelRow}>
                <CutleryIcon size={13} color={colors.brandSecondary} />
                <AppText variant="bodySm" color={colors.textSecondary}>Đã nạp</AppText>
              </View>
            </View>

            <View style={styles.calorieStatCol}>
              <AppText variant="headlineSm" style={styles.statColNumber}>
                {formatNumber(caloriesBurned)}
              </AppText>
              <View style={styles.statColLabelRow}>
                <FlameIcon size={13} color={colors.trackerBurn} />
                <AppText variant="bodySm" color={colors.textSecondary}>Tập luyện</AppText>
              </View>
            </View>
          </View>
        </View>

        {/* ── 4. Macro Nutrients Card ─────────────────────────────────── */}
        <AppCard style={styles.macroCard}>
          <View style={styles.macroColsRow}>
            <MacroColumn
              styles={styles}
              title="Chất đạm"
              icon={<LightningIcon size={13} color={colors.macroProtein} />}
              current={summary.protein}
              goal={proteinGoal}
            />
            <MacroColumn
              styles={styles}
              title="Đường bột"
              icon={<LeafIcon size={13} color={colors.macroCarbs} />}
              current={summary.carbs}
              goal={carbsGoal}
            />
            <MacroColumn
              styles={styles}
              title="Chất béo"
              icon={<DropletIcon size={13} color={colors.macroFats} />}
              current={summary.fat}
              goal={fatGoal}
            />
          </View>
        </AppCard>

        {/* Pagination Dots */}
        <View style={styles.paginationRow}>
          <View style={styles.dotActive} />
          <View style={styles.dotInactive} />
        </View>

        {/* ── 5. Nhật ký gần đây (Recent Diary) ───────────────────────── */}
        <View style={styles.sectionBlock}>
          <AppText variant="headlineSm">Nhật ký gần đây</AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mở nhật ký"
            onPress={() => navigation.navigate('Diary')}
            style={styles.emptyDiaryCard}
          >
            <CloudAddIcon size={38} color={colors.textDisabled} />
            <AppText variant="bodyMd" color={colors.textSecondary}>Chưa có dữ liệu</AppText>
          </Pressable>
        </View>

        {/* ── 6. Hoạt động tập luyện (Workout Grid) ───────────────────── */}
        <View style={styles.sectionBlock}>
          <AppText variant="headlineSm">Hoạt động tập luyện</AppText>
          <ActivityGrid styles={styles} onSelect={openActivityTracker} />
        </View>

        {/* ── 7. Two Column Cards: Bước chân & Tập luyện ───────────────── */}
        <View style={styles.twoColRow}>
          <AppCard
            accessibilityLabel="Kết nối Google Health"
            onPress={() => root?.navigate('HealthSync')}
            style={styles.subCard}
          >
            <AppText variant="labelLg">Bước chân</AppText>
            <View style={styles.healthConnectRow}>
              <View style={styles.healthIconBox}>
                <HealthConnectIcon size={22} />
              </View>
              <AppText variant="bodySm" color={colors.textSecondary} style={styles.healthConnectText}>
                Kết nối Google Health để tự động cập nhật
              </AppText>
            </View>
          </AppCard>

          <AppCard
            accessibilityLabel="Ghi nhận tập luyện"
            onPress={openActivityTracker}
            style={styles.subCard}
          >
            <View style={styles.workoutTopRow}>
              <AppText variant="labelLg">Tập luyện</AppText>
              <View style={styles.plusCircleBtn}>
                <PlusIcon size={12} color={colors.onBrand} />
              </View>
            </View>
            <AppText variant="bodySm" color={colors.textSecondary} style={styles.workoutEmptyText}>
              Chưa có hoạt động...
            </AppText>
            <View style={styles.workoutBottomRow}>
              <FlameIcon size={14} color={colors.trackerBurn} />
              <AppText variant="labelLg">{caloriesBurned}</AppText>
            </View>
          </AppCard>
        </View>

        {/* ── 8. Uống nước (Water Intake) Card ─────────────────────────── */}
        <AppCard style={styles.waterCard}>
          <View style={styles.waterLeftCol}>
            <DropletIcon size={22} color={colors.trackerWater} />
            <View style={styles.waterTextGroup}>
              <AppText variant="labelLg">Uống nước</AppText>
              <AppText variant="headlineSm">{summary.waterMl || 0} ml</AppText>
            </View>
          </View>

          <View style={styles.waterControlsCapsule}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Bớt 250ml nước"
              onPress={() => {
                if (summary.waterMl > 0) addWater(selectedDate, -250);
              }}
              style={styles.waterCupBtn}
            >
              <EmptyCupIcon size={18} color={colors.textDisabled} />
            </Pressable>
            <View style={styles.waterCapsuleDivider} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Thêm 250ml nước"
              onPress={() => addWater(selectedDate, 250)}
              style={styles.waterCupBtn}
            >
              <FullCupIcon size={18} color={colors.trackerWater} />
            </Pressable>
          </View>
        </AppCard>

        {/* ── 9. Cân nặng gần nhất (Weight Tracker) Card ───────────────── */}
        <AppCard>
          <View style={styles.weightTopRow}>
            <View style={styles.weightTitleRow}>
              <ScaleIcon size={18} color={colors.trackerWeight} innerColor={colors.surfaceMid} />
              <AppText variant="labelLg">Cân nặng gần nhất</AppText>
            </View>
            <AppButton
              label="Cập nhật"
              variant="primary"
              onPress={() => root?.navigate('BodyMetric')}
              style={styles.weightUpdateBtn}
            />
          </View>

          <View style={styles.weightValuesGroup}>
            <AppText variant="headlineMd" color={colors.brandSecondary}>{currentWeight} kg</AppText>
            <AppText variant="bodySm" color={colors.textSecondary} style={styles.weightDateText}>
              {state.weightLogs.length > 0 ? state.weightLogs[state.weightLogs.length - 1].date : '15 Th 09, 2026'}
            </AppText>
          </View>

          <View style={styles.weightChartContainer}>
            <WeightChart width={weightChartWidth} weight={currentWeight} />
          </View>
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
}
