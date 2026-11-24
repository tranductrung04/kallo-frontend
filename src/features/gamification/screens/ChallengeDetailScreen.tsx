import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppText, useAlert } from '@/components/common';
import {
  BadgeCheckIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ClockIcon,
  DropletsIcon,
  FootprintsIcon,
  LockClosedIcon,
  RotateCcwIcon,
  SparklesIcon,
  StarIcon,
  TargetIcon,
  TrophyIcon,
  UserSingleIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme, type ThemeContextValue } from '@/theme';
import { useGamification } from '../GamificationProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'ChallengeDetail'>;

interface DayStatus {
  dayName: string;
  isCompleted: boolean;
  isToday: boolean;
  isLocked: boolean;
}

export function ChallengeDetailScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { colors: c } = theme;
  const { showAlert } = useAlert();
  const { challengeId } = route.params;
  const { getChallengeById, joinChallenge, triggerGameEvent } = useGamification();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const challenge = useMemo(() => {
    return getChallengeById(challengeId);
  }, [getChallengeById, challengeId]);

  if (!challenge) {
    return (
      <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: c.canvasBase }]}>
        <View style={styles.notFoundContainer}>
          <AppText variant="headlineSm" color={c.textPrimary}>
            Không tìm thấy thông tin thử thách
          </AppText>
          <AppButton label="Quay lại" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const progressRatio = Math.min(
    1,
    challenge.currentProgress / (challenge.targetProgress || 1)
  );
  const percent = Math.round(progressRatio * 100);

  const isWater = challenge.id === 'challenge-water-7d' || challenge.category === 'water';
  const isSteps = challenge.id === 'challenge-steps-50k' || challenge.category === 'steps';
  const isLog = challenge.id === 'challenge-log-5d' || challenge.category === 'log';
  const isCalorie = challenge.id === 'challenge-calorie-10d' || challenge.category === 'calorie';
  const isLargeNumber = challenge.targetProgress >= 1000 || String(challenge.currentProgress).length > 3;

  const formatNum = (num: number) => num.toLocaleString('vi-VN');

  const formattedMetric = useMemo(() => {
    if (challenge.metric) {
      return challenge.metric.replace(/\b(\d{4,})\b/g, (match) =>
        Number(match).toLocaleString('vi-VN')
      );
    }
    return `${challenge.targetProgress.toLocaleString('vi-VN')} ${challenge.unit}`;
  }, [challenge.metric, challenge.targetProgress, challenge.unit]);

  const rewardBadgeTitle = useMemo(() => {
    if (challenge.rewardBadgeTitle) return challenge.rewardBadgeTitle;
    if (challenge.id.includes('step') || challenge.category === 'steps' || challenge.unit.includes('bước')) {
      return 'Vạn bước phi hành';
    }
    if (challenge.id.includes('log') || challenge.category === 'log') {
      return 'Bút ký kiên trì';
    }
    if (challenge.id.includes('calorie') || challenge.category === 'calorie') {
      return 'Bậc thầy Calo';
    }
    if (challenge.id.includes('clean') || challenge.category === 'eating') {
      return 'Thực thần thanh khiết';
    }
    return 'Chiến binh Bền bỉ';
  }, [challenge]);

  // 7-day schedule breakdown
  const weekDays: DayStatus[] = [
    { dayName: 'T2', isCompleted: true, isToday: false, isLocked: false },
    { dayName: 'T3', isCompleted: true, isToday: false, isLocked: false },
    { dayName: 'T4', isCompleted: true, isToday: false, isLocked: false },
    { dayName: 'T5', isCompleted: true, isToday: false, isLocked: false },
    { dayName: 'T6', isCompleted: true, isToday: true, isLocked: false },
    { dayName: 'T7', isCompleted: false, isToday: false, isLocked: true },
    { dayName: 'CN', isCompleted: false, isToday: false, isLocked: true },
  ];

  const handleJoin = () => {
    joinChallenge(challenge.id);
    showAlert({
      title: 'Tham gia thành công!',
      message: `Bạn đã tham gia thử thách "${challenge.title}". Hãy duy trì thói quen để nhận ${challenge.rewardPoints} điểm nhé!`,
      variant: 'success',
    });
    triggerGameEvent({
      type: 'CHALLENGE_COMPLETED',
      version: 1,
      ts: new Date().toISOString(),
      payload: {
        challengeTitle: challenge.title,
        points: challenge.rewardPoints,
      },
    });
  };

  // Radial chart constants
  const size = 152;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: c.canvasBase }]}>
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <View style={[styles.topBar, { borderBottomColor: c.surfaceBorder }]}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <ChevronLeftIcon size={24} color={c.textPrimary} />
          </TouchableOpacity>
          <AppText variant="headlineSm" color={c.textPrimary} numberOfLines={1} style={styles.boldText}>
            Chi Tiết Nhiệm Vụ
          </AppText>
        </View>

        {/* Profile Avatar */}
        <View style={[styles.avatarCircle, { backgroundColor: c.brandAction }]}>
          <UserSingleIcon size={18} color="#FFFFFF" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── 1. Hero Card ───────────────────────────────────────────── */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeaderRow}>
            {/* Category Icon Tile */}
            <View
              style={[
                styles.heroIconBox,
                isWater && { backgroundColor: c.brandSoftTint },
                isSteps && { backgroundColor: c.surfaceHigh },
                isLog && { backgroundColor: c.brandSoftTint },
                isCalorie && {
                  backgroundColor:
                    theme.scheme === 'dark'
                      ? 'rgba(239, 68, 68, 0.2)'
                      : '#FFDAD6',
                },
              ]}
            >
              {isWater && <DropletsIcon size={28} color={c.brandPrimary} />}
              {isSteps && <FootprintsIcon size={28} color={c.brandSecondary} />}
              {isLog && <BookOpenIcon size={28} color={c.brandPrimary} />}
              {isCalorie && <TargetIcon size={28} color={c.macroProtein} />}
              {!isWater && !isSteps && !isLog && !isCalorie && (
                <SparklesIcon size={28} color={c.brandPrimary} />
              )}
            </View>

            {/* Status Pill */}
            {challenge.isJoined ? (
              <View style={[styles.statusPill, { backgroundColor: c.brandSoftTint }]}>
                <View style={[styles.pulsingDot, { backgroundColor: c.brandPrimary }]} />
                <AppText variant="labelMd" color={c.brandPrimary} style={styles.boldText}>
                  Đang tham gia
                </AppText>
              </View>
            ) : challenge.isCompleted ? (
              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor:
                      theme.scheme === 'dark'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : '#ECFDF5',
                  },
                ]}
              >
                <CheckIcon size={12} color="#10B981" />
                <AppText variant="labelMd" color="#10B981" style={styles.boldText}>
                  Đã hoàn thành
                </AppText>
              </View>
            ) : (
              <View style={[styles.statusPill, { backgroundColor: c.surfaceHigh }]}>
                <AppText variant="labelMd" color={c.textSecondary} style={styles.boldText}>
                  Chưa tham gia
                </AppText>
              </View>
            )}
          </View>

          {/* Title & Description */}
          <View style={styles.heroBody}>
            <AppText variant="headlineLg" color={c.textPrimary} style={styles.boldText}>
              {challenge.title}
            </AppText>
            <AppText variant="bodyMd" color={c.textSecondary} style={styles.heroDescription}>
              {challenge.description}
            </AppText>
          </View>

          {/* Quick Stats Grid */}
          <View style={[styles.quickStatsGrid, { backgroundColor: c.surfaceMuted }]}>
            {/* Stat 1: Thời hạn */}
            <View style={styles.statCol}>
              <ClockIcon size={20} color={c.brandPrimary} />
              <AppText variant="labelSm" color={c.textSecondary} style={styles.statLabel}>
                Thời hạn
              </AppText>
              <AppText variant="labelMd" color={c.textPrimary} style={styles.boldText}>
                Còn {challenge.daysLeft ?? 3} ngày
              </AppText>
            </View>

            {/* Stat 2: Chu kỳ */}
            <View style={styles.statCol}>
              <CalendarIcon size={20} color={c.brandPrimary} />
              <AppText variant="labelSm" color={c.textSecondary} style={styles.statLabel}>
                Chu kỳ
              </AppText>
              <AppText variant="labelMd" color={c.textPrimary} style={styles.boldText}>
                {challenge.startDate || '23/11'} – {challenge.endDate || '29/11'}
              </AppText>
            </View>

            {/* Stat 3: Mục tiêu */}
            <View style={styles.statCol}>
              {isWater ? (
                <DropletsIcon size={20} color={c.brandPrimary} />
              ) : isSteps ? (
                <FootprintsIcon size={20} color={c.brandSecondary} />
              ) : (
                <TargetIcon size={20} color={c.brandPrimary} />
              )}
              <AppText variant="labelSm" color={c.textSecondary} style={styles.statLabel}>
                Mục tiêu
              </AppText>
              <AppText
                variant="labelMd"
                color={c.brandPrimary}
                style={styles.boldText}
                numberOfLines={1}
              >
                {formattedMetric}
              </AppText>
            </View>
          </View>
        </View>

        {/* ── 2. Progress & Weekday Tracker Card ──────────────────────── */}
        <View style={styles.trackerCard}>
          <View style={styles.trackerHeaderRow}>
            <AppText variant="labelLg" color={c.textPrimary} style={styles.boldText}>
              Tiến độ thử thách
            </AppText>
            <View style={[styles.progressPercentPill, { backgroundColor: c.brandSoftTint }]}>
              <AppText variant="labelMd" color={c.brandPrimary} style={styles.boldText}>
                {percent}% hoàn thành
              </AppText>
            </View>
          </View>

          {/* Radial Progress Indicator */}
          <View style={styles.radialContainer}>
            <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
              {/* Background Track */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={c.progressTrack}
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Progress Arc */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={isCalorie ? c.macroProtein : isSteps ? c.brandSecondary : c.brandAction}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
              />
            </Svg>

            {/* Radial Center Text */}
            {isLargeNumber ? (
              <View style={styles.largeCenterWrap}>
                <AppText
                  variant="headlineMd"
                  color={c.textPrimary}
                  style={styles.largeStatCurrent}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {formatNum(challenge.currentProgress)}
                </AppText>
                <AppText
                  variant="labelMd"
                  color={c.textSecondary}
                  style={styles.largeStatTarget}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  / {formatNum(challenge.targetProgress)}
                </AppText>
                <AppText variant="labelSm" color={c.textSecondary} style={styles.radialSubLabel}>
                  {challenge.unit} đạt chỉ tiêu
                </AppText>
              </View>
            ) : (
              <View style={styles.radialCenterWrap}>
                <AppText
                  variant="headlineLg"
                  color={c.textPrimary}
                  style={styles.statNumeric}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {challenge.currentProgress}
                  <AppText variant="headlineSm" color={c.textSecondary}>
                    /{challenge.targetProgress}
                  </AppText>
                </AppText>
                <AppText variant="labelSm" color={c.textSecondary} style={styles.radialSubLabel}>
                  {challenge.unit} đạt chỉ tiêu
                </AppText>
              </View>
            )}
          </View>

          {/* 7 Day Dots Indicator */}
          <View style={styles.weekGrid}>
            {weekDays.map((d, index) => {
              return (
                <View key={index} style={styles.dayCol}>
                  {d.isToday ? (
                    <View style={styles.todayAuraWrap}>
                      <View style={[styles.todayPingAura, { backgroundColor: c.brandAction }]} />
                      <View style={[styles.dayCircle, { backgroundColor: c.brandAction }]}>
                        <CheckIcon size={16} color="#FFFFFF" />
                      </View>
                    </View>
                  ) : d.isCompleted ? (
                    <View style={[styles.dayCircle, { backgroundColor: c.brandAction }]}>
                      <CheckIcon size={16} color="#FFFFFF" />
                    </View>
                  ) : (
                    <View style={[styles.dayCircle, { backgroundColor: c.surfaceHigh }]}>
                      <LockClosedIcon size={15} color={c.textSecondary} />
                    </View>
                  )}
                  <AppText
                    variant="labelSm"
                    color={d.isToday ? c.brandPrimary : c.textSecondary}
                    style={d.isToday ? styles.boldText : undefined}
                  >
                    {d.dayName}
                  </AppText>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── 3. Rewards Section ──────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <AppText variant="headlineSm" color={c.textPrimary} style={[styles.boldText, styles.sectionTitle]}>
            Phần thưởng khi hoàn thành
          </AppText>

          <View style={styles.rewardsStack}>
            {/* Reward 1: Points */}
            <View style={[styles.rewardItemBox, { backgroundColor: c.surfaceMuted }]}>
              <View
                style={[
                  styles.rewardIconBox,
                  {
                    backgroundColor:
                      theme.scheme === 'dark'
                        ? 'rgba(217, 119, 6, 0.22)'
                        : '#FFDCC3',
                  },
                ]}
              >
                <StarIcon size={22} color={c.vipStreak} />
              </View>
              <View style={styles.rewardTextWrap}>
                <AppText variant="labelLg" color={c.textPrimary} style={styles.boldText}>
                  +{challenge.rewardPoints} điểm thưởng rèn luyện
                </AppText>
                <AppText variant="bodySm" color={c.textSecondary} numberOfLines={1}>
                  Cộng trực tiếp vào bảng xếp hạng tuần
                </AppText>
              </View>
            </View>

            {/* Reward 2: Badge */}
            <View style={[styles.rewardItemBox, { backgroundColor: c.surfaceMuted }]}>
              <View style={[styles.rewardIconBox, { backgroundColor: c.brandSoftTint }]}>
                <BadgeCheckIcon size={22} color={c.brandPrimary} />
              </View>
              <View style={styles.rewardTextWrap}>
                <AppText variant="labelLg" color={c.textPrimary} style={styles.boldText}>
                  Huy hiệu "{rewardBadgeTitle}"
                </AppText>
                <AppText variant="bodySm" color={c.textSecondary} numberOfLines={1}>
                  Mở khóa huy hiệu độc quyền trên hồ sơ
                </AppText>
              </View>
            </View>
          </View>
        </View>

        {/* ── 4. Rules Section ────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <AppText variant="headlineSm" color={c.textPrimary} style={[styles.boldText, styles.sectionTitle]}>
            Thể lệ thử thách
          </AppText>

          <View style={styles.rulesStack}>
            {/* Rule 1 */}
            <View style={styles.ruleItem}>
              <BadgeCheckIcon size={18} color={c.brandPrimary} />
              <AppText variant="bodySm" color={c.textSecondary} style={styles.ruleText}>
                Chỉ tính chỉ số thực tế kể từ ngày bạn tham gia thử thách.
              </AppText>
            </View>

            {/* Rule 2 */}
            <View style={styles.ruleItem}>
              <RotateCcwIcon size={18} color={c.brandPrimary} />
              <AppText variant="bodySm" color={c.textSecondary} style={styles.ruleText}>
                Tiến độ tự động đồng bộ mỗi khi bạn ghi nhận dữ liệu trong ngày.
              </AppText>
            </View>

            {/* Rule 3 */}
            <View style={styles.ruleItem}>
              <TrophyIcon size={18} color={c.brandPrimary} />
              <AppText variant="bodySm" color={c.textSecondary} style={styles.ruleText}>
                Mỗi thử thách chỉ được tham gia và nhận thưởng một lần trong mỗi chu kỳ tuần.
              </AppText>
            </View>
          </View>
        </View>

        {/* ── 5. Action / Status Bar ──────────────────────────────────── */}
        <View style={styles.actionSection}>
          {challenge.isJoined ? (
            <View style={[styles.joinedStatusBar, { backgroundColor: c.surfaceHigh }]}>
              <CheckIcon size={20} color={c.brandPrimary} />
              <AppText variant="labelMd" color={c.textPrimary} style={styles.boldText}>
                Đã tham gia · Tiến độ tự động cập nhật
              </AppText>
            </View>
          ) : (
            <AppButton
              label="Tham gia thử thách"
              variant="primary"
              onPress={handleJoin}
              style={styles.joinBtn}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: ThemeContextValue) {
  const { colors: c } = theme;
  const isDark = theme.scheme === 'dark';

  return StyleSheet.create({
    safe: {
      flex: 1,
    },
    notFoundContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      gap: 16,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
    },
    topBarLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
    },
    avatarCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 2,
      elevation: 2,
    },
    content: {
      padding: 16,
      gap: 16,
      paddingBottom: 48,
    },

    /* Hero Card */
    heroCard: {
      backgroundColor: c.surfaceMid,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      shadowColor: isDark ? '#000000' : 'rgba(123, 79, 224, 0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 2,
    },
    heroHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    heroIconBox: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 16,
    },
    pulsingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    heroBody: {
      gap: 6,
      marginBottom: 14,
    },
    heroDescription: {
      lineHeight: 20,
    },
    quickStatsGrid: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 14,
    },
    statCol: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
    },
    statLabel: {
      fontSize: 11,
      marginTop: 2,
    },

    /* Tracker Card */
    trackerCard: {
      backgroundColor: c.surfaceMid,
      borderRadius: 20,
      padding: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      shadowColor: isDark ? '#000000' : 'rgba(123, 79, 224, 0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 2,
    },
    trackerHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 8,
    },
    progressPercentPill: {
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 12,
    },
    radialContainer: {
      position: 'relative',
      width: 152,
      height: 152,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
    },
    radialCenterWrap: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      width: 120,
    },
    largeCenterWrap: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      width: 126,
      paddingHorizontal: 4,
      gap: 1,
    },
    largeStatCurrent: {
      fontSize: 22,
      lineHeight: 26,
      fontWeight: '700',
      textAlign: 'center',
    },
    largeStatTarget: {
      fontSize: 13,
      lineHeight: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    statNumeric: {
      fontSize: 28,
      lineHeight: 32,
      fontWeight: '700',
      textAlign: 'center',
    },
    radialSubLabel: {
      fontSize: 10,
      lineHeight: 13,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 2,
      textAlign: 'center',
    },
    weekGrid: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingTop: 12,
      marginTop: 4,
    },
    dayCol: {
      alignItems: 'center',
      gap: 6,
    },
    dayCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    todayAuraWrap: {
      position: 'relative',
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    todayPingAura: {
      position: 'absolute',
      width: 38,
      height: 38,
      borderRadius: 19,
      opacity: 0.25,
    },

    /* Section Cards */
    sectionCard: {
      backgroundColor: c.surfaceMid,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      shadowColor: isDark ? '#000000' : 'rgba(123, 79, 224, 0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 2,
      gap: 12,
    },
    sectionTitle: {
      marginBottom: 2,
    },
    rewardsStack: {
      gap: 10,
    },
    rewardItemBox: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderRadius: 14,
      gap: 12,
    },
    rewardIconBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rewardTextWrap: {
      flex: 1,
      gap: 2,
    },
    rulesStack: {
      gap: 12,
    },
    ruleItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    ruleText: {
      flex: 1,
      lineHeight: 18,
    },

    /* Action Section */
    actionSection: {
      paddingTop: 4,
    },
    joinedStatusBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 24,
    },
    joinBtn: {
      borderRadius: 24,
    },
    boldText: {
      fontWeight: '700',
    },
  });
}
