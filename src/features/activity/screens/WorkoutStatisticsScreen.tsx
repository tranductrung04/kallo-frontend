import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseXIcon,
  DropletIcon,
  DumbbellIcon,
  FlameIcon,
  InfoIcon,
  PlusIcon,
  SparklesIcon,
} from '@/components/icons';
import { images } from '@/assets/images';
import { useTheme, type ThemeContextValue } from '@/theme';
import { formatNumber } from '@/features/nutrition/utils';
import { useActivity } from '../ActivityProvider';
import { StepConnectModal } from '../components/StepConnectModal';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutStatistics'>;

type TimeTab = 'week' | 'month' | 'six_months';

export function WorkoutStatisticsScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { state, refreshActivities } = useActivity();

  useEffect(() => {
    void refreshActivities();
  }, [refreshActivities]);

  const isConnected =
    state.syncStatus.healthConnect === 'CONNECTED' ||
    (Platform.OS === 'ios' && state.syncStatus.appleHealth === 'CONNECTED');

  const [activeTab, setActiveTab] = useState<TimeTab>('week');
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, -1 = last week
  const [monthOffset, setMonthOffset] = useState(0); // 0 = current month, -1 = last month
  const [sixMonthsOffset, setSixMonthsOffset] = useState(0); // 0 = current 6 months
  const [showConnectModal, setShowConnectModal] = useState(
    route.params?.openConnectModal ?? !isConnected
  );

  const getCaloriesForDate = (isoDate: string): number => {
    const activityLogs = state.activityLogs.filter((a) => a.date === isoDate);
    const manualCalories = activityLogs.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0);
    const serverTotal =
      state.dailySummary[isoDate]?.activityCalories != null
        ? Math.round(Number(state.dailySummary[isoDate].activityCalories))
        : null;
    return serverTotal ?? manualCalories;
  };

  // 1. Week calculation
  const weekData = useMemo(() => {
    const now = new Date();
    now.setDate(now.getDate() + weekOffset * 7);

    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);

    const days = [];
    const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const todayIso = new Date().toISOString().split('T')[0];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const isoDate = d.toISOString().split('T')[0];
      const cal = getCaloriesForDate(isoDate);
      days.push({
        name: dayNames[i],
        isoDate,
        calories: cal,
        hasData: cal > 0,
        isToday: isoDate === todayIso,
      });
    }

    const startLabel = `${monday.getDate()}/${monday.getMonth() + 1}`;
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const endLabel = `${sunday.getDate()}/${sunday.getMonth() + 1}`;

    const totalThisWeek = days.reduce((sum, d) => sum + d.calories, 0);
    const avg = Math.round(totalThisWeek / 7);

    return {
      dateRangeLabel: `${startLabel} - ${endLabel}`,
      items: days,
      totalCalories: totalThisWeek,
      avgDailyCalories: avg,
      periodLabel: 'Mục tiêu/tuần',
      totalLabel: 'Tổng calo tập luyện',
    };
  }, [weekOffset, state.activityLogs, state.dailySummary]);

  // 2. Month calculation
  const monthData = useMemo(() => {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayIso = new Date().toISOString().split('T')[0];

    const weekRanges = [
      { start: 1, end: 7, name: 'Tuần 1' },
      { start: 8, end: 14, name: 'Tuần 2' },
      { start: 15, end: 21, name: 'Tuần 3' },
      { start: 22, end: 28, name: 'Tuần 4' },
    ];
    if (daysInMonth > 28) {
      weekRanges.push({ start: 29, end: daysInMonth, name: 'Tuần 5' });
    }

    let monthTotalCalories = 0;

    const items = weekRanges.map((w) => {
      let bucketCalories = 0;
      let containsToday = false;

      for (let dayNum = w.start; dayNum <= w.end; dayNum++) {
        const mStr = String(month + 1).padStart(2, '0');
        const dStr = String(dayNum).padStart(2, '0');
        const isoDate = `${year}-${mStr}-${dStr}`;
        const cal = getCaloriesForDate(isoDate);

        if (isoDate === todayIso) {
          containsToday = true;
        }

        bucketCalories += cal;
        monthTotalCalories += cal;
      }

      return {
        name: w.name,
        isoDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(w.start).padStart(2, '0')}`,
        calories: bucketCalories,
        hasData: bucketCalories > 0,
        isToday: containsToday,
      };
    });

    const avg = Math.round(monthTotalCalories / daysInMonth);

    return {
      dateRangeLabel: `Tháng ${month + 1}/${year}`,
      items,
      totalCalories: monthTotalCalories,
      avgDailyCalories: avg,
      periodLabel: 'Mục tiêu/tháng',
      totalLabel: 'Tổng calo tháng này',
    };
  }, [monthOffset, state.activityLogs, state.dailySummary]);

  // 3. Six Months calculation
  const sixMonthsData = useMemo(() => {
    const now = new Date();
    const endTarget = new Date(now.getFullYear(), now.getMonth() + sixMonthsOffset * 6, 1);
    const currentMonthIndex = now.getMonth();
    const currentYear = now.getFullYear();

    let totalPeriodCalories = 0;
    let totalDays = 0;

    const items = [];
    for (let i = 5; i >= 0; i--) {
      const mDate = new Date(endTarget.getFullYear(), endTarget.getMonth() - i, 1);
      const year = mDate.getFullYear();
      const month = mDate.getMonth();
      const daysInM = new Date(year, month + 1, 0).getDate();
      totalDays += daysInM;

      let mCal = 0;
      for (let dayNum = 1; dayNum <= daysInM; dayNum++) {
        const mStr = String(month + 1).padStart(2, '0');
        const dStr = String(dayNum).padStart(2, '0');
        const isoDate = `${year}-${mStr}-${dStr}`;
        mCal += getCaloriesForDate(isoDate);
      }

      totalPeriodCalories += mCal;
      const isCurrentMonth = year === currentYear && month === currentMonthIndex;

      items.push({
        name: `Th ${month + 1}`,
        isoDate: `${year}-${String(month + 1).padStart(2, '0')}-01`,
        calories: mCal,
        hasData: mCal > 0,
        isToday: isCurrentMonth,
      });
    }

    const avg = totalDays > 0 ? Math.round(totalPeriodCalories / totalDays) : 0;
    const firstMonthDate = new Date(endTarget.getFullYear(), endTarget.getMonth() - 5, 1);
    const startRange = `${String(firstMonthDate.getMonth() + 1).padStart(2, '0')}/${firstMonthDate.getFullYear()}`;
    const endRange = `${String(endTarget.getMonth() + 1).padStart(2, '0')}/${endTarget.getFullYear()}`;

    return {
      dateRangeLabel: `${startRange} - ${endRange}`,
      items,
      totalCalories: totalPeriodCalories,
      avgDailyCalories: avg,
      periodLabel: 'Mục tiêu/6 tháng',
      totalLabel: 'Tổng calo 6 tháng này',
    };
  }, [sixMonthsOffset, state.activityLogs, state.dailySummary]);

  // Active view dataset
  const activeViewData = useMemo(() => {
    switch (activeTab) {
      case 'month':
        return monthData;
      case 'six_months':
        return sixMonthsData;
      case 'week':
      default:
        return weekData;
    }
  }, [activeTab, weekData, monthData, sixMonthsData]);

  const handlePrevTime = () => {
    if (activeTab === 'week') {
      setWeekOffset((prev) => prev - 1);
    } else if (activeTab === 'month') {
      setMonthOffset((prev) => prev - 1);
    } else {
      setSixMonthsOffset((prev) => prev - 1);
    }
  };

  const handleNextTime = () => {
    if (activeTab === 'week') {
      setWeekOffset((prev) => Math.min(0, prev + 1));
    } else if (activeTab === 'month') {
      setMonthOffset((prev) => Math.min(0, prev + 1));
    } else {
      setSixMonthsOffset((prev) => Math.min(0, prev + 1));
    }
  };

  const isLatestTime =
    activeTab === 'week'
      ? weekOffset >= 0
      : activeTab === 'month'
      ? monthOffset >= 0
      : sixMonthsOffset >= 0;

  const maxCaloInView = Math.max(...activeViewData.items.map((d) => d.calories), 500);
  const chartMaxScale = Math.ceil(maxCaloInView / 100) * 100;
  const weeklyCalorieGoal = 0; // Default 0 as shown in reference image
  const avgDailyCalories = activeViewData.avgDailyCalories;

  const { totalCaloriesThisWeek, totalCaloriesLastWeek } = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() + diffToMonday);

    let thisWeekTotal = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(thisMonday);
      d.setDate(thisMonday.getDate() + i);
      thisWeekTotal += getCaloriesForDate(d.toISOString().split('T')[0]);
    }

    const lastMonday = new Date(thisMonday);
    lastMonday.setDate(thisMonday.getDate() - 7);
    let lastWeekTotal = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(lastMonday);
      d.setDate(lastMonday.getDate() + i);
      lastWeekTotal += getCaloriesForDate(d.toISOString().split('T')[0]);
    }

    return {
      totalCaloriesThisWeek: thisWeekTotal,
      totalCaloriesLastWeek: lastWeekTotal,
    };
  }, [state.activityLogs, state.dailySummary]);

  return (
    <View style={[styles.container, { paddingTop: Math.max(8, insets.top) }]}>
      <StatusBar
        barStyle={theme.scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={c.canvasBase}
      />

      {/* ── Header ────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.headerBtn}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ChevronLeftIcon size={22} color={c.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Thống kê hoạt động</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('AddActivity')}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.headerBtn}
          accessibilityRole="button"
          accessibilityLabel="Thêm bài tập"
        >
          <PlusIcon size={20} color={c.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(36, insets.bottom + 24) },
        ]}
      >
        {/* ── Timeframe Tabs: Tuần / Tháng / 6 Tháng ─────────── */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabPill, activeTab === 'week' && styles.tabPillActive]}
            onPress={() => setActiveTab('week')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'week' && styles.tabTextActive]}>
              Tuần
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabPill, activeTab === 'month' && styles.tabPillActive]}
            onPress={() => setActiveTab('month')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'month' && styles.tabTextActive]}>
              Tháng
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabPill, activeTab === 'six_months' && styles.tabPillActive]}
            onPress={() => setActiveTab('six_months')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'six_months' && styles.tabTextActive]}>
              6 Tháng
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Date Navigator ─────────────────────────────────── */}
        <View style={styles.dateNavigator}>
          <TouchableOpacity
            onPress={handlePrevTime}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.dateNavBtn}
          >
            <ChevronLeftIcon size={16} color={c.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.dateRangeText}>{activeViewData.dateRangeLabel}</Text>

          <TouchableOpacity
            onPress={handleNextTime}
            disabled={isLatestTime}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[styles.dateNavBtn, isLatestTime && { opacity: 0.3 }]}
          >
            <ChevronRightIcon size={16} color={c.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ── Workout Bar Chart Area ─────────────────────────── */}
        <View style={styles.chartCard}>
          {/* Ambient Glow */}
          <View style={styles.chartAmbientGlow} />

          {/* Y-Axis Grid Lines & Labels */}
          <View style={styles.chartPlotArea}>
            {[1.0, 0.8, 0.6, 0.4, 0.2, 0].map((tick) => {
              const label = tick === 1 ? '1' : tick === 0 ? '0' : tick.toFixed(1).replace('.', ',');
              return (
                <View key={tick} style={styles.gridRow}>
                  <Text style={styles.yAxisLabel}>{label}</Text>
                  <View style={styles.dashedLine} />
                </View>
              );
            })}

            {/* Average Line */}
            {avgDailyCalories > 0 && (
              <View
                style={[
                  styles.avgLineContainer,
                  {
                    bottom: 24 + ((avgDailyCalories / chartMaxScale) * (180 - 24)),
                  },
                ]}
              >
                <View style={styles.avgLineDashed} />
                <View style={styles.avgLineHandle} />
              </View>
            )}

            {/* Bars container */}
            <View style={styles.barsContainer}>
              {activeViewData.items.map((d, idx) => {
                const heightPercent = chartMaxScale > 0 ? Math.min(100, (d.calories / chartMaxScale) * 100) : 0;
                return (
                  <View key={idx} style={styles.barCol}>
                    <View style={styles.barTrack}>
                      {d.calories > 0 && (
                        <View
                          style={[
                            styles.barFill,
                            {
                              height: `${Math.max(8, heightPercent)}%`,
                            },
                          ]}
                        />
                      )}
                    </View>
                    <Text style={[styles.xAxisLabel, d.isToday && styles.xAxisLabelToday]} numberOfLines={1}>
                      {d.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Chart Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={styles.legendDashedLineIcon} />
              <Text style={styles.legendText}>Trung bình mỗi ngày</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={styles.legendBarIcon} />
              <Text style={styles.legendText}>Dữ liệu ghi nhận</Text>
            </View>
          </View>
        </View>

        {/* ── Banner: Connect Health Connect (if not connected) ── */}
        {!isConnected && (
          <TouchableOpacity
            style={styles.connectBanner}
            onPress={() => setShowConnectModal(true)}
            activeOpacity={0.85}
          >
            <View style={styles.healthConnectIconBox}>
              <Image
                source={images.healthConnectIcon}
                style={styles.healthConnectImg}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.connectBannerText}>
              Kết nối Health Connect để tự động cập nhật.{' '}
              <Text style={styles.connectBannerLink}>Kết nối ngay</Text>
            </Text>
          </TouchableOpacity>
        )}

        {/* ── Section: Thống kê calo tập luyện ───────────────── */}
        <View style={styles.sectionCard}>
          {/* Section Header */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.flameBadge}>
              <FlameIcon size={22} color={c.onBrand} />
            </View>

            <View style={styles.sectionHeaderInfo}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Thống kê calo tập luyện</Text>
                <InfoIcon size={16} color={c.textSecondary} />
              </View>
            </View>
          </View>

          {/* 2-Column Stats Row */}
          <View style={styles.twoColStatsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>
                {formatNumber(weeklyCalorieGoal)}{' '}
                <Text style={styles.statUnit}>calo</Text>
              </Text>
              <Text style={styles.statLabel}>{activeViewData.periodLabel}</Text>
            </View>

            <View style={styles.statCol}>
              <Text style={styles.statNumber}>
                {formatNumber(activeViewData.totalCalories)}{' '}
                <Text style={styles.statUnit}>calo</Text>
              </Text>
              <Text style={styles.statLabel}>{activeViewData.totalLabel}</Text>
            </View>
          </View>

          {/* Circular Badges Row */}
          <View style={styles.weekCirclesRow}>
            {activeViewData.items.map((d, idx) => (
              <View key={idx} style={styles.weekDayCircleCol}>
                <Text style={styles.circleDayName} numberOfLines={1}>{d.name}</Text>
                <View
                  style={[
                    styles.dayCircle,
                    d.hasData ? styles.dayCircleActive : styles.dayCircleInactive,
                  ]}
                >
                  {d.hasData ? (
                    <CheckIcon size={12} color={c.onBrand} strokeWidth={3} />
                  ) : null}
                </View>
                <Text style={styles.circleDayValue}>
                  {d.calories > 0 ? formatNumber(d.calories) : '0'}
                </Text>
              </View>
            ))}
          </View>

          {/* Target Status Legend */}
          <View style={styles.targetLegendRow}>
            <View style={styles.targetLegendItem}>
              <View style={[styles.legendDot, { backgroundColor: c.surfaceHigh }]} />
              <Text style={styles.targetLegendText}>Chưa ghi nhận</Text>
            </View>

            <View style={styles.targetLegendItem}>
              <View style={[styles.legendDot, { backgroundColor: c.trackerBurn }]} />
              <Text style={styles.targetLegendText}>Có dữ liệu ghi nhận</Text>
            </View>
          </View>

          {/* Tip Card */}
          <View style={styles.sectionTipCard}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <SparklesIcon size={16} color="#9E64F7" />
              <Text style={[styles.sectionTipText, { flex: 1 }]}>
                Một tuần chưa có dữ liệu - thử dành 15 phút vận động mỗi ngày để làm nóng cơ thể lên nha.
              </Text>
            </View>
          </View>
        </View>

        {/* ── Section: Xu hướng tập luyện của bạn ────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.trendSectionTitle}>Xu hướng tập luyện của bạn</Text>

          {/* Trend 1: Tuần này */}
          <View style={styles.trendBlock}>
            <Text style={styles.trendLabelRed}>CALO TẬP LUYỆN TUẦN NÀY</Text>
            <View style={styles.trendValRow}>
              <FlameIcon size={18} color="#F44E42" />
              <Text style={styles.trendValText}>
                {formatNumber(totalCaloriesThisWeek)} calo/tuần
              </Text>
            </View>
            <View style={styles.trendTrack}>
              <Text style={styles.trendTrackLabel}>Tuần này</Text>
            </View>
          </View>

          {/* Trend 2: Tuần trước */}
          <View style={styles.trendBlock}>
            <Text style={styles.trendLabelMuted}>CALO TẬP LUYỆN TUẦN TRƯỚC</Text>
            <View style={styles.trendValRow}>
              <DropletIcon size={18} color={c.textMuted} />
              <Text style={styles.trendValText}>
                {formatNumber(totalCaloriesLastWeek)} calo/tuần
              </Text>
            </View>
            <View style={styles.trendTrack}>
              <Text style={styles.trendTrackLabel}>Tuần trước</Text>
            </View>
          </View>

          {/* Trend Notice Card */}
          <View style={styles.trendNoticeCard}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <DumbbellIcon size={16} color={c.textMuted} />
              <Text style={[styles.trendNoticeText, { flex: 1 }]}>
                Chưa ghi nhận hoạt động. Bạn có thể vận động một chút để cải thiện xu hướng tập luyện nhé.
              </Text>
            </View>
          </View>
        </View>

        {/* ── Bottom Actions List ───────────────────────────── */}
        <View style={styles.bottomActionsCard}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('ActivityTracker')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionRowTitle}>Nhật ký tập luyện</Text>
            <View style={styles.actionRowRight}>
              <Text style={styles.actionRowValue}>Xem lịch sử</Text>
              <ChevronRightIcon size={16} color={c.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Workout Connect Modal (Image 1) ───────────────── */}
      <StepConnectModal
        visible={showConnectModal}
        type="workout"
        onClose={() => setShowConnectModal(false)}
        onSuccess={() => setShowConnectModal(false)}
      />
    </View>
  );
}

function createStyles(theme: ThemeContextValue) {
  const { colors: c, spacing: s, radii: r } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.canvasBase,
    },
    header: {
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    headerBtn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      color: c.textPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    scrollContent: {
      paddingTop: 8,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: c.surfaceMid,
      borderRadius: 24,
      padding: 4,
      marginHorizontal: 16,
      marginBottom: 14,
    },
    tabPill: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
    },
    tabPillActive: {
      backgroundColor: c.surfaceHigh,
    },
    tabText: {
      color: c.textSecondary,
      fontSize: 14,
      fontWeight: '600',
    },
    tabTextActive: {
      color: c.textPrimary,
      fontWeight: '700',
    },
    dateNavigator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      marginBottom: 14,
    },
    dateNavBtn: {
      padding: 6,
    },
    dateRangeText: {
      color: c.textPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
    chartCard: {
      backgroundColor: c.surfaceMid,
      borderRadius: 16,
      marginHorizontal: 16,
      padding: 16,
      overflow: 'hidden',
      position: 'relative',
      marginBottom: 16,
    },
    chartAmbientGlow: {
      position: 'absolute',
      top: 40,
      left: '25%',
      width: '50%',
      height: 100,
      borderRadius: 50,
      backgroundColor: c.brandPrimary + '1A',
    },
    chartPlotArea: {
      height: 180,
      position: 'relative',
      justifyContent: 'space-between',
    },
    gridRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    yAxisLabel: {
      width: 26,
      color: c.textSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
    dashedLine: {
      flex: 1,
      height: 1,
      borderWidth: 0.5,
      borderColor: c.surfaceBorder,
      borderStyle: 'dashed',
      marginLeft: 6,
    },
    avgLineContainer: {
      position: 'absolute',
      left: 32,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
    },
    avgLineDashed: {
      flex: 1,
      height: 1,
      borderWidth: 0.8,
      borderColor: c.textPrimary,
      borderStyle: 'dashed',
    },
    avgLineHandle: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: c.textPrimary,
      marginLeft: -3,
    },
    barsContainer: {
      position: 'absolute',
      left: 32,
      right: 0,
      top: 0,
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      paddingBottom: 2,
    },
    barCol: {
      flex: 1,
      alignItems: 'center',
      height: '100%',
      justifyContent: 'flex-end',
    },
    barTrack: {
      width: 14,
      height: 150,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    barFill: {
      width: 12,
      backgroundColor: c.trackerBurn,
      borderRadius: 6,
    },
    xAxisLabel: {
      color: c.textSecondary,
      fontSize: 12,
      fontWeight: '600',
      marginTop: 6,
    },
    xAxisLabelToday: {
      color: c.textPrimary,
    },
    legendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      marginTop: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: c.surfaceBorder,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    legendDashedLineIcon: {
      width: 16,
      height: 1,
      borderWidth: 1,
      borderColor: c.textPrimary,
      borderStyle: 'dashed',
    },
    legendBarIcon: {
      width: 6,
      height: 12,
      backgroundColor: c.trackerBurn,
      borderRadius: 2,
    },
    legendText: {
      color: c.textSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
    connectBanner: {
      backgroundColor: c.surfaceHigh,
      borderRadius: 14,
      padding: 12,
      marginHorizontal: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    healthConnectIconBox: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: c.onBrand,
      alignItems: 'center',
      justifyContent: 'center',
    },
    healthConnectImg: {
      width: 26,
      height: 26,
    },
    connectBannerText: {
      flex: 1,
      color: c.textPrimary,
      fontSize: 13,
      lineHeight: 18,
    },
    connectBannerLink: {
      color: c.brandSecondary,
      fontWeight: '700',
    },
    sectionCard: {
      backgroundColor: c.surfaceMid,
      borderRadius: 16,
      marginHorizontal: 16,
      padding: 16,
      marginBottom: 16,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 18,
    },
    flameBadge: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: c.trackerBurn,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionHeaderInfo: {
      flex: 1,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    sectionTitle: {
      color: c.textPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    twoColStatsRow: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 20,
    },
    statCol: {
      flex: 1,
    },
    statNumber: {
      color: c.textPrimary,
      fontSize: 22,
      fontWeight: '800',
    },
    statUnit: {
      color: c.textSecondary,
      fontSize: 13,
      fontWeight: '500',
    },
    statLabel: {
      color: c.textSecondary,
      fontSize: 12,
      marginTop: 4,
    },
    weekCirclesRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 18,
    },
    weekDayCircleCol: {
      flex: 1,
      alignItems: 'center',
      gap: 6,
    },
    circleDayName: {
      color: c.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    dayCircle: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayCircleActive: {
      backgroundColor: c.trackerBurn,
    },
    dayCircleInactive: {
      backgroundColor: c.surfaceHigh,
    },
    circleDayValue: {
      color: c.textSecondary,
      fontSize: 11,
      fontWeight: '500',
    },
    targetLegendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: c.surfaceBorder,
    },
    targetLegendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    targetLegendText: {
      color: c.textSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
    sectionTipCard: {
      backgroundColor: c.surfaceHigh,
      borderRadius: 12,
      padding: 14,
      marginTop: 16,
    },
    sectionTipText: {
      color: c.textPrimary,
      fontSize: 13,
      lineHeight: 20,
    },
    trendSectionTitle: {
      color: c.textPrimary,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 16,
    },
    trendBlock: {
      marginBottom: 16,
    },
    trendLabelRed: {
      color: c.trackerBurn,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    trendLabelMuted: {
      color: c.textSecondary,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    trendValRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 8,
    },
    trendFlameIcon: {
      fontSize: 16,
    },
    trendFlameMutedIcon: {
      fontSize: 16,
      opacity: 0.6,
    },
    trendValText: {
      color: c.textPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    trendTrack: {
      backgroundColor: c.surfaceHigh,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 14,
    },
    trendTrackLabel: {
      color: c.textSecondary,
      fontSize: 13,
      fontWeight: '500',
    },
    trendNoticeCard: {
      backgroundColor: c.surfaceHigh,
      borderRadius: 12,
      padding: 14,
      marginTop: 4,
    },
    trendNoticeText: {
      color: c.textPrimary,
      fontSize: 13,
      lineHeight: 20,
    },
    bottomActionsCard: {
      backgroundColor: c.surfaceMid,
      borderRadius: 16,
      marginHorizontal: 16,
      overflow: 'hidden',
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 18,
    },
    actionRowTitle: {
      color: c.textPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
    actionRowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    actionRowValue: {
      color: c.textSecondary,
      fontSize: 14,
    },
  });
}
