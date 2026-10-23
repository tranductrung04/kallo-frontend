import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppButton,
  AppCard,
  AppText,
  CircularProgress,
  MonthCalendarModal,
  QuickUtilityGrid,
} from '@/components/common';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { images } from '@/assets/images';
import { useNutrition } from '../NutritionProvider';
import { useActivity } from '@/features/activity';
import { useGamification } from '@/features/gamification';
import { formatNumber, todayKey } from '../utils';
import { formatHeaderDate, formatWeightDate, getWeekDays } from './HomeDashboard/dateUtils';
import { createStyles } from './HomeDashboard/HomeDashboardScreen.styles';
import {
  BowlFoodPlusIcon,
  CalendarIcon,
  CutleryIcon,
  DropletIcon,
  FiberIcon,
  FlagIcon,
  FlameIcon,
  WheatIcon,
  LightningIcon,
  PlusIcon,
  SaltIcon,
  SugarIcon,
} from '@/components/icons';
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
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [pillSize, setPillSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const selectedDate = state.selectedDate || todayKey();
  const isToday = selectedDate === todayKey();
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

  // Slide 2: Muối, Đường, Chất xơ
  const saltGoal = 5;
  const sugarGoal = 49;
  const fiberGoal = 24;
  const saltCurrent = (summary as any).salt ?? (summary as any).sodium ?? 0;
  const sugarCurrent = (summary as any).sugar ?? 0;
  const fiberCurrent = (summary as any).fiber ?? 0;

  // Macro horizontal scroll state
  const macroScrollRef = useRef<ScrollView>(null);
  const [activeMacroPage, setActiveMacroPage] = useState(0);
  const macroCardWidth = screenWidth - spacing.lg * 2;

  const currentWeight = summary.weightKg || 60;

  // Chiều rộng biểu đồ = màn hình − padding màn hình − padding card (mỗi bên)
  const weightChartWidth = screenWidth - (spacing.lg + spacing.md) * 2;

  const openActivityTracker = () => root?.navigate('ActivityTracker', { date: selectedDate });

  // Floating Quick Utility Dock animation & scroll detection
  const [isDockVisibleState, setIsDockVisibleState] = useState(true);
  const isDockVisibleRef = useRef(true);
  const lastScrollYRef = useRef(0);
  const dockTranslateY = useRef(new Animated.Value(0)).current;
  const dockOpacity = useRef(new Animated.Value(1)).current;

  const showDock = () => {
    if (!isDockVisibleRef.current) {
      isDockVisibleRef.current = true;
      setIsDockVisibleState(true);
      Animated.parallel([
        Animated.spring(dockTranslateY, {
          toValue: 0,
          damping: 18,
          stiffness: 160,
          mass: 0.8,
          useNativeDriver: true,
        }),
        Animated.timing(dockOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const hideDock = () => {
    if (isDockVisibleRef.current) {
      isDockVisibleRef.current = false;
      setIsDockVisibleState(false);
      Animated.parallel([
        Animated.timing(dockTranslateY, {
          toValue: 120,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(dockOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollYRef.current;

    // Luôn hiện khi ở gần đỉnh cuộn
    if (currentY <= 30) {
      showDock();
    } else if (diff > 12 && currentY > 60) {
      // Ẩn khi cuộn xuống một đoạn
      hideDock();
    } else if (diff < -12) {
      // Hiện lại khi cuộn lên
      showDock();
    }

    lastScrollYRef.current = currentY;
  };

  const todayBtnTranslateY = dockTranslateY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 86],
  });

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
        backgroundColor={colors.surfaceMid}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* ── Top Hero Container (SurfaceMid full-width tràn viền: 1, 2, 3) ── */}
        <View style={styles.topHeroContainer}>
          {/* ── 1. Top Header ────────────────────────────────────────────── */}
          <View style={styles.topHeader}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Nâng cấp gói"
              onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                if (width > 0 && height > 0 && (width !== pillSize.width || height !== pillSize.height)) {
                  setPillSize({ width, height });
                }
              }}
              style={({ pressed }) => [styles.upgradePillTop, pressed && styles.pressedOpacity]}
              onPress={handleUpgradePress}
            >
              {pillSize.width > 0 && pillSize.height > 0 && (
                <Svg
                  style={StyleSheet.absoluteFill}
                  width={pillSize.width}
                  height={pillSize.height}
                >
                  <Defs>
                    <LinearGradient id="upgradeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <Stop offset="0%" stopColor="#FFFFFF" />
                      <Stop offset="25%" stopColor="#FFF4C2" />
                      <Stop offset="65%" stopColor="#FED268" />
                      <Stop offset="100%" stopColor="#F5A021" />
                    </LinearGradient>
                  </Defs>
                  <Rect
                    x={0}
                    y={0}
                    width={pillSize.width}
                    height={pillSize.height}
                    rx={pillSize.height / 2}
                    ry={pillSize.height / 2}
                    fill="url(#upgradeGrad)"
                  />
                </Svg>
              )}
              <AppText variant="labelLg" style={styles.upgradePillText}>
                Nâng cấp gói
              </AppText>
            </Pressable>

            <View style={styles.headerRightRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Chuỗi ${streak.currentStreak} ngày`}
                style={styles.streakContainer}
                onPress={() => {
                  if (root) {
                    root.navigate('StreakDetail');
                  } else {
                    (navigation as any).navigate('StreakDetail');
                  }
                }}
              >
                <FlameIcon
                  size={20}
                  color={streak.currentStreak > 0 ? colors.trackerBurn : colors.textSecondary}
                />
                <AppText variant="headlineSm" style={styles.streakText}>
                  {streak.currentStreak || 0}
                </AppText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Mở lịch"
                style={({ pressed }) => [styles.calendarBtn, pressed && styles.pressedOpacity]}
                onPress={() => setCalendarModalVisible(true)}
              >
                <CalendarIcon size={22} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>

          {/* ── 2. Date Strip / Weekday Selector ────────────────────────── */}
          <View style={styles.weekSection}>
            <AppText color={colors.textPrimary} style={styles.weekDateTitle}>
              {dateTitle}
            </AppText>
            <View style={styles.weekRow}>
              {weekDays.map((item) => {
                const isSelected = item.isSelected;
                const isTodayItem = item.isToday;

                return (
                  <Pressable
                    key={item.key}
                    accessibilityRole="button"
                    accessibilityLabel={`Chọn ${item.label}`}
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => setSelectedDate(item.key)}
                    style={styles.dayItem}
                  >
                    {isSelected && isTodayItem ? (
                      <View style={styles.daySelectedOuter}>
                        <View style={styles.daySelectedInner}>
                          <AppText color={colors.onBrand} style={styles.dayText}>
                            {item.label}
                          </AppText>
                        </View>
                      </View>
                    ) : isSelected ? (
                      <View style={styles.daySelectedCircle}>
                        <AppText color={colors.onBrand} style={styles.dayText}>
                          {item.label}
                        </AppText>
                      </View>
                    ) : isTodayItem ? (
                      <View style={styles.dayTodayOutline}>
                        <AppText color={colors.textPrimary} style={styles.dayText}>
                          {item.label}
                        </AppText>
                      </View>
                    ) : (
                      <AppText color={colors.textPrimary} style={styles.dayText}>
                        {item.label}
                      </AppText>
                    )}
                  </Pressable>
                );
              })}
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

            {/* 3 Metric Columns */}
            <View style={styles.calorieStatsRow}>
              <View style={styles.calorieStatCol}>
                <AppText variant="headlineMd" style={styles.statColNumber}>
                  {formatNumber(caloriesGoal)}
                </AppText>
                <View style={styles.statColLabelRow}>
                  <FlagIcon size={15} color={colors.textSecondary} />
                  <AppText variant="bodyMd" color={colors.textSecondary} style={styles.statColLabel}>
                    Mục tiêu
                  </AppText>
                </View>
              </View>

              <View style={styles.calorieStatCol}>
                <AppText variant="headlineMd" style={styles.statColNumber}>
                  {formatNumber(caloriesConsumed)}
                </AppText>
                <View style={styles.statColLabelRow}>
                  <CutleryIcon size={16} color={colors.brandSecondary} />
                  <AppText variant="bodyMd" color={colors.textSecondary} style={styles.statColLabel}>
                    Đã nạp
                  </AppText>
                </View>
              </View>

              <View style={styles.calorieStatCol}>
                <AppText variant="headlineMd" style={styles.statColNumber}>
                  {formatNumber(caloriesBurned)}
                </AppText>
                <View style={styles.statColLabelRow}>
                  <Image
                    source={images.trackerFire}
                    style={styles.statColFireIcon}
                    resizeMode="contain"
                    accessibilityLabel="Tập luyện"
                  />
                  <AppText variant="bodyMd" color={colors.textSecondary} style={styles.statColLabel}>
                    Tập luyện
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── Main Content Cards (CanvasBase + 16px Padding) ──────────── */}
        <View style={styles.mainContent}>
          {/* ── 4. Macro Nutrients Card (Horizontal Scroll) ──────────── */}
          <AppCard style={styles.macroCard} padding={0}>
            <ScrollView
              ref={macroScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const offsetX = e.nativeEvent.contentOffset.x;
                const page = Math.round(offsetX / (macroCardWidth || 1));
                setActiveMacroPage(page);
              }}
              scrollEventThrottle={16}
            >
              {/* Slide 1: Chất đạm, Đường bột, Chất béo */}
              <View style={[styles.macroColsRow, { width: macroCardWidth }]}>
                <MacroColumn
                  styles={styles}
                  title="Chất đạm"
                  icon={<LightningIcon size={16} color={colors.macroProtein} />}
                  current={summary.protein}
                  goal={proteinGoal}
                  color={colors.macroProtein}
                />
                <MacroColumn
                  styles={styles}
                  title="Đường bột"
                  icon={<WheatIcon size={17} color={colors.macroCarbs} creaseColor={colors.macroCarbsStrong} />}
                  current={summary.carbs}
                  goal={carbsGoal}
                  color={colors.macroCarbs}
                />
                <MacroColumn
                  styles={styles}
                  title="Chất béo"
                  icon={<DropletIcon size={16} color={colors.macroFats} />}
                  current={summary.fat}
                  goal={fatGoal}
                  color={colors.macroFats}
                />
              </View>

              {/* Slide 2: Muối, Đường, Chất xơ */}
              <View style={[styles.macroColsRow, { width: macroCardWidth }]}>
                <MacroColumn
                  styles={styles}
                  title="Muối"
                  icon={<SaltIcon size={17} color={colors.macroSalt} capColor={colors.onBrand} />}
                  current={saltCurrent}
                  goal={saltGoal}
                  color={colors.macroSalt}
                />
                <MacroColumn
                  styles={styles}
                  title="Đường"
                  icon={<SugarIcon size={17} color={colors.macroSugar} />}
                  current={sugarCurrent}
                  goal={sugarGoal}
                  color={colors.macroSugar}
                />
                <MacroColumn
                  styles={styles}
                  title="Chất xơ"
                  icon={
                    <FiberIcon
                      size={17}
                      color={colors.macroFiber}
                      stalkColor={colors.macroFiberSoft}
                      creaseColor={colors.macroFiberStrong}
                    />
                  }
                  current={fiberCurrent}
                  goal={fiberGoal}
                  color={colors.macroFiber}
                />
              </View>
            </ScrollView>
          </AppCard>

          {/* Pagination Dots */}
          <View style={styles.paginationRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Trang 1: Đạm, đường bột, chất béo"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => {
                macroScrollRef.current?.scrollTo({ x: 0, animated: true });
                setActiveMacroPage(0);
              }}
              style={activeMacroPage === 0 ? styles.dotActive : styles.dotInactive}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Trang 2: Muối, đường, chất xơ"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => {
                macroScrollRef.current?.scrollTo({ x: macroCardWidth, animated: true });
                setActiveMacroPage(1);
              }}
              style={activeMacroPage === 1 ? styles.dotActive : styles.dotInactive}
            />
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
              <BowlFoodPlusIcon
                size={40}
                color={colors.textSecondary}
                cutoutColor={colors.canvasBase}
              />
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
                  <Image
                    source={images.healthConnectIcon}
                    style={styles.healthConnectImage}
                    resizeMode="contain"
                    accessibilityLabel="Google Health Connect"
                  />
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
                  <PlusIcon size={14} color={colors.onBrand} strokeWidth={2.5} />
                </View>
              </View>
              <View style={styles.workoutMiddle}>
                <AppText variant="bodySm" color={colors.textSecondary} style={styles.workoutEmptyText}>
                  Chưa có hoạt động...
                </AppText>
                <View style={styles.workoutDivider} />
              </View>
              <View style={styles.workoutBottomRow}>
                <Image
                  source={images.trackerFire}
                  style={styles.workoutFireIcon}
                  resizeMode="contain"
                  accessibilityLabel="Calo tiêu hao"
                />
                <AppText variant="labelLg">{caloriesBurned}</AppText>
              </View>
            </AppCard>
          </View>

          {/* ── 8. Uống nước (Water Intake) Card ─────────────────────────── */}
          <AppCard style={styles.waterCard}>
            <View style={styles.waterLeftCol}>
              <Image
                source={images.trackerDroplet}
                style={styles.waterDropletImage}
                resizeMode="contain"
                accessibilityLabel="Giọt nước"
              />
              <View style={styles.waterTextGroup}>
                <AppText variant="labelLg">Uống nước</AppText>
                <AppText variant="headlineSm">{summary.waterMl || 0} ml</AppText>
              </View>
            </View>

            <View style={styles.waterControlsCapsule}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Bớt 250ml nước"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => addWater(selectedDate, -200)}
                style={({ pressed }) => [styles.waterCupBtn, pressed && styles.pressedOpacity]}
              >
                <Image
                  source={images.trackerFillEmpty}
                  style={styles.waterCupImage}
                  resizeMode="contain"
                  accessibilityLabel="Bớt nước"
                />
              </Pressable>
              <View style={styles.waterCapsuleDivider} />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Thêm 250ml nước"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => addWater(selectedDate, 200)}
                style={({ pressed }) => [styles.waterCupBtn, pressed && styles.pressedOpacity]}
              >
                <Image
                  source={images.trackerFillFull}
                  style={styles.waterCupImage}
                  resizeMode="contain"
                  accessibilityLabel="Thêm nước"
                />
              </Pressable>
            </View>
          </AppCard>

          {/* ── 9. Cân nặng gần nhất (Weight Tracker) Card ───────────────── */}
          <AppCard>
            <View style={styles.weightHeaderRow}>
              <Image
                source={images.trackerWeight}
                style={styles.weightIconImage}
                resizeMode="contain"
                accessibilityLabel="Cân nặng gần nhất"
              />
              <AppText variant="headlineSm" style={styles.weightTitleText}>Cân nặng gần nhất</AppText>
            </View>

            <View style={styles.weightMiddleRow}>
              <View style={styles.weightValuesGroup}>
                <AppText variant="headlineMd" color={colors.brandSecondary}>{currentWeight} kg</AppText>
                <AppText variant="bodySm" color={colors.textSecondary} style={styles.weightDateText}>
                  {formatWeightDate(state.weightLogs.length > 0 ? state.weightLogs[state.weightLogs.length - 1].date : undefined)}
                </AppText>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cập nhật cân nặng"
                onPress={() => root?.navigate('BodyMetric')}
                style={({ pressed }) => [
                  styles.weightUpdatePillBtn,
                  pressed && styles.pressedOpacity,
                ]}
              >
                <AppText variant="labelLg" color={colors.onBrand} style={styles.weightUpdateBtnText}>
                  Cập nhật
                </AppText>
              </Pressable>
            </View>

            <View style={styles.weightChartContainer}>
              <WeightChart width={weightChartWidth} weight={currentWeight} />
            </View>
          </AppCard>
        </View>
      </ScrollView>

      {/* ── Floating "Quay lại hôm nay" Button ──────────────────────── */}
      {!isToday && (
        <Animated.View
          style={[
            styles.floatingTodayWrapper,
            { transform: [{ translateY: todayBtnTranslateY }] },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quay lại hôm nay"
            onPress={() => setSelectedDate(todayKey())}
            style={({ pressed }) => [styles.floatingTodayBtn, pressed && styles.pressedOpacity]}
          >
            <AppText variant="labelLg" color={colors.onBrand}>
              Quay lại hôm nay
            </AppText>
          </Pressable>
        </Animated.View>
      )}

      {/* ── Floating Quick Utility Dock ─────────────────────────────── */}
      <Animated.View
        pointerEvents={isDockVisibleState ? 'auto' : 'none'}
        style={[
          styles.floatingDock,
          {
            transform: [{ translateY: dockTranslateY }],
            opacity: dockOpacity,
          },
        ]}
      >
        <QuickUtilityGrid
          style={styles.floatingGrid}
          onSearch={() => root?.navigate('FoodSearch', { date: selectedDate, meal: 'snack' })}
          onBarcode={() => root?.navigate('BarcodeScanner', { date: selectedDate, meal: 'snack' })}
          onAIScan={() => root?.navigate('AIMealScan', { date: selectedDate, meal: 'snack' })}
          onVoice={() => root?.navigate('VoiceLogModal', { date: selectedDate, meal: 'snack' })}
        />
      </Animated.View>

      {/* ── Month Calendar Modal ─────────────────────────────────────── */}
      <MonthCalendarModal
        visible={calendarModalVisible}
        date={selectedDate}
        isToday={isToday}
        onSelectDate={(newDate) => {
          setSelectedDate(newDate);
          setCalendarModalVisible(false);
        }}
        onSelectToday={() => {
          setSelectedDate(todayKey());
          setCalendarModalVisible(false);
        }}
        onClose={() => setCalendarModalVisible(false)}
      />
    </SafeAreaView>
  );
}
