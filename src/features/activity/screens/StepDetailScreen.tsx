import React, { useMemo, useState } from 'react';
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
  ArmchairIcon,
  BodyStickFigureIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseXIcon,
  FlameIcon,
  FootprintsIcon,
  InfoIcon,
  RunningIcon,
} from '@/components/icons';
import { images } from '@/assets/images';
import { useTheme, type ThemeContextValue } from '@/theme';
import { formatNumber } from '@/features/nutrition/utils';
import { useActivity } from '../ActivityProvider';
import { StepConnectModal } from '../components/StepConnectModal';

type Props = NativeStackScreenProps<RootStackParamList, 'StepDetail'>;

type TimeTab = 'week' | 'month' | 'six_months';

const STEP_GOAL_PRESETS = [3000, 5000, 6000, 8000, 10000, 12500];

export function StepDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { state, updateStepGoal, getTotalStepsForDate } = useActivity();

  const isConnected =
    state.syncStatus.healthConnect === 'CONNECTED' ||
    (Platform.OS === 'ios' && state.syncStatus.appleHealth === 'CONNECTED');

  const isIos = Platform.OS === 'ios';
  const providerName = isIos ? 'Apple Health' : 'Health Connect';
  const providerLogo = isIos ? images.appleHealthIcon : images.healthConnectIcon;

  const [activeTab, setActiveTab] = useState<TimeTab>('week');
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, -1 = last week
  const [monthOffset, setMonthOffset] = useState(0); // 0 = current month, -1 = last month
  const [sixMonthsOffset, setSixMonthsOffset] = useState(0); // 0 = current 6 months
  const [showConnectModal, setShowConnectModal] = useState(
    route.params?.openConnectModal ?? !isConnected
  );
  const [showGoalModal, setShowGoalModal] = useState(false);

  const stepGoal = state.stepGoal || 3000;

  const getStepsForDate = (isoDate: string): number => {
    if (getTotalStepsForDate) {
      return getTotalStepsForDate(isoDate);
    }
    const syncLogsForDate = state.syncLogs.filter((l) => l.date === isoDate);
    const totalSyncSteps = syncLogsForDate.reduce((sum, l) => sum + (l.steps || 0), 0);
    return state.dailySummary[isoDate]?.totalSteps != null
      ? state.dailySummary[isoDate].totalSteps
      : totalSyncSteps;
  };

  // 1. Week Data (7 days: T2 - CN)
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
      const steps = getStepsForDate(isoDate);
      days.push({
        name: dayNames[i],
        isoDate,
        steps,
        achieved: steps >= stepGoal,
        isToday: isoDate === todayIso,
      });
    }

    const startLabel = `${monday.getDate()}/${monday.getMonth() + 1}`;
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const endLabel = `${sunday.getDate()}/${sunday.getMonth() + 1}`;

    const totalThisWeek = days.reduce((sum, d) => sum + d.steps, 0);
    const daysWithData = days.filter((d) => d.steps > 0).length || 1;
    const thisWeekAvg = Math.round(totalThisWeek / daysWithData);

    // Calculate last week
    const lastMonday = new Date(monday);
    lastMonday.setDate(monday.getDate() - 7);
    let lastWeekTotal = 0;
    let lastWeekDaysWithData = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(lastMonday);
      d.setDate(lastMonday.getDate() + i);
      const isoDate = d.toISOString().split('T')[0];
      const steps = getStepsForDate(isoDate);
      if (steps > 0) {
        lastWeekTotal += steps;
        lastWeekDaysWithData++;
      }
    }
    const lastWeekAvg =
      lastWeekDaysWithData > 0 ? Math.round(lastWeekTotal / lastWeekDaysWithData) : 0;

    return {
      dateRangeLabel: `${startLabel} - ${endLabel}`,
      items: days,
      primaryAvg: totalThisWeek > 0 ? thisWeekAvg : 0,
      secondaryAvg: lastWeekAvg,
      primaryLabel: 'Trung bình tuần này',
      secondaryLabel: 'Trung bình tuần trước',
    };
  }, [weekOffset, state.syncLogs, state.dailySummary, stepGoal]);

  // 2. Month Data (4 or 5 weeks of the month)
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

    let monthTotalSteps = 0;
    let monthDaysWithData = 0;

    const items = weekRanges.map((w) => {
      let bucketSteps = 0;
      let bucketDaysWithData = 0;
      let containsToday = false;

      for (let dayNum = w.start; dayNum <= w.end; dayNum++) {
        const mStr = String(month + 1).padStart(2, '0');
        const dStr = String(dayNum).padStart(2, '0');
        const isoDate = `${year}-${mStr}-${dStr}`;
        const steps = getStepsForDate(isoDate);

        if (isoDate === todayIso) {
          containsToday = true;
        }

        if (steps > 0) {
          bucketSteps += steps;
          bucketDaysWithData++;
          monthTotalSteps += steps;
          monthDaysWithData++;
        }
      }

      const avgBucketSteps =
        bucketDaysWithData > 0 ? Math.round(bucketSteps / bucketDaysWithData) : 0;

      return {
        name: w.name,
        isoDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(w.start).padStart(2, '0')}`,
        steps: avgBucketSteps,
        achieved: avgBucketSteps >= stepGoal,
        isToday: containsToday,
      };
    });

    const thisMonthAvg =
      monthDaysWithData > 0 ? Math.round(monthTotalSteps / monthDaysWithData) : 0;

    // Last month avg
    const prevMonthDate = new Date(year, month - 1, 1);
    const prevYear = prevMonthDate.getFullYear();
    const prevMonth = prevMonthDate.getMonth();
    const prevDaysInMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
    let prevTotalSteps = 0;
    let prevDaysWithData = 0;
    for (let dayNum = 1; dayNum <= prevDaysInMonth; dayNum++) {
      const mStr = String(prevMonth + 1).padStart(2, '0');
      const dStr = String(dayNum).padStart(2, '0');
      const isoDate = `${prevYear}-${mStr}-${dStr}`;
      const steps = getStepsForDate(isoDate);
      if (steps > 0) {
        prevTotalSteps += steps;
        prevDaysWithData++;
      }
    }
    const lastMonthAvg =
      prevDaysWithData > 0 ? Math.round(prevTotalSteps / prevDaysWithData) : 0;

    return {
      dateRangeLabel: `Tháng ${month + 1}/${year}`,
      items,
      primaryAvg: thisMonthAvg,
      secondaryAvg: lastMonthAvg,
      primaryLabel: 'Trung bình tháng này',
      secondaryLabel: 'Trung bình tháng trước',
    };
  }, [monthOffset, state.syncLogs, state.dailySummary, stepGoal]);

  // 3. Six Months Data (6 months: Th X - Th Y)
  const sixMonthsData = useMemo(() => {
    const now = new Date();
    const endTarget = new Date(now.getFullYear(), now.getMonth() + sixMonthsOffset * 6, 1);
    const currentMonthIndex = now.getMonth();
    const currentYear = now.getFullYear();

    let totalPeriodSteps = 0;
    let totalDaysWithData = 0;

    const items = [];
    for (let i = 5; i >= 0; i--) {
      const mDate = new Date(endTarget.getFullYear(), endTarget.getMonth() - i, 1);
      const year = mDate.getFullYear();
      const month = mDate.getMonth();
      const daysInM = new Date(year, month + 1, 0).getDate();

      let mSteps = 0;
      let mDaysWithData = 0;

      for (let dayNum = 1; dayNum <= daysInM; dayNum++) {
        const mStr = String(month + 1).padStart(2, '0');
        const dStr = String(dayNum).padStart(2, '0');
        const isoDate = `${year}-${mStr}-${dStr}`;
        const steps = getStepsForDate(isoDate);
        if (steps > 0) {
          mSteps += steps;
          mDaysWithData++;
          totalPeriodSteps += steps;
          totalDaysWithData++;
        }
      }

      const avgSteps = mDaysWithData > 0 ? Math.round(mSteps / mDaysWithData) : 0;
      const isCurrentMonth = year === currentYear && month === currentMonthIndex;

      items.push({
        name: `Th ${month + 1}`,
        isoDate: `${year}-${String(month + 1).padStart(2, '0')}-01`,
        steps: avgSteps,
        achieved: avgSteps >= stepGoal,
        isToday: isCurrentMonth,
      });
    }

    const thisSixMonthsAvg =
      totalDaysWithData > 0 ? Math.round(totalPeriodSteps / totalDaysWithData) : 0;

    // Previous 6 months avg
    let prevPeriodSteps = 0;
    let prevDaysWithData = 0;
    for (let i = 11; i >= 6; i--) {
      const mDate = new Date(endTarget.getFullYear(), endTarget.getMonth() - i, 1);
      const year = mDate.getFullYear();
      const month = mDate.getMonth();
      const daysInM = new Date(year, month + 1, 0).getDate();

      for (let dayNum = 1; dayNum <= daysInM; dayNum++) {
        const mStr = String(month + 1).padStart(2, '0');
        const dStr = String(dayNum).padStart(2, '0');
        const isoDate = `${year}-${mStr}-${dStr}`;
        const steps = getStepsForDate(isoDate);
        if (steps > 0) {
          prevPeriodSteps += steps;
          prevDaysWithData++;
        }
      }
    }
    const lastSixMonthsAvg =
      prevDaysWithData > 0 ? Math.round(prevPeriodSteps / prevDaysWithData) : 0;

    const firstMonthDate = new Date(endTarget.getFullYear(), endTarget.getMonth() - 5, 1);
    const startRange = `${String(firstMonthDate.getMonth() + 1).padStart(2, '0')}/${firstMonthDate.getFullYear()}`;
    const endRange = `${String(endTarget.getMonth() + 1).padStart(2, '0')}/${endTarget.getFullYear()}`;

    return {
      dateRangeLabel: `${startRange} - ${endRange}`,
      items,
      primaryAvg: thisSixMonthsAvg,
      secondaryAvg: lastSixMonthsAvg,
      primaryLabel: 'Trung bình 6 tháng này',
      secondaryLabel: 'Trung bình 6 tháng trước',
    };
  }, [sixMonthsOffset, state.syncLogs, state.dailySummary, stepGoal]);

  // Active dataset based on activeTab
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

  // Max scale for chart
  const maxStepsInView = Math.max(
    ...activeViewData.items.map((d) => d.steps),
    stepGoal,
    1000
  );
  const chartMaxScale = Math.ceil(maxStepsInView / 1000) * 1000;
  const avgSteps = activeViewData.primaryAvg;

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
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ChevronLeftIcon size={22} color={c.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Bước chân</Text>

        <View style={styles.headerRightPlaceholder} />
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

        {/* ── Step Bar Chart Area ────────────────────────────── */}
        <View style={styles.chartCard}>
          {/* Y-Axis Grid Lines & Labels */}
          <View style={styles.chartPlotArea}>
            {/* Ticks: 1.0, 0.8, 0.6, 0.4, 0.2, 0 */}
            {[1.0, 0.8, 0.6, 0.4, 0.2, 0].map((tick) => {
              const label = tick === 1 ? '1' : tick === 0 ? '0' : tick.toFixed(1).replace('.', ',');
              return (
                <View key={tick} style={styles.gridRow}>
                  <Text style={styles.yAxisLabel}>{label}</Text>
                  <View style={styles.dashedLine} />
                </View>
              );
            })}

            {/* Average Steps Indicator line */}
            {avgSteps > 0 && (
              <View
                style={[
                  styles.avgLineContainer,
                  {
                    bottom: 24 + ((avgSteps / chartMaxScale) * (180 - 24)),
                  },
                ]}
              >
                <View style={styles.avgLineDashed} />
                <View style={styles.avgLineHandle} />
              </View>
            )}

            {/* Bars container overlaying plot */}
            <View style={styles.barsContainer}>
              {activeViewData.items.map((d, idx) => {
                const heightPercent = chartMaxScale > 0 ? Math.min(100, (d.steps / chartMaxScale) * 100) : 0;
                return (
                  <View key={idx} style={styles.barCol}>
                    <View style={styles.barTrack}>
                      {d.steps > 0 && (
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
              <Text style={styles.legendText}>Bước trung bình</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={styles.legendBarIcon} />
              <Text style={styles.legendText}>Dữ liệu ghi nhận</Text>
            </View>
          </View>
        </View>

        {/* ── Banner: Connect Health Connect or show connection status ── */}
        {isConnected ? (
          <TouchableOpacity
            style={[styles.connectedBanner, { backgroundColor: c.surfaceHigh, borderColor: c.surfaceBorder }]}
            onPress={() => navigation.navigate('HealthSync')}
            activeOpacity={0.85}
          >
            <View style={styles.healthConnectIconBox}>
              <Image
                source={providerLogo}
                style={styles.healthConnectImg}
                resizeMode="contain"
              />
            </View>
            <View style={styles.connectedBannerInfo}>
              <View style={styles.connectedTitleRow}>
                <Text style={[styles.connectedBannerTitle, { color: c.textPrimary }]}>
                  {providerName} • Đã kết nối
                </Text>
                <View style={[styles.connectedDot, { backgroundColor: c.quickScanner }]} />
              </View>
              <Text style={[styles.connectedBannerSub, { color: c.textSecondary }]}>
                Chạm để xem chi tiết hoặc đồng bộ dữ liệu
              </Text>
            </View>
            <ChevronRightIcon size={18} color={c.textSecondary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.connectBanner}
            onPress={() => setShowConnectModal(true)}
            activeOpacity={0.85}
          >
            <View style={styles.healthConnectIconBox}>
              <Image
                source={providerLogo}
                style={styles.healthConnectImg}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.connectBannerText}>
              Kết nối {providerName} để tự động cập nhật.{' '}
              <Text style={styles.connectBannerLink}>Kết nối ngay</Text>
            </Text>
          </TouchableOpacity>
        )}

        {/* ── Section: Thống kê bước chân ───────────────────── */}
        <View style={styles.sectionCard}>
          {/* Section Header */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.footprintsBadge}>
              <FootprintsIcon size={20} color={c.onBrand} />
            </View>

            <View style={styles.sectionHeaderInfo}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Thống kê bước chân</Text>
                <InfoIcon size={16} color={c.textSecondary} />
              </View>
              <Text style={styles.sectionSubtitle}>
                Mục tiêu: {formatNumber(stepGoal)} bước/ngày
              </Text>
            </View>
          </View>

          {/* 2-Column Stats Row */}
          <View style={styles.twoColStatsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>
                {formatNumber(activeViewData.primaryAvg)}{' '}
                <Text style={styles.statUnit}>bước/ngày</Text>
              </Text>
              <Text style={styles.statLabel}>{activeViewData.primaryLabel}</Text>
            </View>

            <View style={styles.statCol}>
              <Text style={styles.statNumber}>
                {formatNumber(activeViewData.secondaryAvg)}{' '}
                <Text style={styles.statUnit}>bước/ngày</Text>
              </Text>
              <Text style={styles.statLabel}>{activeViewData.secondaryLabel}</Text>
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
                    d.achieved ? styles.dayCircleAchieved : styles.dayCircleUnachieved,
                  ]}
                >
                  {d.achieved ? (
                    <CheckIcon size={12} color={c.onBrand} strokeWidth={3} />
                  ) : null}
                </View>
                <Text style={styles.circleDayValue}>
                  {d.steps > 0 ? formatNumber(d.steps) : '-'}
                </Text>
              </View>
            ))}
          </View>

          {/* Target Status Legend */}
          <View style={styles.targetLegendRow}>
            <View style={styles.targetLegendItem}>
              <View style={[styles.legendDot, { backgroundColor: c.surfaceHigh }]} />
              <Text style={styles.targetLegendText}>Chưa đạt</Text>
            </View>

            <View style={styles.targetLegendItem}>
              <View style={[styles.legendDot, { backgroundColor: c.quickScanner }]} />
              <Text style={styles.targetLegendText}>Đạt mục tiêu</Text>
            </View>
          </View>
        </View>

        {/* ── Tip Banner: Kallo sync notice ───────────────────── */}
        <TouchableOpacity
          style={styles.tipNoticeBanner}
          onPress={() => {
            if (!isConnected) setShowConnectModal(true);
          }}
          activeOpacity={0.9}
        >
          <Text style={styles.tipNoticeText}>
            Kallo có thể tự động bộ bước chân từ Health Connect.{' '}
            <Text style={styles.tipNoticeLink}>Kết nối ngay</Text> để ghi lại bước chân mỗi ngày.
          </Text>
        </TouchableOpacity>

        {/* ── Section: Bước chân & mức độ hoạt động ──────────── */}
        <View style={styles.activityLevelSection}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Bước chân & mức độ hoạt động</Text>
            <InfoIcon size={16} color={c.textSecondary} />
          </View>

          {/* Activity Level Tiers */}
          <View style={styles.activityTiersList}>
            {/* Level 1: Ít vận động */}
            <View style={styles.activityTierRow}>
              <View style={[styles.activityPill, { backgroundColor: c.surfaceHigh, borderColor: c.macroProtein, borderWidth: 1 }]}>
                <ArmchairIcon size={14} color={c.macroProtein} />
                <Text style={[styles.activityPillText, { color: c.macroProtein }]}>ÍT VẬN ĐỘNG</Text>
              </View>
              <Text style={styles.activityTierRange}>{'< 3,000'}</Text>
            </View>

            {/* Level 2: Nhẹ nhàng */}
            <View style={styles.activityTierRow}>
              <View style={[styles.activityPill, { backgroundColor: c.surfaceHigh, borderColor: c.macroFats, borderWidth: 1 }]}>
                <BodyStickFigureIcon size={14} color={c.macroFats} />
                <Text style={[styles.activityPillText, { color: c.macroFats }]}>NHẸ NHÀNG</Text>
              </View>
              <Text style={styles.activityTierRange}>3,000 - 6,499</Text>
            </View>

            {/* Level 3: Trung bình */}
            <View style={styles.activityTierRow}>
              <View style={[styles.activityPill, { backgroundColor: c.surfaceHigh, borderColor: c.macroCarbs, borderWidth: 1 }]}>
                <FootprintsIcon size={14} color={c.macroCarbs} />
                <Text style={[styles.activityPillText, { color: c.macroCarbs }]}>TRUNG BÌNH</Text>
              </View>
              <Text style={styles.activityTierRange}>6,500 - 9,999</Text>
            </View>

            {/* Level 4: Rất năng động */}
            <View style={styles.activityTierRow}>
              <View style={[styles.activityPill, { backgroundColor: c.surfaceHigh, borderColor: c.macroFiber, borderWidth: 1 }]}>
                <RunningIcon size={14} color={c.macroFiber} />
                <Text style={[styles.activityPillText, { color: c.macroFiber }]}>RẤT NĂNG ĐỘNG</Text>
              </View>
              <Text style={styles.activityTierRange}>10,000 - 12,499</Text>
            </View>

            {/* Level 5: Cực kỳ năng động */}
            <View style={styles.activityTierRow}>
              <View style={[styles.activityPill, { backgroundColor: c.surfaceHigh, borderColor: c.brandSecondary, borderWidth: 1 }]}>
                <FlameIcon size={14} color={c.brandSecondary} />
                <Text style={[styles.activityPillText, { color: c.brandSecondary }]}>CỰC KỲ NĂNG ĐỘNG</Text>
              </View>
              <Text style={styles.activityTierRange}>{'> 12,500'}</Text>
            </View>

          </View>

          {/* Explanatory Footnote */}
          <Text style={styles.activityFootnote}>
            *** Bảng này giúp bạn hiểu bạn đang vận động ở mức nào dựa trên số bước trung bình mỗi ngày từ đó dễ hình dung mức calo tiêu hao tự nhiên (NEAT) của cơ thể.
          </Text>
        </View>

        {/* ── Bottom Actions List ───────────────────────────── */}
        <View style={styles.bottomActionsCard}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => setShowGoalModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionRowTitle}>Điều chỉnh mục tiêu</Text>
            <View style={styles.actionRowRight}>
              <Text style={styles.actionRowValue}>{formatNumber(stepGoal)} bước</Text>
              <ChevronRightIcon size={16} color={c.textSecondary} />
            </View>
          </TouchableOpacity>

          <View style={styles.actionDivider} />

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('ActivityTracker')}
            activeOpacity={0.7}
          >
            {/* <Text style={styles.actionRowTitle}>Nhật ký bước chân</Text>
            <View style={styles.actionRowRight}>
              <Text style={styles.actionRowValue}>Xem lịch sử</Text>
              <ChevronRightIcon size={16} color={c.textSecondary} />
            </View> */}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Connect Modal (Image 1) ────────────────────────── */}
      <StepConnectModal
        visible={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onSuccess={() => setShowConnectModal(false)}
      />

      {/* ── Goal Selector Modal ────────────────────────────── */}
      <Modal
        visible={showGoalModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowGoalModal(false)} />
          <View style={styles.goalModalContent}>
            <View style={styles.goalModalHeader}>
              <Text style={styles.goalModalTitle}>Chọn mục tiêu bước chân</Text>
              <TouchableOpacity onPress={() => setShowGoalModal(false)}>
                <CloseXIcon size={20} color={c.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.goalPresetsList}>
              {STEP_GOAL_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.goalPresetItem,
                    stepGoal === preset && styles.goalPresetItemActive,
                  ]}
                  onPress={() => {
                    updateStepGoal(preset);
                    setShowGoalModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.goalPresetText,
                      stepGoal === preset && styles.goalPresetTextActive,
                    ]}
                  >
                    {formatNumber(preset)} bước / ngày
                  </Text>
                  {stepGoal === preset && <CheckIcon size={14} color={c.brandSecondary} strokeWidth={3} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
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
    backBtn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    headerTitle: {
      color: c.textPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    headerRightPlaceholder: {
      width: 40,
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
      backgroundColor: c.quickScanner,
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
      backgroundColor: c.quickScanner,
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
    connectedBanner: {
      borderRadius: 14,
      padding: 12,
      marginHorizontal: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      gap: 12,
    },
    connectedBannerInfo: {
      flex: 1,
    },
    connectedTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 2,
    },
    connectedBannerTitle: {
      fontSize: 13,
      fontWeight: '700',
    },
    connectedDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    connectedBannerSub: {
      fontSize: 12,
      fontWeight: '500',
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
    footprintsBadge: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: c.quickScanner,
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
    sectionSubtitle: {
      color: c.textSecondary,
      fontSize: 13,
      marginTop: 2,
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
    dayCircleAchieved: {
      backgroundColor: c.quickScanner,
    },
    dayCircleUnachieved: {
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
    tipNoticeBanner: {
      backgroundColor: c.surfaceHigh,
      borderRadius: 12,
      padding: 14,
      marginHorizontal: 16,
      marginBottom: 18,
    },
    tipNoticeText: {
      color: c.textPrimary,
      fontSize: 13,
      lineHeight: 20,
    },
    tipNoticeLink: {
      color: c.brandSecondary,
      fontWeight: '700',
    },
    activityLevelSection: {
      backgroundColor: c.surfaceMid,
      borderRadius: 16,
      marginHorizontal: 16,
      padding: 16,
      marginBottom: 16,
    },
    activityTiersList: {
      marginTop: 14,
      gap: 10,
    },
    activityTierRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    activityPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 16,
      gap: 6,
    },
    activityPillIcon: {
      fontSize: 14,
    },
    activityPillText: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    activityTierRange: {
      color: c.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    activityFootnote: {
      color: c.textSecondary,
      fontSize: 11.5,
      lineHeight: 18,
      marginTop: 14,
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
    actionDivider: {
      height: 1,
      backgroundColor: c.surfaceBorder,
      marginLeft: 16,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    goalModalContent: {
      width: '100%',
      backgroundColor: c.surfaceMid,
      borderRadius: 20,
      padding: 20,
    },
    goalModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    goalModalTitle: {
      color: c.textPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    goalPresetsList: {
      gap: 8,
    },
    goalPresetItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: c.surfaceHigh,
    },
    goalPresetItemActive: {
      backgroundColor: c.brandPrimary + '26',
      borderWidth: 1,
      borderColor: c.brandSecondary,
    },
    goalPresetText: {
      color: c.textPrimary,
      fontSize: 15,
      fontWeight: '500',
    },
    goalPresetTextActive: {
      color: c.textPrimary,
      fontWeight: '700',
    },
  });
}
