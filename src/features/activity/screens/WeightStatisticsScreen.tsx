import React, { useMemo, useState } from 'react';
import {
  Alert,
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
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import type { RootStackParamList } from '@/navigation/types';
import { ChevronLeftIcon, ChevronRightIcon, CloseXIcon, InfoIcon, PlusIcon } from '@/components/icons';
import { images } from '@/assets/images';
import { useTheme, type ThemeContextValue } from '@/theme';
import { formatNumber, todayKey } from '@/features/nutrition/utils';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { useActivity } from '../ActivityProvider';
import { StepConnectModal } from '../components/StepConnectModal';

type Props = NativeStackScreenProps<RootStackParamList, 'WeightStatistics'>;

type TimeTab = '1_month' | '6_months' | '12_months';

export function WeightStatisticsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { state: nutritionState, addWeight } = useNutrition();
  const { state: activityState } = useActivity();

  const isConnected =
    activityState.syncStatus.healthConnect === 'CONNECTED' ||
    (Platform.OS === 'ios' && activityState.syncStatus.appleHealth === 'CONNECTED');

  const [activeTab, setActiveTab] = useState<TimeTab>('1_month');
  const [monthOffset, setMonthOffset] = useState(0); // 0 = current month
  const [showConnectModal, setShowConnectModal] = useState(false);

  // Month navigation calculation
  const monthInfo = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthOffset);
    return {
      label: `Tháng ${d.getMonth() + 1}`,
      year: d.getFullYear(),
      month: d.getMonth() + 1,
    };
  }, [monthOffset]);

  // Weight statistics
  const weightLogs = nutritionState.weightLogs || [];
  const latestWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weightKg : 50;
  const initialWeight = weightLogs.length > 0 ? weightLogs[0].weightKg : 50;
  const weightDifference = Number((latestWeight - initialWeight).toFixed(1));

  // Target weight (default 60kg from screenshot / goal)
  const targetWeight = 60;

  // BMI calculation (default height 170cm = 1.7m)
  const heightM = 1.7;
  const bmiValue = Number((latestWeight / (heightM * heightM)).toFixed(1));

  const bmiStatus = useMemo(() => {
    if (bmiValue < 18.5) return { label: 'Thiếu cân', color: c.statusWarning, icon: '⚠️' };
    if (bmiValue <= 24.9) return { label: 'Bình thường', color: c.quickScanner, icon: '✅' };
    if (bmiValue <= 29.9) return { label: 'Thừa cân', color: c.statusWarning, icon: '⚠️' };
    return { label: 'Béo phì', color: c.statusDanger, icon: '🚨' };
  }, [bmiValue, c]);

  // Y-axis ticks for weight chart: 61, 58, 55, 52, 49
  const weightTicks = [61, 58, 55, 52, 49];
  const minWeightTick = 49;
  const maxWeightTick = 61;

  // BMI Y-axis ticks: 19.0, 18.5, 18.0, 17.5, 17.0, 16.5, 16.0
  const bmiTicks = [19.0, 18.5, 18.0, 17.5, 17.0, 16.5, 16.0];

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

        <TouchableOpacity
          onPress={() => navigation.navigate('RecordWeight')}
          style={styles.headerUpdateBtn}
          accessibilityRole="button"
          accessibilityLabel="Cập nhật"
        >
          <Text style={styles.headerUpdateBtnText}>Cập nhật</Text>
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
            onPress={() => setMonthOffset((prev) => prev - 1)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.dateNavBtn}
          >
            <ChevronLeftIcon size={16} color={c.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.dateRangeText}>{monthInfo.label}</Text>

          <TouchableOpacity
            onPress={() => setMonthOffset((prev) => Math.min(0, prev + 1))}
            disabled={monthOffset >= 0}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[styles.dateNavBtn, monthOffset >= 0 && { opacity: 0.3 }]}
          >
            <ChevronRightIcon size={16} color={c.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ── Section Title: Biểu đồ cân nặng ─────────────────── */}
        <Text style={styles.sectionHeading}>Biểu đồ cân nặng</Text>

        {/* ── Weight Line Chart Area ─────────────────────────── */}
        <View style={styles.chartCard}>
          {/* Ambient Glow */}
          <View style={styles.chartAmbientGlow} />

          {/* Plot Area */}
          <View style={styles.chartPlotArea}>
            {/* Horizontal Dashed Lines with Ticks: 61, 58, 55, 52, 49 */}
            {weightTicks.map((tick) => (
              <View key={tick} style={styles.gridRow}>
                <Text style={styles.yAxisLabel}>{tick}</Text>
                <View style={styles.dashedLine} />
              </View>
            ))}

            {/* Target Weight Line (white horizontal line at 60kg with hollow circle) */}
            <View
              style={[
                styles.targetWeightLineContainer,
                {
                  bottom: ((targetWeight - minWeightTick) / (maxWeightTick - minWeightTick)) * 160 + 10,
                },
              ]}
            >
              <View style={styles.targetLineSolid} />
              <View style={styles.targetCircleHandle} />
            </View>

            {/* Recorded Weight Line (purple line at 50kg) */}
            <View
              style={[
                styles.recordedWeightLineContainer,
                {
                  bottom: ((latestWeight - minWeightTick) / (maxWeightTick - minWeightTick)) * 160 + 10,
                },
              ]}
            >
              <View style={styles.recordedDotStart} />
              <View style={styles.recordedLineSolid} />
              <View style={styles.recordedDotEnd} />
            </View>
          </View>

          {/* X-axis days: 01, 05, 10, 15, 20, 25, 31 */}
          <View style={styles.xAxisRow}>
            {['01', '05', '10', '15', '20', '25', '31'].map((day) => (
              <Text key={day} style={styles.xAxisLabel}>{day}</Text>
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
            onPress={() => Alert.alert('Thêm ảnh', 'Chọn ảnh từ thư viện để theo dõi tiến trình vóc dáng của bạn.')}
            activeOpacity={0.7}
          >
            <PlusIcon size={24} color={c.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Chia sẻ hành trình button */}
        <TouchableOpacity
          style={styles.shareJourneyBtn}
          onPress={() => Alert.alert('Chia sẻ hành trình', 'Chia sẻ tiến trình cân nặng của bạn lên bảng tin hoặc mạng xã hội.')}
          activeOpacity={0.85}
        >
          <Text style={styles.shareJourneyBtnText}>Chia sẻ hành trình</Text>
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
              <Text style={[styles.bmiStatusText, { color: bmiStatus.color }]}>
                {bmiStatus.icon} {bmiStatus.label}
              </Text>
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
                  bottom: ((bmiValue - 16.0) / (19.0 - 16.0)) * 140,
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
        <View style={styles.bottomActionsCard}>
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
        </View>
      </ScrollView>

      {/* ── Health Connect Modal ────────────────────────────── */}
      <StepConnectModal
        visible={showConnectModal}
        type="step"
        title="Wao cần quyền truy cập dữ liệu cân nặng"
        description="Kết nối với Health Connect để Wao có thể đồng bộ cân nặng tự động từ cân thông minh của bạn."
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
    headerUpdateBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
      backgroundColor: c.brandPrimary + '26',
    },
    headerUpdateBtnText: {
      color: c.brandSecondary,
      fontSize: 13,
      fontWeight: '700',
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
      backgroundColor: c.surfaceHigh,
      borderRadius: 16,
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
      backgroundColor: c.brandPrimary + '26',
      height: 48,
      borderRadius: 24,
      marginHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    shareJourneyBtnText: {
      color: c.brandSecondary,
      fontSize: 15,
      fontWeight: '700',
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
