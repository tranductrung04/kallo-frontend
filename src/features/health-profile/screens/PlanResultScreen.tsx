import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Polygon,
  Stop,
  Line,
} from 'react-native-svg';
import { AppText } from '@/components/common';
import {
  ChevronLeftIcon,
  DropletIcon,
  FlameIcon,
  InfoIcon,
  LightningIcon,
  WheatIcon,
} from '@/components/icons';
import { useTheme } from '@/theme';
import { useHealthProfileDraft } from '../hooks/useHealthProfileDraft';
import {
  calculateDailyCalorieGoal,
  calculateHealthProfile,
  calculateTdee,
} from '../utils/calculations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PlanResultScreenProps {
  navigation?: any;
  onFinish?: () => void;
  onBack?: () => void;
}

export function PlanResultScreen({
  navigation,
  onFinish,
  onBack,
}: PlanResultScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const {
    draft,
    result: contextResult,
    saving,
    error,
    saveProfile,
  } = useHealthProfileDraft();

  const [savingPlan, setSavingPlan] = useState(false);

  // Parse draft numbers with sensible fallbacks
  const currentWeight = useMemo(() => {
    const val = parseFloat(draft.weight);
    return !isNaN(val) && val > 0 ? val : 53;
  }, [draft.weight]);

  const targetWeight = useMemo(() => {
    const val = parseFloat(draft.targetWeight);
    return !isNaN(val) && val > 0 ? val : 61;
  }, [draft.targetWeight]);

  const heightCm = useMemo(() => {
    const val = parseFloat(draft.height);
    return !isNaN(val) && val > 0 ? val : 175;
  }, [draft.height]);

  const age = useMemo(() => {
    const val = parseInt(draft.age, 10);
    return !isNaN(val) && val > 0 ? val : 25;
  }, [draft.age]);

  const weeklyRate = useMemo(() => {
    const val = parseFloat(draft.weeklyRate);
    return !isNaN(val) && val > 0 ? val : 0.5;
  }, [draft.weeklyRate]);

  // Reliable calculation result
  const result = useMemo(() => {
    if (contextResult) return contextResult;
    return calculateHealthProfile({
      gender: draft.gender,
      age,
      heightCm,
      weightKg: currentWeight,
      activityLevel: draft.activity,
      goalType: draft.goal,
      weeklyRateKg: weeklyRate,
      macroPercentages: draft.macros || { protein: 20, carbs: 50, fat: 30 },
    });
  }, [contextResult, draft, age, heightCm, currentWeight, weeklyRate]);

  const dailyCalorieGoal = useMemo(() => {
    return result?.dailyCalorieGoal || 2419;
  }, [result]);

  const weeklyCalorieGoal = useMemo(() => {
    return dailyCalorieGoal * 7;
  }, [dailyCalorieGoal]);

  const tdeeVal = useMemo(() => {
    return Math.round(result?.tdee || 2089);
  }, [result]);

  const calorieDelta = useMemo(() => {
    return Math.abs(dailyCalorieGoal - tdeeVal);
  }, [dailyCalorieGoal, tdeeVal]);

  const isGain = draft.goal === 'gain';
  const isLose = draft.goal === 'lose';
  const isMaintain = draft.goal === 'maintain';

  const goalTitle = useMemo(() => {
    if (isGain) return 'Tăng cân';
    if (isLose) return 'Giảm cân';
    return 'Duy trì cân nặng';
  }, [isGain, isLose]);

  const goalActionPhrase = useMemo(() => {
    if (isGain) return 'tăng cân';
    if (isLose) return 'giảm cân';
    return 'duy trì cân nặng';
  }, [isGain, isLose]);

  // Projected Target Date Calculation
  const projectedTargetText = useMemo(() => {
    if (isMaintain || Math.abs(targetWeight - currentWeight) < 0.2) {
      return `Duy trì ổn định mức ${Math.round(targetWeight)} Kg`;
    }

    const deltaKg = Math.abs(targetWeight - currentWeight);
    const weeksNeeded = Math.max(1, Math.ceil(deltaKg / Math.max(0.1, weeklyRate)));
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + weeksNeeded * 7);

    const day = targetDate.getDate();
    const month = targetDate.getMonth() + 1;
    const year = targetDate.getFullYear();

    return `${Math.round(targetWeight)} Kg vào ${day} thg ${month}, ${year}`;
  }, [isMaintain, targetWeight, currentWeight, weeklyRate]);

  // Nutrition Macro Distribution
  const proteinPercent = 20;
  const carbsPercent = 50;
  const fatPercent = 30;

  const proteinGrams = useMemo(() => {
    return Math.round((dailyCalorieGoal * (proteinPercent / 100)) / 4);
  }, [dailyCalorieGoal]);

  const carbsGrams = useMemo(() => {
    return Math.round((dailyCalorieGoal * (carbsPercent / 100)) / 4);
  }, [dailyCalorieGoal]);

  const fatGrams = useMemo(() => {
    return Math.round((dailyCalorieGoal * (fatPercent / 100)) / 9);
  }, [dailyCalorieGoal]);

  // Donut chart calculations
  const donutRadius = 45;
  const donutStrokeWidth = 10;
  const donutCircumference = 2 * Math.PI * donutRadius; // ~282.74

  const proteinArc = (proteinPercent / 100) * donutCircumference;
  const carbsArc = (carbsPercent / 100) * donutCircumference;
  const fatArc = (fatPercent / 100) * donutCircumference;

  // Projection curve SVG parameters
  const chartWidth = SCREEN_WIDTH - 40;
  const chartHeight = 165;
  const startX = 24;
  const endX = chartWidth - 36;
  const bottomY = chartHeight - 26;

  const startY = isGain ? bottomY - 32 : isLose ? 36 : (bottomY + 36) / 2;
  const endY = isGain ? 36 : isLose ? bottomY - 32 : (bottomY + 36) / 2;

  // Bezier curve control points for smooth S-curve
  const cp1X = startX + (endX - startX) * 0.45;
  const cp1Y = startY;
  const cp2X = startX + (endX - startX) * 0.55;
  const cp2Y = endY;

  const curvePath = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
  const fillPath = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;

  const handleStartJourney = async () => {
    setSavingPlan(true);
    try {
      const res = await saveProfile(result);
      if (res.ok) {
        if (onFinish) {
          onFinish();
        } else {
          // If in Onboarding navigator, try reset to MainTabs via RootNavigator
          try {
            const parent = navigation?.getParent?.();
            if (parent?.reset) {
              parent.reset({
                index: 0,
                routes: [{ name: 'MainTabs' as any }],
              });
            } else if (parent?.navigate) {
              parent.navigate('MainTabs' as any);
            } else if (navigation?.reset) {
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' as any }],
              });
            } else if (navigation?.navigate) {
              navigation.navigate('MainTabs' as any);
            }
          } catch {
            // RootNavigator switch via auth status automatically transitions
          }
        }
      } else {
        Alert.alert(
          'Lưu kế hoạch',
          res.error || error || 'Chưa thể lưu hồ sơ sức khỏe. Vui lòng thử lại!'
        );
      }
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Có lỗi xảy ra khi lưu kế hoạch sức khỏe.');
    } finally {
      setSavingPlan(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: isDark ? '#0F0B1E' : theme.colors.canvasBase,
        },
      ]}
    >
      {/* ── Top Navigation Bar ──────────────────────────────────── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ChevronLeftIcon
            size={24}
            color={isDark ? '#FFFFFF' : theme.colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Section 1: Projection S-Curve Chart (Image 2 top) ───── */}
        <View style={styles.chartWrapper}>
          <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            <Defs>
              <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={theme.colors.brandPrimary} stopOpacity={isDark ? 0.55 : 0.4} />
                <Stop offset="70%" stopColor={theme.colors.brandPrimary} stopOpacity={isDark ? 0.15 : 0.08} />
                <Stop offset="100%" stopColor={theme.colors.brandPrimary} stopOpacity={0} />
              </LinearGradient>
            </Defs>

            {/* Vertical dashed grid lines */}
            <Line
              x1={chartWidth * 0.28}
              y1={16}
              x2={chartWidth * 0.28}
              y2={bottomY}
              stroke={isDark ? '#2E234D' : '#E4E0F0'}
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <Line
              x1={chartWidth * 0.54}
              y1={16}
              x2={chartWidth * 0.54}
              y2={bottomY}
              stroke={isDark ? '#2E234D' : '#E4E0F0'}
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <Line
              x1={chartWidth * 0.8}
              y1={16}
              x2={chartWidth * 0.8}
              y2={bottomY}
              stroke={isDark ? '#2E234D' : '#E4E0F0'}
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />

            {/* Gradient fill under curve */}
            <Path d={fillPath} fill="url(#chartGradient)" />

            {/* Main Smooth S-Curve Line */}
            <Path
              d={curvePath}
              stroke={theme.colors.brandPrimary}
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Bottom timeline axis arrow */}
            <Line
              x1={startX}
              y1={bottomY}
              x2={endX}
              y2={bottomY}
              stroke={isDark ? '#3D3063' : '#D1CBDD'}
              strokeWidth="1.8"
            />
            <Polygon
              points={`${endX},${bottomY - 4} ${endX + 8},${bottomY} ${endX},${bottomY + 4}`}
              fill={isDark ? '#3D3063' : '#D1CBDD'}
            />

            {/* Start point marker */}
            <Circle
              cx={startX}
              cy={startY}
              r="8"
              fill={isDark ? 'rgba(188, 164, 250, 0.35)' : 'rgba(123, 79, 224, 0.18)'}
            />
            <Circle
              cx={startX}
              cy={startY}
              r="4.5"
              fill={isDark ? '#BCA4FA' : theme.colors.brandPrimary}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />

            {/* End point marker */}
            <Circle
              cx={endX}
              cy={endY}
              r="9"
              fill={isDark ? 'rgba(157, 108, 250, 0.45)' : 'rgba(123, 79, 224, 0.25)'}
            />
            <Circle
              cx={endX}
              cy={endY}
              r="5"
              fill="#FFFFFF"
              stroke={theme.colors.brandPrimary}
              strokeWidth="2"
            />
          </Svg>

          {/* Floating Target Badge above End Point */}
          <View style={[styles.targetBadgeWrap, { top: Math.max(4, endY - 32), right: 12 }]}>
            <View
              style={[
                styles.targetBadge,
                {
                  backgroundColor: isDark
                    ? '#BCA4FA'
                    : theme.colors.brandPrimary,
                },
              ]}
            >
              <AppText
                style={[
                  styles.targetBadgeText,
                  { color: isDark ? '#1E1538' : '#FFFFFF' },
                ]}
              >
                Mục tiêu
              </AppText>
            </View>
            <AppText
              style={[
                styles.goalLabelText,
                { color: isDark ? '#D8B4FE' : theme.colors.brandPrimary },
              ]}
            >
              {goalTitle}
            </AppText>
          </View>

          {/* Bottom Left "BÂY GIỜ" Label */}
          <View style={[styles.startLabelWrap, { top: bottomY + 5, left: startX - 8 }]}>
            <AppText
              style={[
                styles.startLabelText,
                { color: isDark ? '#94A3B8' : theme.colors.textSecondary },
              ]}
            >
              BÂY GIỜ
            </AppText>
          </View>
        </View>

        {/* ── Section 2: Main Plan Ready Announcement ─────────────── */}
        <View style={styles.announcementSection}>
          <AppText
            style={[
              styles.mainTitle,
              { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
            ]}
          >
            Kế hoạch sức khỏe của bạn đã sẵn sàng!
          </AppText>
        </View>

        {/* ── Section 3: Target Calorie Highlight (Image 2 mid-bottom) ─ */}
        <View style={styles.calorieSection}>
          <View style={styles.sectionHeaderRow}>
            <AppText
              style={[
                styles.sectionHeaderTitle,
                { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
              ]}
            >
              Lượng calo mục tiêu bạn cần nạp
            </AppText>
            <View
              style={[
                styles.infoBadge,
                { backgroundColor: isDark ? '#34265E' : '#EDE5FF' },
              ]}
            >
              <InfoIcon
                size={14}
                color={isDark ? '#BCA4FA' : theme.colors.brandPrimary}
              />
            </View>
          </View>

          <AppText
            style={[
              styles.calorieSubtitle,
              { color: isDark ? '#CBD5E1' : theme.colors.textSecondary },
            ]}
          >
            Để {goalActionPhrase} chúng tôi ước tính lượng calo cần thiết
            cho hoạt động mỗi ngày của bạn là
          </AppText>

          {/* Dual Highlight Tile */}
          <View
            style={[
              styles.dualTile,
              {
                backgroundColor: isDark
                  ? '#BCA4FA'
                  : theme.colors.brandSoftTint,
              },
            ]}
          >
            {/* Daily */}
            <View style={styles.tileCol}>
              <AppText
                style={[
                  styles.tileNumber,
                  { color: isDark ? '#180E2B' : theme.colors.brandPrimary },
                ]}
              >
                {dailyCalorieGoal.toLocaleString('vi-VN')}
              </AppText>
              <AppText
                style={[
                  styles.tileUnit,
                  { color: isDark ? '#34265E' : '#5B37A4' },
                ]}
              >
                calo/ngày
              </AppText>
            </View>

            {/* Vertical Divider */}
            <View
              style={[
                styles.tileDivider,
                {
                  backgroundColor: isDark
                    ? 'rgba(24, 14, 43, 0.2)'
                    : 'rgba(123, 79, 224, 0.2)',
                },
              ]}
            />

            {/* Weekly */}
            <View style={styles.tileCol}>
              <AppText
                style={[
                  styles.tileNumber,
                  { color: isDark ? '#180E2B' : theme.colors.brandPrimary },
                ]}
              >
                {weeklyCalorieGoal.toLocaleString('vi-VN')}
              </AppText>
              <AppText
                style={[
                  styles.tileUnit,
                  { color: isDark ? '#34265E' : '#5B37A4' },
                ]}
              >
                calo/tuần
              </AppText>
            </View>
          </View>
        </View>

        {/* ── Section 4: Formula Breakdown (Image 3 top) ───────────── */}
        <View style={styles.breakdownSection}>
          <AppText
            style={[
              styles.breakdownHeading,
              { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
            ]}
          >
            Trong đó bao gồm:
          </AppText>

          {/* Box 1: TDEE */}
          <View
            style={[
              styles.breakdownBox,
              {
                backgroundColor: isDark
                  ? '#1E163B'
                  : theme.colors.surfaceMid,
                borderColor: isDark
                  ? '#34265E'
                  : theme.colors.surfaceBorder,
              },
            ]}
          >
            <View style={styles.boxTitleRow}>
              <AppText
                style={[
                  styles.boxTitleText,
                  { color: isDark ? '#CBD5E1' : theme.colors.textSecondary },
                ]}
              >
                TDEE bạn cần nạp trong ngày
              </AppText>
              <AppText
                style={[
                  styles.boxInfoIcon,
                  { color: isDark ? '#94A3B8' : theme.colors.textDisabled },
                ]}
              >
                ℹ
              </AppText>
            </View>
            <AppText
              style={[
                styles.boxBigValue,
                { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
              ]}
            >
              {tdeeVal.toLocaleString('vi-VN')}{' '}
              <AppText
                style={[
                  styles.boxValueUnit,
                  { color: isDark ? '#CBD5E1' : theme.colors.textSecondary },
                ]}
              >
                calo
              </AppText>
            </AppText>
          </View>

          {/* Operator Circle */}
          <View
            style={[
              styles.operatorCircle,
              {
                backgroundColor: isDark ? '#2A1F4D' : '#EDE5FF',
                borderColor: isDark ? '#3D2F6B' : '#D4C7F8',
              },
            ]}
          >
            <AppText
              style={[
                styles.operatorText,
                { color: isDark ? '#FFFFFF' : theme.colors.brandPrimary },
              ]}
            >
              {isGain ? '+' : isLose ? '-' : '='}
            </AppText>
          </View>

          {/* Box 2: Deficit/Surplus */}
          <View
            style={[
              styles.breakdownBox,
              {
                backgroundColor: isDark
                  ? '#1E163B'
                  : theme.colors.surfaceMid,
                borderColor: isDark
                  ? '#34265E'
                  : theme.colors.surfaceBorder,
              },
            ]}
          >
            <AppText
              style={[
                styles.boxTitleText,
                { color: isDark ? '#CBD5E1' : theme.colors.textSecondary },
              ]}
            >
              {isGain
                ? 'Calo cộng thêm từ ăn uống'
                : isLose
                ? 'Calo thâm hụt từ ăn uống'
                : 'Calo cân bằng duy trì'}
            </AppText>
            <AppText
              style={[
                styles.boxBigValue,
                { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
              ]}
            >
              {calorieDelta.toLocaleString('vi-VN')}{' '}
              <AppText
                style={[
                  styles.boxValueUnit,
                  { color: isDark ? '#CBD5E1' : theme.colors.textSecondary },
                ]}
              >
                calo
              </AppText>
            </AppText>
          </View>
        </View>

        {/* ── Section 5: Projected Date Card (Image 3 mid) ────────── */}
        <View style={styles.projectedSection}>
          <AppText
            style={[
              styles.projectedSubtitle,
              { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
            ]}
          >
            Dựa trên thông tin trên, bạn sẽ đạt mục tiêu
          </AppText>
          <View
            style={[
              styles.projectedCard,
              {
                backgroundColor: isDark
                  ? '#1E163B'
                  : theme.colors.surfaceMid,
                borderColor: isDark
                  ? '#34265E'
                  : theme.colors.surfaceBorder,
              },
            ]}
          >
            <AppText
              style={[
                styles.projectedCardText,
                { color: isDark ? '#FFFFFF' : theme.colors.brandPrimary },
              ]}
            >
              {projectedTargetText}
            </AppText>
          </View>
        </View>

        {/* ── Section 6: Recommended Nutrition Macro Ratio (Image 3 bot / Image 4) */}
        <View style={styles.nutritionSection}>
          <AppText
            style={[
              styles.nutritionHeading,
              { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
            ]}
          >
            Tỷ lệ dinh dưỡng khuyến nghị
          </AppText>
          <AppText
            style={[
              styles.nutritionSubtitle,
              { color: isDark ? '#CBD5E1' : theme.colors.textSecondary },
            ]}
          >
            Kallo gợi ý bạn theo{' '}
            <AppText
              style={[
                styles.boldText,
                { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
              ]}
            >
              chế độ ăn cân bằng
            </AppText>
            , giúp duy trì năng lượng, kiểm soát cân nặng và hỗ trợ sức khỏe lâu dài.
          </AppText>

          <View
            style={[
              styles.macroCard,
              {
                backgroundColor: isDark
                  ? '#1E163B'
                  : theme.colors.surfaceMid,
                borderColor: isDark
                  ? '#34265E'
                  : theme.colors.surfaceBorder,
              },
            ]}
          >
            {/* Left: Donut Chart */}
            <View style={styles.donutWrap}>
              <Svg width={110} height={110} viewBox="0 0 110 110">
                {/* Background Ring */}
                <Circle
                  cx="55"
                  cy="55"
                  r={donutRadius}
                  stroke={isDark ? '#281F4A' : '#E4E0F0'}
                  strokeWidth={donutStrokeWidth}
                  fill="none"
                />
                {/* Protein Segment (Red/Coral) */}
                <Circle
                  cx="55"
                  cy="55"
                  r={donutRadius}
                  stroke="#EF4444"
                  strokeWidth={donutStrokeWidth}
                  strokeDasharray={`${proteinArc} ${donutCircumference}`}
                  strokeDashoffset={0}
                  strokeLinecap="round"
                  fill="none"
                  transform="rotate(-90 55 55)"
                />
                {/* Carbs Segment (Blue) */}
                <Circle
                  cx="55"
                  cy="55"
                  r={donutRadius}
                  stroke="#3B82F6"
                  strokeWidth={donutStrokeWidth}
                  strokeDasharray={`${carbsArc} ${donutCircumference}`}
                  strokeDashoffset={-proteinArc}
                  strokeLinecap="round"
                  fill="none"
                  transform="rotate(-90 55 55)"
                />
                {/* Fat Segment (Amber/Yellow) */}
                <Circle
                  cx="55"
                  cy="55"
                  r={donutRadius}
                  stroke="#F59E0B"
                  strokeWidth={donutStrokeWidth}
                  strokeDasharray={`${fatArc} ${donutCircumference}`}
                  strokeDashoffset={-(proteinArc + carbsArc)}
                  strokeLinecap="round"
                  fill="none"
                  transform="rotate(-90 55 55)"
                />
              </Svg>

              {/* Donut Inner Text */}
              <View style={styles.donutCenter}>
                <FlameIcon size={18} color="#F97316" />
                <AppText
                  style={[
                    styles.donutCalorieText,
                    { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
                  ]}
                >
                  {dailyCalorieGoal.toLocaleString('vi-VN')}
                </AppText>
              </View>
            </View>

            {/* Right: Legends */}
            <View style={styles.macroLegend}>
              {/* Protein */}
              <View style={styles.legendRow}>
                <LightningIcon size={14} color="#F59E0B" />
                <AppText
                  style={[
                    styles.legendLabel,
                    { color: isDark ? '#E2E8F0' : theme.colors.textSecondary },
                  ]}
                >
                  Chất đạm
                </AppText>
                <AppText
                  style={[
                    styles.legendVal,
                    { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
                  ]}
                >
                  {proteinPercent}% ({proteinGrams}g)
                </AppText>
              </View>

              {/* Carbs */}
              <View style={styles.legendRow}>
                <WheatIcon size={14} color="#3B82F6" />
                <AppText
                  style={[
                    styles.legendLabel,
                    { color: isDark ? '#E2E8F0' : theme.colors.textSecondary },
                  ]}
                >
                  Đường bột
                </AppText>
                <AppText
                  style={[
                    styles.legendVal,
                    { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
                  ]}
                >
                  {carbsPercent}% ({carbsGrams}g)
                </AppText>
              </View>

              {/* Fat */}
              <View style={styles.legendRow}>
                <DropletIcon size={14} color="#10B981" />
                <AppText
                  style={[
                    styles.legendLabel,
                    { color: isDark ? '#E2E8F0' : theme.colors.textSecondary },
                  ]}
                >
                  Chất béo
                </AppText>
                <AppText
                  style={[
                    styles.legendVal,
                    { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
                  ]}
                >
                  {fatPercent}% ({fatGrams}g)
                </AppText>
              </View>
            </View>
          </View>
        </View>

        {/* ── Section 7: Notice Banner (Image 4 mid) ──────────────── */}
        <View
          style={[
            styles.noticeBanner,
            {
              backgroundColor: isDark ? '#9A6B00' : '#FEF3C7',
            },
          ]}
        >
          <View
            style={[
              styles.noticeIconWrap,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.25)'
                  : 'rgba(245, 158, 11, 0.25)',
              },
            ]}
          >
            <AppText
              style={[
                styles.noticeIconText,
                { color: isDark ? '#FFFFFF' : '#B45309' },
              ]}
            >
              ℹ
            </AppText>
          </View>
          <AppText
            style={[
              styles.noticeText,
              { color: isDark ? '#FFFFFF' : '#92400E' },
            ]}
          >
            Bạn có thể tuỳ chỉnh chế độ ăn tại mục{' '}
            <AppText
              style={[
                styles.boldNoticeText,
                { color: isDark ? '#FFFFFF' : '#78350F' },
              ]}
            >
              “Tuỳ chỉnh mục tiêu”
            </AppText>{' '}
            dựa theo nhu cầu của bạn.
          </AppText>
        </View>

        {/* ── Section 8: CTA Action Button (Image 4 bottom) ───────── */}
        <View style={[styles.bottomCtaWrap, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <TouchableOpacity
            style={[
              styles.ctaButton,
              {
                backgroundColor: theme.colors.brandAction,
                shadowColor: theme.colors.brandPrimary,
              },
            ]}
            onPress={handleStartJourney}
            disabled={savingPlan || saving}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Bắt đầu hành trình"
          >
            {savingPlan || saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <AppText style={styles.ctaButtonText}>
                Bắt đầu hành trình
              </AppText>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0B1E',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  chartWrapper: {
    marginTop: 4,
    marginBottom: 20,
    alignItems: 'center',
    position: 'relative',
  },
  targetBadgeWrap: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  targetBadge: {
    backgroundColor: '#BCA4FA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  targetBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E1538',
  },
  goalLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D8B4FE',
  },
  startLabelWrap: {
    position: 'absolute',
  },
  startLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  announcementSection: {
    marginTop: 10,
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  calorieSection: {
    marginBottom: 28,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#34265E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  calorieSubtitle: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 22,
    marginBottom: 16,
  },
  dualTile: {
    flexDirection: 'row',
    backgroundColor: '#BCA4FA',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  tileCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tileNumber: {
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '800',
    color: '#180E2B',
    letterSpacing: -0.5,
  },
  tileUnit: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: '#34265E',
    marginTop: 2,
  },
  tileDivider: {
    width: 1,
    height: 44,
    backgroundColor: 'rgba(24, 14, 43, 0.2)',
  },
  breakdownSection: {
    marginBottom: 24,
  },
  breakdownHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  breakdownBox: {
    backgroundColor: '#1E163B',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#34265E',
  },
  boxTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  boxTitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  boxInfoIcon: {
    fontSize: 14,
    color: '#94A3B8',
  },
  boxBigValue: {
    fontSize: 26,
    lineHeight: 36,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  boxValueUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  operatorCircle: {
    alignSelf: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2A1F4D',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#3D2F6B',
  },
  operatorText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: -2,
  },
  projectedSection: {
    marginBottom: 28,
  },
  projectedSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  projectedCard: {
    backgroundColor: '#1E163B',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#34265E',
  },
  projectedCardText: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  nutritionSection: {
    marginBottom: 20,
  },
  nutritionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  nutritionSubtitle: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 22,
    marginBottom: 16,
  },
  boldText: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  macroCard: {
    backgroundColor: '#1E163B',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#34265E',
    gap: 16,
  },
  donutWrap: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  donutCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameEmoji: {
    fontSize: 18,
  },
  donutCalorieText: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  macroLegend: {
    flex: 1,
    gap: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
    flex: 1,
  },
  legendVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noticeBanner: {
    backgroundColor: '#9A6B00',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    marginBottom: 24,
  },
  noticeIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeIconText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  boldNoticeText: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomCtaWrap: {
    marginTop: 4,
  },
  ctaButton: {
    backgroundColor: '#A855F7',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
