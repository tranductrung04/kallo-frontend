import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import {
  AppButton,
  AppCard,
  AppText,
  CircularProgress,
  MonthCalendarModal,
  QuickUtilityGrid,
  useAlert,
} from '@/components/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getHealthProfile,
  getUserAllergies,
  getUserChronicConditions,
  recalculateHealthProfile,
  type HealthProfileResponse,
} from '@/features/health-profile/api';
import type {
  UserAllergyResponse,
  UserChronicConditionResponse,
} from '@/features/health-profile/types';
import { HealthProfileCard } from './HomeDashboard/HealthProfileCard';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { images } from '@/assets/images';
import { useNutrition } from '../NutritionProvider';
import {
  CalorieGoalGuideModal,
  CalorieIntakeGuideModal,
  CarbGuideModal,
  FatGuideModal,
  FiberGuideModal,
  ProteinGuideModal,
  SaltGuideModal,
  SugarGuideModal,
  WorkoutGuideModal,
} from '../components';
import { useActivity } from '@/features/activity';
import { useGamification } from '@/features/gamification';
import { formatNumber, todayKey } from '../utils';
import { formatHeaderDate, formatWeightDate, getWeekDays } from './HomeDashboard/dateUtils';
import { createStyles } from './HomeDashboard/HomeDashboardScreen.styles';
import {
  BowlFoodPlusIcon,
  CalendarIcon,
  ChevronRightIcon,
  CutleryIcon,
  DropletIcon,
  FiberIcon,
  FlagIcon,
  FlameIcon,
  GamepadIcon,
  WheatIcon,
  LightningIcon,
  PlusIcon,
  SaltIcon,
  StarIcon,
  SugarIcon,
  TrophyIcon,
  UsersIcon,
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
  const insets = useSafeAreaInsets();

  const { state, getSummary, addWater, setSelectedDate } = useNutrition();
  const {
    getTotalCaloriesBurnedForDate,
    getTotalStepsForDate,
    getActivitiesForDate,
    state: activityState,
  } = useActivity();
  const {
    streak,
    badges,
    challenges,
    friends,
    incomingRequests,
    userPoints,
    getLeaderboard,
    refreshStreak,
  } = useGamification();

  const pointsLeaderboard = useMemo(() => getLeaderboard('challenge'), [getLeaderboard]);
  const userRankEntry = useMemo(
    () => pointsLeaderboard.find((e) => e.isCurrentUser),
    [pointsLeaderboard]
  );
  const userRank = userRankEntry ? userRankEntry.rank : null;

  const higherPlayer = useMemo(() => {
    if (!userRankEntry || userRankEntry.rank <= 1) return null;
    return pointsLeaderboard.find((e) => e.rank === userRankEntry.rank - 1);
  }, [userRankEntry, pointsLeaderboard]);

  const pointsToOvertake = useMemo(() => {
    if (!higherPlayer || !userRankEntry) return 0;
    return Math.max(1, higherPlayer.score - userRankEntry.score + 1);
  }, [higherPlayer, userRankEntry]);

  const activeChallenge = useMemo(
    () => challenges.find((c) => c.isJoined && !c.isCompleted),
    [challenges]
  );

  const [healthProfile, setHealthProfile] = useState<HealthProfileResponse | null>(null);
  const [userConditions, setUserConditions] = useState<UserChronicConditionResponse[]>([]);
  const [userAllergies, setUserAllergies] = useState<UserAllergyResponse[]>([]);
  const [recalculating, setRecalculating] = useState(false);

  const loadHealthProfileData = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem('@kallo/health-profile');
      if (raw) {
        setHealthProfile(JSON.parse(raw));
      }
      const fresh = await getHealthProfile().catch(() => null);
      if (fresh) {
        setHealthProfile(fresh);
        await AsyncStorage.setItem('@kallo/health-profile', JSON.stringify(fresh));
      }
    } catch {
      // ignore
    }

    try {
      const [conditions, allergies] = await Promise.all([
        getUserChronicConditions().catch(() => []),
        getUserAllergies().catch(() => []),
      ]);
      setUserConditions(conditions || []);
      setUserAllergies(allergies || []);
    } catch {
      // ignore
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshStreak();
      void loadHealthProfileData();
    }, [refreshStreak, loadHealthProfileData])
  );
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [calorieGoalModalVisible, setCalorieGoalModalVisible] = useState(false);
  const [calorieIntakeModalVisible, setCalorieIntakeModalVisible] = useState(false);
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [proteinModalVisible, setProteinModalVisible] = useState(false);
  const [carbModalVisible, setCarbModalVisible] = useState(false);
  const [fatModalVisible, setFatModalVisible] = useState(false);
  const [saltModalVisible, setSaltModalVisible] = useState(false);
  const [sugarModalVisible, setSugarModalVisible] = useState(false);
  const [fiberModalVisible, setFiberModalVisible] = useState(false);
  const selectedDate = state.selectedDate || todayKey();
  const isToday = selectedDate === todayKey();
  const caloriesBurned = getTotalCaloriesBurnedForDate(selectedDate);
  const todaySteps = getTotalStepsForDate(selectedDate);
  const summary = getSummary(selectedDate, caloriesBurned);
  const root = navigation.getParent() as RootNavigation | undefined;
  const { showAlert } = useAlert();


  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      const updated = await recalculateHealthProfile();
      setHealthProfile(updated);
      await AsyncStorage.setItem('@kallo/health-profile', JSON.stringify(updated));

      if (updated.goalAdvice === 'TARGET_REACHED') {
        showAlert({
          variant: 'success',
          title: '🎉 Chúc mừng bạn đã chạm đích!',
          message:
            'Bạn đã đạt mốc cân nặng mục tiêu thành công! Kallo đã tự động điều chỉnh kế hoạch sang "Duy trì cân nặng" để bảo toàn vóc dáng.',
        });
      } else {
        showAlert({
          variant: 'success',
          title: 'Tối ưu lại Calo thành công',
          message: `Mục tiêu dinh dưỡng mới: ${Math.round(updated.dailyCalorieGoal)} kcal/ngày (TDEE: ${Math.round(updated.tdee)} kcal).`,
        });
      }
    } catch (err) {
      showAlert({
        variant: 'danger',
        title: 'Lỗi',
        message: 'Không thể tính toán lại lúc này. Vui lòng thử lại sau.',
      });
    } finally {
      setRecalculating(false);
    }
  };

  const isStepConnected =
    activityState.syncStatus.healthConnect === 'CONNECTED' ||
    (Platform.OS === 'ios' && activityState.syncStatus.appleHealth === 'CONNECTED');

  const unlockedBadgesCount = useMemo(
    () => badges.filter((b) => b.isUnlocked).length,
    [badges]
  );
  const joinedChallengesCount = useMemo(
    () => challenges.filter((c) => c.isJoined).length,
    [challenges]
  );

  const latestActivityName = useMemo(() => {
    const dayActivities = getActivitiesForDate(selectedDate);
    if (dayActivities.length > 0) {
      return dayActivities[dayActivities.length - 1].name;
    }
    if (activityState.activityLogs && activityState.activityLogs.length > 0) {
      const sorted = [...activityState.activityLogs].sort((a, b) => {
        const timeA = a.timestamp || a.date;
        const timeB = b.timestamp || b.date;
        return timeB.localeCompare(timeA);
      });
      return sorted[0].name;
    }
    return null;
  }, [getActivitiesForDate, selectedDate, activityState.activityLogs]);

  const handleStepCardPress = () => {
    root?.navigate('StepDetail', { openConnectModal: !isStepConnected });
  };

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);
  const dateTitle = useMemo(() => formatHeaderDate(selectedDate), [selectedDate]);

  // Calories (Ưu tiên số liệu thực tế từ healthProfile của người dùng)
  const caloriesGoal = healthProfile?.dailyCalorieGoal
    ? Math.round(healthProfile.dailyCalorieGoal)
    : (summary.caloriesGoal || 1794);
  const caloriesConsumed = summary.calories || 0;
  const caloriesRemaining = Math.max(0, caloriesGoal - caloriesConsumed);
  const progress = caloriesGoal > 0 ? caloriesConsumed / caloriesGoal : 0;
  // Vẫn hiện một cung nhỏ khi chưa nạp calo (CircularProgress tự clamp 0–1)
  const ringValue = progress > 0 ? progress : 0.08;

  // Macro goals (Ưu tiên macronutrients tính theo hồ sơ sức khỏe)
  const proteinGoal = Math.round(
    healthProfile?.macronutrients?.proteinGrams ?? healthProfile?.proteinGoalG ?? (summary.proteinGoal || 90)
  );
  const carbsGoal = Math.round(
    healthProfile?.macronutrients?.carbGrams ?? healthProfile?.carbsGoalG ?? (summary.carbsGoal || 224)
  );
  const fatGoal = Math.round(
    healthProfile?.macronutrients?.fatGrams ?? healthProfile?.fatGoalG ?? (summary.fatGoal || 60)
  );

  // Lượng nước mục tiêu
  const waterGoalMl = Math.round(
    healthProfile?.waterGoalMl ?? (healthProfile?.waterLiters ? healthProfile.waterLiters * 1000 : 2000)
  );

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

  // Cân nặng hiện tại: Ưu tiên cân nặng mới nhất từ Health Profile hoặc nhật ký
  const currentWeight = healthProfile?.latestLoggedWeightKg ?? healthProfile?.weightKg ?? summary.weightKg ?? 60;

  // Chiều rộng biểu đồ = màn hình − padding màn hình − padding card (mỗi bên)
  const weightChartWidth = screenWidth - (spacing.lg + spacing.md) * 2;

  const openWorkoutStatistics = () =>
    root?.navigate('WorkoutStatistics', { openConnectModal: !isStepConnected });
  const openActivityTracker = () => root?.navigate('ActivityTracker', { date: selectedDate });

  const handleSelectActivity = (activityLabel: string) => {
    if (activityLabel === 'Chạy bộ') {
      root?.navigate('RunningWorkout', { date: selectedDate });
    } else if (activityLabel === 'Đạp xe') {
      root?.navigate('CyclingWorkout', { date: selectedDate });
    } else if (activityLabel === 'Cầu lông') {
      root?.navigate('BadmintonWorkout', { date: selectedDate });
    } else if (activityLabel === 'Pickleball') {
      root?.navigate('PickleballWorkout', { date: selectedDate });
    } else if (activityLabel === 'Yoga') {
      root?.navigate('YogaWorkout', { date: selectedDate });
    } else if (activityLabel === 'Khác') {
      root?.navigate('AddActivity', { date: selectedDate });
    } else {
      root?.navigate('ActivityTracker', { date: selectedDate });
    }
  };

  // Floating Quick Utility Dock animation & scroll detection
  const [isDockVisibleState, setIsDockVisibleState] = useState(true);
  const isDockVisibleRef = useRef(true);
  const lastScrollYRef = useRef(0);
  const dockTranslateY = useRef(new Animated.Value(0)).current;
  const dockOpacity = useRef(new Animated.Value(1)).current;

  // Sticky Top Header (hiển thị ngày + nâng cấp gói khi cuộn xuống)
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const isStickyVisibleRef = useRef(false);

  const stickyOpacity = scrollY.interpolate({
    inputRange: [50, 110],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const stickyTranslateY = scrollY.interpolate({
    inputRange: [50, 110],
    outputRange: [-8, 0],
    extrapolate: 'clamp',
  });

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
    scrollY.setValue(currentY);

    if (currentY > 75 && !isStickyVisibleRef.current) {
      isStickyVisibleRef.current = true;
      setIsStickyVisible(true);
    } else if (currentY <= 75 && isStickyVisibleRef.current) {
      isStickyVisibleRef.current = false;
      setIsStickyVisible(false);
    }

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

  const openAssistant = () => root?.navigate('NutritionChat');

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar
        barStyle={theme.scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.surfaceMid}
      />

      {/* ── Sticky Top Header khi cuộn xuống: Ngày + Trợ lý AI ── */}
      {isStickyVisible && (
        <Animated.View
          style={[
            styles.stickyHeader,
            {
              paddingTop: insets.top,
              height: 54 + insets.top,
              opacity: stickyOpacity,
              transform: [{ translateY: stickyTranslateY }],
            },
          ]}
          pointerEvents="auto"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mở lịch chọn ngày"
            onPress={() => setCalendarModalVisible(true)}
            style={({ pressed }) => [styles.stickyDateBtn, pressed && styles.pressedOpacity]}
          >
            <AppText style={styles.stickyDateText}>
              {dateTitle}
            </AppText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mở trợ lý Kallo AI"
            style={({ pressed }) => [styles.aiAssistantButton, pressed && styles.pressedOpacity]}
            onPress={openAssistant}
          >
            <Image source={images.mascotAvatar} style={styles.aiAssistantImage} accessibilityLabel="Trợ lý Kallo AI" />
            <AppText variant="labelLg" color={colors.brandPrimary}>Kallo AI</AppText>
          </Pressable>
        </Animated.View>
      )}

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
              accessibilityLabel="Mở trợ lý Kallo AI"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={({ pressed }) => [styles.aiAssistantButton, pressed && styles.pressedOpacity]}
              onPress={openAssistant}
            >
              <Image source={images.mascotAvatar} style={styles.aiAssistantImage} accessibilityLabel="Trợ lý Kallo AI" />
              <AppText variant="labelLg" color={colors.brandPrimary}>Kallo AI</AppText>
            </Pressable>

            <View style={styles.headerRightRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Chuỗi ${streak.currentStreak} ngày`}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
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
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
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

          {/* ── Recalculate Recommendation Banner ────────────────────────── */}
          {healthProfile?.recalculationRecommended && (
            <View
              style={{
                marginHorizontal: 16,
                marginBottom: 16,
                padding: 14,
                borderRadius: 16,
                backgroundColor: colors.brandSoftTint,
                borderWidth: 1,
                borderColor: colors.brandPrimary,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <View style={{ flex: 1, gap: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <LightningIcon size={16} color={colors.brandPrimary} />
                  <AppText variant="labelLg" style={{ color: colors.brandPrimary, fontWeight: '700' }}>
                    Đề xuất cập nhật Calo
                  </AppText>
                </View>
                <AppText variant="caption" color={colors.textSecondary}>
                  Cân nặng mới nhất ({healthProfile.latestLoggedWeightKg} kg) đã thay đổi. Bạn có muốn cập nhật lại chỉ số Calo & TDEE theo cân nặng mới?
                </AppText>
              </View>
              <TouchableOpacity
                onPress={handleRecalculate}
                disabled={recalculating}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  backgroundColor: colors.brandPrimary,
                  borderRadius: 10,
                  opacity: recalculating ? 0.7 : 1,
                }}
              >
                <AppText variant="labelMd" style={{ color: '#FFFFFF', fontWeight: '600' }}>
                  {recalculating ? 'Đang tính...' : 'Áp dụng'}
                </AppText>
              </TouchableOpacity>
            </View>
          )}

          {/* ── 3. Mục tiêu calo (Calorie Target) ────────────────────────── */}
          <View style={styles.calorieSection}>
            <View style={styles.sectionHeaderRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Xem hướng dẫn mục tiêu calo"
                onPress={() => setCalorieGoalModalVisible(true)}
                style={({ pressed }) => [pressed && styles.pressedOpacity]}
              >
                <AppText variant="headlineSm">Mục tiêu calo</AppText>
              </Pressable>
              <AppButton
                label="Xem báo cáo"
                variant="outline"
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
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Xem hướng dẫn calo mục tiêu"
                style={({ pressed }) => [styles.calorieStatCol, pressed && styles.pressedOpacity]}
                onPress={() => setCalorieGoalModalVisible(true)}
              >
                <AppText variant="headlineMd" style={styles.statColNumber}>
                  {formatNumber(caloriesGoal)}
                </AppText>
                <View style={styles.statColLabelRow}>
                  <FlagIcon size={15} color={colors.textSecondary} />
                  <AppText variant="bodyMd" color={colors.textSecondary} style={styles.statColLabel}>
                    Mục tiêu
                  </AppText>
                </View>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Xem hướng dẫn calo nạp vào"
                style={({ pressed }) => [styles.calorieStatCol, pressed && styles.pressedOpacity]}
                onPress={() => setCalorieIntakeModalVisible(true)}
              >
                <AppText variant="headlineMd" style={styles.statColNumber}>
                  {formatNumber(caloriesConsumed)}
                </AppText>
                <View style={styles.statColLabelRow}>
                  <CutleryIcon size={16} color={colors.brandSecondary} />
                  <AppText variant="bodyMd" color={colors.textSecondary} style={styles.statColLabel}>
                    Đã nạp
                  </AppText>
                </View>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Xem hướng dẫn tập luyện"
                style={({ pressed }) => [styles.calorieStatCol, pressed && styles.pressedOpacity]}
                onPress={() => setWorkoutModalVisible(true)}
              >
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
              </Pressable>
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
                  onPress={() => setProteinModalVisible(true)}
                />
                <MacroColumn
                  styles={styles}
                  title="Đường bột"
                  icon={<WheatIcon size={17} color={colors.macroCarbs} creaseColor={colors.macroCarbsStrong} />}
                  current={summary.carbs}
                  goal={carbsGoal}
                  color={colors.macroCarbs}
                  onPress={() => setCarbModalVisible(true)}
                />
                <MacroColumn
                  styles={styles}
                  title="Chất béo"
                  icon={<DropletIcon size={16} color={colors.macroFats} />}
                  current={summary.fat}
                  goal={fatGoal}
                  color={colors.macroFats}
                  onPress={() => setFatModalVisible(true)}
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
                  onPress={() => setSaltModalVisible(true)}
                />
                <MacroColumn
                  styles={styles}
                  title="Đường"
                  icon={<SugarIcon size={17} color={colors.macroSugar} />}
                  current={sugarCurrent}
                  goal={sugarGoal}
                  color={colors.macroSugar}
                  onPress={() => setSugarModalVisible(true)}
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
                  onPress={() => setFiberModalVisible(true)}
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

          {/* ── 5. Hồ sơ & Chỉ số sức khỏe (Health Profile & Biometrics) ── */}
          <HealthProfileCard
            profile={healthProfile}
            conditions={userConditions}
            allergies={userAllergies}
            onPressDetail={() => navigation.navigate('Profile')}
            onPressSetup={() => navigation.navigate('Profile')}
          />

          {/* ── 6. Nhật ký gần đây (Recent Diary) ───────────────────────── */}
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
            <ActivityGrid styles={styles} onSelect={handleSelectActivity} />
          </View>

          {/* ── 7. Two Column Cards: Bước chân & Tập luyện ───────────────── */}
          <View style={styles.twoColRow}>
            <AppCard
              accessibilityLabel="Bước chân"
              onPress={handleStepCardPress}
              style={styles.subCard}
            >
              <View style={styles.workoutTopRow}>
                <AppText variant="labelLg">Bước chân</AppText>
                {isStepConnected && <View style={styles.stepConnectedDot} />}
              </View>

              <View style={styles.workoutMiddle}>
                <AppText variant="headlineSm" style={styles.stepCountValue}>
                  {formatNumber(todaySteps)}
                  <AppText variant="caption" color={colors.textSecondary}> bước</AppText>
                </AppText>
                <View style={styles.workoutDivider} />
              </View>
              <View style={styles.workoutBottomRow}>
                <Image
                  source={images.healthConnectIcon}
                  style={styles.healthConnectMiniIcon}
                  resizeMode="contain"
                  accessibilityLabel="Google Health Connect"
                />
                <AppText variant="caption" color={colors.textSecondary}>
                  {(todaySteps * 0.00075).toFixed(1)} km
                </AppText>
              </View>
            </AppCard>

            <AppCard
              accessibilityLabel="Ghi nhận tập luyện"
              onPress={openWorkoutStatistics}
              style={styles.subCard}
            >
              <View style={styles.workoutTopRow}>
                <AppText variant="labelLg">Tập luyện</AppText>
                <TouchableOpacity
                  style={styles.plusCircleBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    root?.navigate('AddActivity', { date: selectedDate });
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Thêm hoạt động"
                >
                  <PlusIcon size={14} color={colors.onBrand} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
              <View style={styles.workoutMiddle}>
                <AppText
                  variant="bodySm"
                  color={latestActivityName ? colors.textPrimary : colors.textSecondary}
                  numberOfLines={1}
                  style={styles.workoutEmptyText}
                >
                  {latestActivityName || 'Chưa có hoạt động'}
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
                <AppText variant="headlineSm">
                  {summary.waterMl || 0}{' '}
                  <AppText variant="caption" color={colors.textSecondary}>
                    / {waterGoalMl} ml
                  </AppText>
                </AppText>
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
          <AppCard
            accessibilityLabel="Thống kê cân nặng"
            onPress={() => root?.navigate('WeightStatistics')}
            style={styles.weightCard}
          >
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
                  {healthProfile?.targetWeightKg
                    ? `Mục tiêu: ${healthProfile.targetWeightKg} kg (${healthProfile.goalType === 'LOSE_WEIGHT' ? 'Giảm cân' : healthProfile.goalType === 'GAIN_WEIGHT' ? 'Tăng cân' : 'Duy trì'})`
                    : formatWeightDate(state.weightLogs.length > 0 ? state.weightLogs[state.weightLogs.length - 1].date : undefined)}
                </AppText>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cập nhật cân nặng"
                onPress={() => root?.navigate('RecordWeight')}
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

          {/* ── 10. Game Hub & Thử thách (Gamification Section) ─────────── */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <AppText variant="headlineSm">Game Hub</AppText>
                <View
                  style={{
                    backgroundColor: colors.vipStreak,
                    paddingHorizontal: 6,
                    paddingVertical: 1,
                    borderRadius: 8,
                  }}
                >
                  <AppText variant="labelSm" color="#FFFFFF" style={{ fontSize: 9, fontWeight: '700' }}>
                    MỚI
                  </AppText>
                </View>
              </View>
            </View>

            <View style={styles.communityGrid}>
              {/* Featured Game Hub Hero Card */}
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => root?.navigate('GameHub')}
                accessibilityRole="button"
                accessibilityLabel="Vào Game Hub Kallo"
                style={[
                  styles.gameHubHeroCard,
                  {
                    backgroundColor:
                      theme.scheme === 'dark' ? 'rgba(123, 79, 224, 0.16)' : '#F6F1FF',
                    borderColor:
                      theme.scheme === 'dark' ? 'rgba(164, 118, 254, 0.28)' : '#E4DCF9',
                  },
                ]}
              >
                <View
                  style={[
                    styles.gameHubGlowCircle,
                    {
                      backgroundColor:
                        theme.scheme === 'dark'
                          ? 'rgba(158, 100, 247, 0.2)'
                          : 'rgba(123, 79, 224, 0.08)',
                    },
                  ]}
                />

                <View style={styles.gameHubHeroTopRow}>
                  <View style={styles.gameHubIconAndTitle}>
                    <View
                      style={[
                        styles.gameHubIconBox,
                        {
                          backgroundColor:
                            theme.scheme === 'dark'
                              ? 'rgba(164, 118, 254, 0.3)'
                              : '#E9DDFF',
                        },
                      ]}
                    >
                      <GamepadIcon size={24} color={colors.brandPrimary} />
                    </View>
                    <View style={styles.gameHubTitleWrap}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={[styles.gameHubStandingPill, { backgroundColor: colors.brandSoftTint }]}>
                          <AppText variant="labelSm" color={colors.brandPrimary} style={{ fontSize: 10, fontWeight: '700' }}>
                            {userRank ? `Hạng #${userRank}` : 'Chưa có hạng'}
                          </AppText>
                        </View>
                      </View>
                      <AppText variant="caption" color={colors.textSecondary}>
                        {friends.length > 0
                          ? `Đua top bảng xếp hạng cùng ${friends.length} bạn bè`
                          : 'Đua top bảng xếp hạng cùng bạn bè'}
                      </AppText>
                    </View>
                  </View>

                  <View style={[styles.gameHubPointsBadge, { backgroundColor: colors.vipStreakBg }]}>
                    <AppText variant="labelSm" color={colors.vipStreak} style={{ fontWeight: '700' }}>
                      {userPoints ?? 0} đ
                    </AppText>
                  </View>
                </View>

                <View
                  style={[
                    styles.gameHubHeroDivider,
                    {
                      backgroundColor:
                        theme.scheme === 'dark' ? 'rgba(255,255,255,0.08)' : '#EBE5F7',
                    },
                  ]}
                />

                <View style={styles.gameHubHeroBottomRow}>
                  <View style={styles.gameHubHeroGapWrap}>
                    <LightningIcon size={14} color={colors.vipStreak} />
                    {!userRank ? (
                      <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
                        Tham gia thử thách để xuất hiện trên BXH
                      </AppText>
                    ) : userRank === 1 ? (
                      <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
                        Bạn đang dẫn đầu BXH tuần này! 👑
                      </AppText>
                    ) : higherPlayer ? (
                      <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
                        Còn <AppText variant="caption" color={colors.textPrimary} style={{ fontWeight: '700' }}>{pointsToOvertake} đ</AppText> để vượt {higherPlayer.name}
                      </AppText>
                    ) : (
                      <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
                        Hoàn thành thử thách để bứt phá thứ hạng
                      </AppText>
                    )}
                  </View>

                  <View style={styles.gameHubCtaAction}>
                    <AppText variant="labelSm" color={colors.brandPrimary} style={{ fontWeight: '700' }}>
                      Khám phá
                    </AppText>
                    <ChevronRightIcon size={16} color={colors.brandPrimary} />
                  </View>
                </View>
              </TouchableOpacity>

              {/* Active Challenge Card (nếu người dùng có thử thách đang tham gia) */}
              {activeChallenge && (
                <AppCard
                  style={styles.communityCard}
                  onPress={() => root?.navigate('ChallengeDetail', { challengeId: activeChallenge.id })}
                  accessibilityLabel={`Thử thách: ${activeChallenge.title}`}
                >
                  <View
                    style={[
                      styles.communityIconBox,
                      {
                        backgroundColor:
                          activeChallenge.category === 'water'
                            ? colors.brandSoftTint
                            : theme.scheme === 'dark'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(217, 119, 6, 0.12)',
                      },
                    ]}
                  >
                    {activeChallenge.category === 'water' ? (
                      <DropletIcon size={22} color={colors.trackerWater} />
                    ) : (
                      <TrophyIcon size={22} color={colors.vipStreak} />
                    )}
                  </View>
                  <View style={styles.communityTextWrap}>
                    <AppText variant="labelLg" color={colors.textPrimary} numberOfLines={1}>
                      {activeChallenge.title}
                    </AppText>
                    <AppText variant="caption" color={colors.textSecondary}>
                      {activeChallenge.currentProgress.toLocaleString('vi-VN')}/{activeChallenge.targetProgress.toLocaleString('vi-VN')} {activeChallenge.unit} ({activeChallenge.targetProgress > 0 ? Math.min(100, Math.round((activeChallenge.currentProgress / activeChallenge.targetProgress) * 100)) : 0}%)
                    </AppText>
                  </View>
                  <View style={styles.communityRightWrap}>
                    <View style={[styles.incomingBadge, { backgroundColor: colors.vipStreakBg }]}>
                      <AppText variant="labelSm" color={colors.vipStreak} style={{ fontSize: 11, fontWeight: '700' }}>
                        +{activeChallenge.rewardPoints} đ
                      </AppText>
                    </View>
                    <ChevronRightIcon size={20} color={colors.textDisabled} />
                  </View>
                </AppCard>
              )}
            </View>
          </View>
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

      {/* ── Calorie Goal Guide Modal (Calo Mục Tiêu) ──────────────────── */}
      <CalorieGoalGuideModal
        visible={calorieGoalModalVisible}
        onClose={() => setCalorieGoalModalVisible(false)}
      />

      {/* ── Calorie Intake Guide Modal (Calo Nạp Vào) ─────────────────── */}
      <CalorieIntakeGuideModal
        visible={calorieIntakeModalVisible}
        onClose={() => setCalorieIntakeModalVisible(false)}
      />

      {/* ── Workout Guide Modal (Tập Luyện) ─────────────────────────── */}
      <WorkoutGuideModal
        visible={workoutModalVisible}
        onClose={() => setWorkoutModalVisible(false)}
      />

      {/* ── Protein Guide Modal (Chất Đạm) ───────────────────────────── */}
      <ProteinGuideModal
        visible={proteinModalVisible}
        onClose={() => setProteinModalVisible(false)}
      />

      {/* ── Carb Guide Modal (Đường Bột) ─────────────────────────────── */}
      <CarbGuideModal
        visible={carbModalVisible}
        onClose={() => setCarbModalVisible(false)}
      />

      {/* ── Fat Guide Modal (Chất Béo) ───────────────────────────────── */}
      <FatGuideModal
        visible={fatModalVisible}
        onClose={() => setFatModalVisible(false)}
      />

      {/* ── Salt Guide Modal (Muối) ──────────────────────────────────── */}
      <SaltGuideModal
        visible={saltModalVisible}
        onClose={() => setSaltModalVisible(false)}
      />

      {/* ── Sugar Guide Modal (Đường) ─────────────────────────────────── */}
      <SugarGuideModal
        visible={sugarModalVisible}
        onClose={() => setSugarModalVisible(false)}
      />

      {/* ── Fiber Guide Modal (Chất Xơ) ───────────────────────────────── */}
      <FiberGuideModal
        visible={fiberModalVisible}
        onClose={() => setFiberModalVisible(false)}
      />
    </SafeAreaView>
  );
}
