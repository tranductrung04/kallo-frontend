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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import type { RootStackParamList } from '@/navigation/types';
import {
  CircleAlertIcon,
  CircleCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseXIcon,
  InfoIcon,
  PlusIcon,
  TriangleAlertIcon,
} from '@/components/icons';
import { images } from '@/assets/images';
import { useTheme, type ThemeContextValue } from '@/theme';
import { formatNumber, todayKey } from '@/features/nutrition/utils';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { useActivity } from '../ActivityProvider';
import { StepConnectModal } from '../components/StepConnectModal';
import { ShareJourneyModal } from '../components/ShareJourneyModal';
import { useAlert, AppText } from '@/components/common';

type Props = NativeStackScreenProps<RootStackParamList, 'WeightStatistics'>;

type TimeTab = '1_month' | '6_months' | '12_months';

export function WeightStatisticsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { state: nutritionState, addWeight } = useNutrition();
  const { state: activityState, refreshWeightLogs } = useActivity();
  const { showAlert } = useAlert();

  useEffect(() => {
    void refreshWeightLogs();
  }, [refreshWeightLogs]);

  const isConnected =
    activityState.syncStatus.healthConnect === 'CONNECTED' ||
    (Platform.OS === 'ios' && activityState.syncStatus.appleHealth === 'CONNECTED');

  const [activeTab, setActiveTab] = useState<TimeTab>('1_month');
  const [monthOffset, setMonthOffset] = useState(0); // 0 = current month
  const [sixMonthsOffset, setSixMonthsOffset] = useState(0);
  const [yearOffset, setYearOffset] = useState(0);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [plotAreaWidth, setPlotAreaWidth] = useState(260);

  // Weight logs sorted chronologically (oldest to newest)
  const sortedWeightLogs = useMemo(() => {
    const raw: Array<{ date?: string; loggedAt?: string; weightKg: number }> =
      activityState.weightLogs && activityState.weightLogs.length > 0
        ? activityState.weightLogs
        : (nutritionState.weightLogs as unknown as Array<{ date?: string; loggedAt?: string; weightKg: number }>) || [];

    const map = new Map<string, number>();
    for (const item of raw) {
      const d = item.date || (item.loggedAt ? item.loggedAt.split('T')[0] : '');
      if (d) {
        map.set(d, Number(item.weightKg));
      }
    }

    const list = Array.from(map.entries()).map(([date, weightKg]) => ({
      date,
      weightKg,
    }));

    return list.sort((a, b) => a.date.localeCompare(b.date));
  }, [activityState.weightLogs, nutritionState.weightLogs]);

  const handlePrevTime = () => {
    if (activeTab === '1_month') setMonthOffset((prev) => prev - 1);
    else if (activeTab === '6_months') setSixMonthsOffset((prev) => prev - 1);
    else setYearOffset((prev) => prev - 1);
  };

  const handleNextTime = () => {
    if (activeTab === '1_month') setMonthOffset((prev) => Math.min(0, prev + 1));
    else if (activeTab === '6_months') setSixMonthsOffset((prev) => Math.min(0, prev + 1));
    else setYearOffset((prev) => Math.min(0, prev + 1));
  };

  const isLatestTime =
    activeTab === '1_month'
      ? monthOffset >= 0
      : activeTab === '6_months'
        ? sixMonthsOffset >= 0
        : yearOffset >= 0;

  const latestWeight =
    sortedWeightLogs.length > 0
      ? sortedWeightLogs[sortedWeightLogs.length - 1].weightKg
      : 50;
  const initialWeight =
    sortedWeightLogs.length > 0 ? sortedWeightLogs[0].weightKg : latestWeight;
  const weightDifference = Number((latestWeight - initialWeight).toFixed(1));

  // Target weight (default 60kg from screenshot / goal)
  const targetWeight = 60;

  // Real chart data points based on timeframe tab
  const { chartPoints, timeInfo } = useMemo(() => {
    const now = new Date();

    if (activeTab === '6_months') {
      const endTarget = new Date(now.getFullYear(), now.getMonth() + sixMonthsOffset * 6, 1);
      const startTarget = new Date(endTarget.getFullYear(), endTarget.getMonth() - 5, 1);
      const startLabel = `${String(startTarget.getMonth() + 1).padStart(2, '0')}/${startTarget.getFullYear()}`;
      const endLabel = `${String(endTarget.getMonth() + 1).padStart(2, '0')}/${endTarget.getFullYear()}`;

      const xLabels: string[] = [];
      const points: Array<{
        date: string;
        label: string;
        weightKg: number;
        xPercent: number;
      }> = [];

      for (let i = 5; i >= 0; i--) {
        const m = new Date(endTarget.getFullYear(), endTarget.getMonth() - i, 1);
        const y = m.getFullYear();
        const mon = m.getMonth();
        const prefix = `${y}-${String(mon + 1).padStart(2, '0')}`;
        const lbl = `Th ${mon + 1}`;
        xLabels.push(lbl);

        const inMonth = sortedWeightLogs.filter((l) => l.date.startsWith(prefix));
        if (inMonth.length > 0) {
          const latestInMonth = inMonth[inMonth.length - 1];
          points.push({
            date: latestInMonth.date,
            label: lbl,
            weightKg: latestInMonth.weightKg,
            xPercent: (5 - i) / 5,
          });
        }
      }

      return {
        chartPoints: points,
        timeInfo: {
          label: `${startLabel} - ${endLabel}`,
          xLabels,
        },
      };
    }

    if (activeTab === '12_months') {
      const targetYear = now.getFullYear() + yearOffset;
      const xLabels = ['T1', 'T3', 'T5', 'T7', 'T9', 'T11'];
      const points: Array<{
        date: string;
        label: string;
        weightKg: number;
        xPercent: number;
      }> = [];

      for (let m = 0; m < 12; m++) {
        const prefix = `${targetYear}-${String(m + 1).padStart(2, '0')}`;
        const inMonth = sortedWeightLogs.filter((l) => l.date.startsWith(prefix));
        if (inMonth.length > 0) {
          const latestInMonth = inMonth[inMonth.length - 1];
          points.push({
            date: latestInMonth.date,
            label: `T${m + 1}`,
            weightKg: latestInMonth.weightKg,
            xPercent: m / 11,
          });
        }
      }

      return {
        chartPoints: points,
        timeInfo: {
          label: `Năm ${targetYear}`,
          xLabels,
        },
      };
    }

    // Default: 1_month
    const d = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const y = d.getFullYear();
    const mon = d.getMonth();
    const daysInMonth = new Date(y, mon + 1, 0).getDate();
    const prefix = `${y}-${String(mon + 1).padStart(2, '0')}`;

    const monthLogs = sortedWeightLogs.filter((l) => l.date.startsWith(prefix));
    const points: Array<{
      date: string;
      label: string;
      weightKg: number;
      xPercent: number;
    }> = [];

    for (const log of monthLogs) {
      const parts = log.date.split('-');
      const day = parseInt(parts[2], 10);
      if (!isNaN(day)) {
        const xPercent = daysInMonth > 1 ? (day - 1) / (daysInMonth - 1) : 0.5;
        points.push({
          date: log.date,
          label: `Ngày ${day}`,
          weightKg: log.weightKg,
          xPercent,
        });
      }
    }

    return {
      chartPoints: points,
      timeInfo: {
        label: `Tháng ${mon + 1}/${y}`,
        xLabels: ['01', '05', '10', '15', '20', '25', String(daysInMonth).padStart(2, '0')],
      },
    };
  }, [activeTab, monthOffset, sixMonthsOffset, yearOffset, sortedWeightLogs]);

  // Dynamic Y-axis scale based on actual weights and target
  const { minScale, maxScale, weightTicks } = useMemo(() => {
    const weightsToConsider = [targetWeight];
    if (chartPoints.length > 0) {
      chartPoints.forEach((p) => weightsToConsider.push(p.weightKg));
    } else {
      weightsToConsider.push(latestWeight);
    }

    const minW = Math.min(...weightsToConsider);
    const maxW = Math.max(...weightsToConsider);
    const span = Math.max(8, maxW - minW + 2);

    let step = 3;
    if (span <= 12) step = 3;
    else if (span <= 16) step = 4;
    else if (span <= 20) step = 5;
    else if (span <= 32) step = 8;
    else step = Math.ceil(span / 4 / 5) * 5;

    let minScale = Math.floor((minW - 1) / step) * step;
    let maxScale = minScale + step * 4;

    while (maxScale < maxW + 0.5) {
      maxScale += step;
      minScale += step;
    }

    const ticks = [
      maxScale,
      minScale + step * 3,
      minScale + step * 2,
      minScale + step,
      minScale,
    ];

    return { minScale, maxScale, weightTicks: ticks };
  }, [chartPoints, targetWeight, latestWeight]);

  // BMI calculation (default height 170cm = 1.7m)
  const heightM = 1.7;
  const bmiValue = Number((latestWeight / (heightM * heightM)).toFixed(1));

  const bmiStatus = useMemo(() => {
    if (bmiValue < 18.5) return { label: 'Thiếu cân', color: c.statusWarning, type: 'warning' as const };
    if (bmiValue <= 24.9) return { label: 'Bình thường', color: c.quickScanner, type: 'normal' as const };
    if (bmiValue <= 29.9) return { label: 'Thừa cân', color: c.statusWarning, type: 'warning' as const };
    return { label: 'Béo phì', color: c.statusDanger, type: 'danger' as const };
  }, [bmiValue, c]);

  // BMI Y-axis ticks dynamic around current BMI
  const { bmiTicks, minBmiTick, maxBmiTick } = useMemo(() => {
    const base = Math.floor((bmiValue - 1.5) * 2) / 2;
    const ticks = [];
    for (let i = 6; i >= 0; i--) {
      ticks.push(Number((base + i * 0.5).toFixed(1)));
    }
    return {
      bmiTicks: ticks,
      minBmiTick: ticks[ticks.length - 1],
      maxBmiTick: ticks[0],
    };
  }, [bmiValue]);

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

        <Text style={styles.headerTitle}>Thống kê cân nặng</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('RecordWeight')}
          style={styles.headerUpdateBtn}
          accessibilityRole="button"
          accessibilityLabel="Cập nhật cân nặng"
          activeOpacity={0.8}
        >
          <AppText variant="labelLg" color={c.onBrand} style={styles.headerUpdateBtnText}>
            Cập nhật
          </AppText>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(36, insets.bottom + 24) },
        ]}
      >
        {/* ── Timeframe Tabs: 1 tháng / 6 tháng / 12 tháng ─────── */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabPill, activeTab === '1_month' && styles.tabPillActive]}
            onPress={() => setActiveTab('1_month')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === '1_month' && styles.tabTextActive]}>
              1 tháng
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabPill, activeTab === '6_months' && styles.tabPillActive]}
            onPress={() => setActiveTab('6_months')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === '6_months' && styles.tabTextActive]}>
              6 tháng
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabPill, activeTab === '12_months' && styles.tabPillActive]}
            onPress={() => setActiveTab('12_months')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === '12_months' && styles.tabTextActive]}>
              12 tháng
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Month Navigator ─────────────────────────────────── */}
        <View style={styles.dateNavigator}>
          <TouchableOpacity
            onPress={handlePrevTime}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.dateNavBtn}
          >
            <ChevronLeftIcon size={16} color={c.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.dateRangeText}>{timeInfo.label}</Text>

          <TouchableOpacity
            onPress={handleNextTime}
            disabled={isLatestTime}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[styles.dateNavBtn, isLatestTime && { opacity: 0.3 }]}
          >
            <ChevronRightIcon size={16} color={c.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ── Section Title: Biểu đồ cân nặng ─────────────────── */}
        <Text style={styles.sectionHeading}>Biểu đồ cân nặng</Text>

        {/* ── Weight Line Chart Area ─────────────────────────── */}
        <View style={styles.chartCard}>
          {/* Plot Area */}
          <View
            style={styles.chartPlotArea}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              if (w > 60) setPlotAreaWidth(w - 38);
            }}
          >
            {/* Horizontal Dashed Lines with Ticks */}
            {weightTicks.map((tick) => (
              <View key={tick} style={styles.gridRow}>
                <Text style={styles.yAxisLabel}>{tick}</Text>
                <View style={styles.dashedLine} />
              </View>
            ))}

            {/* SVG Plot Overlay: Target Line + Real Weight Data */}
            <View style={styles.chartSvgOverlay} pointerEvents="none">
              <Svg width={plotAreaWidth} height={180}>
                <Defs>
                  <LinearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={c.brandSecondary} stopOpacity="0.4" />
                    <Stop offset="1" stopColor={c.brandSecondary} stopOpacity="0.0" />
                  </LinearGradient>
                </Defs>

                {/* Target Weight Line (horizontal line with hollow circle handle) */}
                {(() => {
                  const targetFraction = Math.max(
                    0,
                    Math.min(1, (targetWeight - minScale) / (maxScale - minScale))
                  );
                  const targetY = 180 - targetFraction * 180;
                  return (
                    <React.Fragment>
                      <Line
                        x1={0}
                        y1={targetY}
                        x2={plotAreaWidth - 10}
                        y2={targetY}
                        stroke={c.textPrimary}
                        strokeWidth={2}
                      />
                      <Circle
                        cx={plotAreaWidth - 6}
                        cy={targetY}
                        r={5}
                        stroke={c.textPrimary}
                        strokeWidth={2}
                        fill={c.surfaceMid}
                      />
                    </React.Fragment>
                  );
                })()}

                {/* Real Data Points and Connecting Curve */}
                {(() => {
                  const mapped = chartPoints.map((p) => {
                    const x = Math.max(
                      10,
                      Math.min(plotAreaWidth - 14, p.xPercent * (plotAreaWidth - 28) + 14)
                    );
                    const fraction = Math.max(
                      0,
                      Math.min(1, (p.weightKg - minScale) / (maxScale - minScale))
                    );
                    const y = 180 - fraction * 180;
                    return { ...p, x, y };
                  });

                  if (mapped.length === 0) {
                    const latestFrac = Math.max(
                      0,
                      Math.min(1, (latestWeight - minScale) / (maxScale - minScale))
                    );
                    const latestY = 180 - latestFrac * 180;
                    return (
                      <Line
                        x1={0}
                        y1={latestY}
                        x2={plotAreaWidth}
                        y2={latestY}
                        stroke={c.brandSecondary}
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        opacity={0.35}
                      />
                    );
                  }

                  if (mapped.length === 1) {
                    const pt = mapped[0];
                    return (
                      <React.Fragment>
                        <Line
                          x1={0}
                          y1={pt.y}
                          x2={plotAreaWidth}
                          y2={pt.y}
                          stroke={c.brandSecondary}
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          opacity={0.5}
                        />
                        <Circle cx={pt.x} cy={pt.y} r={9} fill={c.brandSecondary} opacity={0.25} />
                        <Circle
                          cx={pt.x}
                          cy={pt.y}
                          r={5}
                          fill={c.brandSecondary}
                          stroke={c.surfaceMid}
                          strokeWidth={2}
                        />
                      </React.Fragment>
                    );
                  }

                  const pathD = mapped
                    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
                    .join(' ');
                  const areaD = `${pathD} L ${mapped[mapped.length - 1].x.toFixed(1)} 180 L ${mapped[0].x.toFixed(1)} 180 Z`;

                  return (
                    <React.Fragment>
                      <Path d={areaD} fill="url(#weightGradient)" />
                      <Path d={pathD} stroke={c.brandSecondary} strokeWidth={2.5} fill="none" />
                      {mapped.map((pt, idx) => {
                        const isLast = idx === mapped.length - 1;
                        return (
                          <React.Fragment key={idx}>
                            <Circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isLast ? 8 : 4.5}
                              fill={c.brandSecondary}
                              opacity={isLast ? 0.25 : 1}
                            />
                            <Circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isLast ? 5 : 3.5}
                              fill={c.brandSecondary}
                              stroke={c.surfaceMid}
                              strokeWidth={1.5}
                            />
                          </React.Fragment>
                        );
                      })}
                    </React.Fragment>
                  );
                })()}
              </Svg>

              {/* Value Badge above the latest recorded point */}
              {chartPoints.length > 0 && (() => {
                const mapped = chartPoints.map((p) => {
                  const x = Math.max(
                    10,
                    Math.min(plotAreaWidth - 14, p.xPercent * (plotAreaWidth - 28) + 14)
                  );
                  const fraction = Math.max(
                    0,
                    Math.min(1, (p.weightKg - minScale) / (maxScale - minScale))
                  );
                  const y = 180 - fraction * 180;
                  return { ...p, x, y };
                });
                const lastPt = mapped[mapped.length - 1];
                return (
                  <View
                    style={[
                      styles.pointBadge,
                      {
                        left: Math.max(0, Math.min(plotAreaWidth - 56, lastPt.x - 28)),
                        top: Math.max(2, lastPt.y - 30),
                      },
                    ]}
                  >
                    <Text style={styles.pointBadgeText}>{lastPt.weightKg} kg</Text>
                  </View>
                );
              })()}
            </View>
          </View>

          {/* X-axis labels */}
          <View style={styles.xAxisRow}>
            {timeInfo.xLabels.map((lbl) => (
              <Text key={lbl} style={styles.xAxisLabel}>{lbl}</Text>
            ))}
          </View>

          {/* Chart Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={styles.legendTargetIcon}>
                <View style={styles.legendLineWhite} />
                <View style={styles.legendHollowCircle} />
                <View style={styles.legendLineWhite} />
              </View>
              <Text style={styles.legendText}>Đường mục tiêu</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={styles.legendRecordedIcon}>
                <View style={styles.legendLinePurple} />
                <View style={styles.legendSolidDot} />
                <View style={styles.legendLinePurple} />
              </View>
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

        {/* ── 3 Stats Cards: BAN ĐẦU | HIỆN TẠI | THAY ĐỔI ─────── */}
        <View style={styles.threeStatsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statBoxLabel}>BAN ĐẦU</Text>
            <Text style={styles.statBoxValue}>
              {formatNumber(initialWeight)}{' '}
              <Text style={styles.statBoxUnit}>kg</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => navigation.navigate('RecordWeight')}
            activeOpacity={0.7}
          >
            <Text style={styles.statBoxLabel}>HIỆN TẠI</Text>
            <Text style={styles.statBoxValue}>
              {formatNumber(latestWeight)}{' '}
              <Text style={styles.statBoxUnit}>kg</Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.statBox}>
            <Text style={styles.statBoxLabel}>THAY ĐỔI</Text>
            <Text style={styles.statBoxValue}>
              {weightDifference > 0 ? `+${weightDifference}` : `${weightDifference}`}{' '}
              <Text style={styles.statBoxUnit}>kg</Text>
            </Text>
          </View>
        </View>

        {/* ── Section: Hình ảnh tiến trình ────────────────────── */}
        <Text style={styles.sectionHeading}>Hình ảnh tiến trình</Text>

        <View style={styles.progressPhotosRow}>
          <TouchableOpacity
            style={styles.addPhotoDashedBtn}
            onPress={() => navigation.navigate('RecordWeight')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Ghi lại cân nặng"
          >
            <PlusIcon size={24} color={c.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Chia sẻ hành trình button */}
        <TouchableOpacity
          style={styles.shareJourneyBtn}
          onPress={() => setShowShareModal(true)}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Chia sẻ hành trình"
        >
          <AppText variant="labelLg" color={c.onBrand} style={styles.shareJourneyBtnText}>
            Chia sẻ hành trình
          </AppText>
        </TouchableOpacity>

        {/* ── Section: Chỉ số BMI ────────────────────────────── */}
        <View style={styles.bmiCard}>
          {/* Header */}
          <View style={styles.bmiHeaderRow}>
            <Text style={styles.bmiCardTitle}>Chỉ số BMI</Text>
            <InfoIcon size={16} color={c.textSecondary} />
          </View>

          {/* Metric Row */}
          <View style={styles.bmiMetricRow}>
            <View style={styles.bmiMetricCol}>
              <Text style={styles.bmiColLabel}>BMI</Text>
              <View style={styles.bmiStatusRow}>
                {bmiStatus.type === 'normal' ? (
                  <CircleCheckIcon size={18} color={bmiStatus.color} />
                ) : bmiStatus.type === 'danger' ? (
                  <CircleAlertIcon size={18} color={bmiStatus.color} />
                ) : (
                  <TriangleAlertIcon size={18} color={bmiStatus.color} />
                )}
                <Text style={[styles.bmiStatusText, { color: bmiStatus.color }]}>
                  {bmiStatus.label}
                </Text>
              </View>
            </View>

            <View style={styles.bmiTrendCol}>
              <Text style={styles.bmiColLabel}>Xu hướng</Text>
              <Text style={styles.bmiTrendValue}>0</Text>
            </View>
          </View>

          {/* BMI Chart */}
          <View style={styles.bmiChartArea}>
            <Text style={styles.bmiRightHeader}>BMI</Text>

            {bmiTicks.map((tick) => (
              <View key={tick} style={styles.bmiGridRow}>
                <View style={styles.dashedLine} />
                <Text style={styles.bmiYAxisLabel}>
                  {tick.toFixed(1).replace('.', ',')}
                </Text>
              </View>
            ))}

            {/* Plotted circle at current BMI (~17.3) */}
            <View
              style={[
                styles.bmiPlotMarker,
                {
                  bottom: Math.max(0, Math.min(140, ((bmiValue - minBmiTick) / (maxBmiTick - minBmiTick)) * 140)),
                },
              ]}
            >
              <View style={styles.bmiMarkerHollowDot} />
            </View>
          </View>

          {/* X-axis months: 04 05 06 07 08 09 10 11 12 01 02 03 */}
          <View style={styles.bmiXAxisRow}>
            {['04', '05', '06', '07', '08', '09', '10', '11', '12', '01', '02', '03'].map((m) => (
              <Text key={m} style={styles.bmiXAxisLabel}>{m}</Text>
            ))}
          </View>
        </View>

        {/* ── Bottom Actions List ───────────────────────────── */}
        {/* <View style={styles.bottomActionsCard}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('RecordWeight')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionRowTitle}>Nhật ký cân nặng</Text>
            <View style={styles.actionRowRight}>
              <Text style={styles.actionRowValue}>Xem lịch sử</Text>
              <ChevronRightIcon size={16} color={c.textSecondary} />
            </View>
          </TouchableOpacity>
        </View> */}
      </ScrollView>

      {/* ── Health Connect Modal ────────────────────────────── */}
      <StepConnectModal
        visible={showConnectModal}
        type="step"
        title="Kallo cần quyền truy cập dữ liệu cân nặng"
        description="Kết nối với Health Connect để Kallo có thể đồng bộ cân nặng tự động từ cân thông minh của bạn."
        onClose={() => setShowConnectModal(false)}
        onSuccess={() => setShowConnectModal(false)}
      />

      {/* ── Chia sẻ hành trình Modal ─────────────────────────── */}
      <ShareJourneyModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        initialWeight={initialWeight}
        currentWeight={latestWeight}
        startDate={
          sortedWeightLogs.length > 0 && sortedWeightLogs[0].date
            ? sortedWeightLogs[0].date.split('-').reverse().join('/')
            : undefined
        }
        currentDate={
          sortedWeightLogs.length > 0 && sortedWeightLogs[sortedWeightLogs.length - 1].date
            ? sortedWeightLogs[sortedWeightLogs.length - 1].date.split('-').reverse().join('/')
            : undefined
        }
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
    headerUpdateBtn: {
      paddingHorizontal: 16,
      paddingVertical: 7,
      borderRadius: r.full,
      backgroundColor: c.brandPrimary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerUpdateBtnText: {
      fontSize: 13,
      fontWeight: '600',
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
      marginBottom: 18,
    },
    dateNavBtn: {
      padding: 6,
    },
    dateRangeText: {
      color: c.textPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
    sectionHeading: {
      color: c.textPrimary,
      fontSize: 18,
      fontWeight: '700',
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    chartCard: {
      backgroundColor: c.surfaceMid,
      borderRadius: 16,
      borderColor: c.border,
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
    chartSvgOverlay: {
      position: 'absolute',
      left: 32,
      top: 0,
      bottom: 0,
      right: 6,
    },
    pointBadge: {
      position: 'absolute',
      backgroundColor: c.brandPrimary,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    pointBadgeText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '700',
      fontFamily: 'PlusJakartaSans_700Bold',
    },
    targetWeightLineContainer: {
      position: 'absolute',
      left: 32,
      right: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    targetLineSolid: {
      flex: 1,
      height: 2.5,
      backgroundColor: c.textPrimary,
      borderRadius: 1,
    },
    targetCircleHandle: {
      width: 10,
      height: 10,
      borderRadius: 5,
      borderWidth: 2.5,
      borderColor: c.textPrimary,
      backgroundColor: c.surfaceMid,
      marginLeft: -2,
    },
    recordedWeightLineContainer: {
      position: 'absolute',
      left: 32,
      right: 70,
      flexDirection: 'row',
      alignItems: 'center',
    },
    recordedLineSolid: {
      flex: 1,
      height: 2.5,
      backgroundColor: c.brandSecondary,
      borderRadius: 1,
    },
    recordedDotStart: {
      width: 8,
      height: 8,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: c.brandSecondary,
      backgroundColor: c.surfaceMid,
    },
    recordedDotEnd: {
      width: 8,
      height: 8,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: c.brandSecondary,
      backgroundColor: c.surfaceMid,
    },
    xAxisRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 32,
      paddingRight: 6,
      marginTop: 8,
    },
    xAxisLabel: {
      color: c.textSecondary,
      fontSize: 11,
      fontWeight: '600',
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
    legendTargetIcon: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendLineWhite: {
      width: 8,
      height: 2,
      backgroundColor: c.textPrimary,
    },
    legendHollowCircle: {
      width: 8,
      height: 8,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: c.textPrimary,
      backgroundColor: c.surfaceMid,
    },
    legendRecordedIcon: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendLinePurple: {
      width: 8,
      height: 2,
      backgroundColor: c.brandSecondary,
    },
    legendSolidDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: c.brandSecondary,
      backgroundColor: c.surfaceMid,
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
    threeStatsRow: {
      flexDirection: 'row',
      gap: 10,
      marginHorizontal: 16,
      marginBottom: 20,
    },
    statBox: {
      flex: 1,
      backgroundColor: c.surface,
      borderRadius: 16,
      borderColor: c.border,
      paddingVertical: 14,
      paddingHorizontal: 8,
      alignItems: 'center',
    },
    statBoxLabel: {
      color: c.textSecondary,
      fontSize: 11,
      fontWeight: '700',
      marginBottom: 6,
    },
    statBoxValue: {
      color: c.brandSecondary,
      fontSize: 22,
      fontWeight: '800',
    },
    statBoxUnit: {
      color: c.brandSecondary,
      fontSize: 13,
      fontWeight: '600',
    },
    progressPhotosRow: {
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    addPhotoDashedBtn: {
      width: 76,
      height: 76,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: c.surfaceBorder,
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceMid,
    },
    shareJourneyBtn: {
      backgroundColor: c.brandPrimary,
      height: 48,
      borderRadius: r.full,
      marginHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      shadowColor: c.brandPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 3,
    },
    shareJourneyBtnText: {
      fontSize: 15,
      fontWeight: '600',
    },
    bmiCard: {
      backgroundColor: c.surfaceMid,
      borderRadius: 18,
      marginHorizontal: 16,
      padding: 18,
      marginBottom: 16,
    },
    bmiHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 14,
    },
    bmiCardTitle: {
      color: c.textPrimary,
      fontSize: 17,
      fontWeight: '700',
    },
    bmiMetricRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 18,
    },
    bmiMetricCol: {},
    bmiStatusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    bmiColLabel: {
      color: c.textSecondary,
      fontSize: 13,
      marginBottom: 4,
    },
    bmiStatusText: {
      fontSize: 18,
      fontWeight: '700',
    },
    bmiTrendCol: {
      alignItems: 'flex-end',
    },
    bmiTrendValue: {
      color: c.textPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    bmiChartArea: {
      height: 160,
      position: 'relative',
      justifyContent: 'space-between',
    },
    bmiRightHeader: {
      position: 'absolute',
      right: 0,
      top: -18,
      color: c.textSecondary,
      fontSize: 11,
      fontWeight: '600',
    },
    bmiGridRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    bmiYAxisLabel: {
      width: 32,
      color: c.textSecondary,
      fontSize: 11,
      fontWeight: '500',
      textAlign: 'right',
    },
    bmiPlotMarker: {
      position: 'absolute',
      left: 40,
    },
    bmiMarkerHollowDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      borderWidth: 2.5,
      borderColor: c.textPrimary,
      backgroundColor: c.surfaceMid,
    },
    bmiXAxisRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingRight: 34,
      marginTop: 8,
    },
    bmiXAxisLabel: {
      color: c.textSecondary,
      fontSize: 10,
      fontWeight: '500',
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    modalCard: {
      width: '100%',
      backgroundColor: c.surfaceMid,
      borderRadius: 20,
      padding: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      color: c.textPrimary,
      fontSize: 17,
      fontWeight: '700',
    },
    weightInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceHigh,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 20,
    },
    weightTextInput: {
      color: c.textPrimary,
      fontSize: 28,
      fontWeight: '800',
      textAlign: 'center',
      minWidth: 80,
    },
    weightInputUnit: {
      color: c.brandSecondary,
      fontSize: 18,
      fontWeight: '700',
      marginLeft: 8,
    },
    saveWeightBtn: {
      backgroundColor: c.brandPrimary,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveWeightBtnText: {
      color: c.onBrand,
      fontSize: 16,
      fontWeight: '700',
    },
  });
}
