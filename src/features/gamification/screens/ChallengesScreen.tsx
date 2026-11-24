import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppButton, AppText } from '@/components/common';
import {
  AlarmClockIcon,
  BellIcon,
  CalendarIcon,
  ChevronLeftIcon,
  CirclePlusIcon,
  ClockIcon,
  DropletsIcon,
  FlameIcon,
  FootprintsIcon,
  LightningBoltIcon,
  SparklesIcon,
  StarIcon,
  TrophyIcon,
  UserSingleIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme, type ThemeContextValue } from '@/theme';
import type { Challenge } from '../types';
import { useGamification } from '../GamificationProvider';

export interface ChallengesScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, any>;
  hideTopBar?: boolean;
  onTabChange?: (tab: 'challenges' | 'badges') => void;
}

export function ChallengesScreen({ navigation, hideTopBar, onTabChange }: ChallengesScreenProps) {
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { challenges, joinChallenge, userPoints } = useGamification();

  const [challengeSubTab, setChallengeSubTab] = useState<'explore' | 'joined' | 'completed'>('joined');

  const joinedChallenges = useMemo(
    () => challenges.filter((ch) => ch.isJoined && !ch.isCompleted),
    [challenges]
  );
  const exploreChallenges = useMemo(
    () => challenges.filter((ch) => !ch.isJoined),
    [challenges]
  );
  const completedChallenges = useMemo(
    () => challenges.filter((ch) => ch.isCompleted),
    [challenges]
  );

  const displayChallenges = useMemo(() => {
    if (challengeSubTab === 'joined') return joinedChallenges;
    if (challengeSubTab === 'explore') return exploreChallenges;
    return completedChallenges;
  }, [challengeSubTab, joinedChallenges, exploreChallenges, completedChallenges]);

  const renderChallengeCard = (challenge: Challenge) => {
    const isWater = challenge.id === 'challenge-water-7d' || challenge.category === 'water';
    const isSteps = challenge.id === 'challenge-steps-50k' || challenge.category === 'steps';
    const isLog = challenge.id === 'challenge-log-5d' || challenge.category === 'log';
    const isCalorie = challenge.id === 'challenge-calorie-10d' || challenge.category === 'calorie';

    const progressRatio = Math.min(
      1,
      challenge.currentProgress / (challenge.targetProgress || 1)
    );
    const percent = Math.round(progressRatio * 100);

    return (
      <TouchableOpacity
        key={challenge.id}
        activeOpacity={0.88}
        onPress={() =>
          navigation.navigate('ChallengeDetail', { challengeId: challenge.id })
        }
        style={[
          styles.challengeCard,
          isWater && styles.highlightedCard,
        ]}
      >
        {/* Accent Top Edge Strip for Water Card */}
        {isWater && <View style={styles.topAccentBar} />}

        {/* Header row inside card */}
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            {/* Icon Tile */}
            <View
              style={[
                styles.challengeIconBox,
                isWater && { backgroundColor: c.brandSoftTint },
                isSteps && { backgroundColor: 'rgba(112, 64, 199, 0.12)' },
                isLog && { backgroundColor: 'rgba(217, 119, 6, 0.12)' },
                isCalorie && { backgroundColor: 'rgba(225, 29, 72, 0.12)' },
              ]}
            >
              {isWater ? (
                <DropletsIcon size={22} color={c.brandPrimary} />
              ) : isSteps ? (
                <FootprintsIcon size={22} color={c.brandSecondary} />
              ) : isCalorie ? (
                <FlameIcon size={22} color="#E11D48" />
              ) : (
                <SparklesIcon size={22} color={c.vipStreak} />
              )}
            </View>

            {/* Title & Date range */}
            <View style={styles.cardTitleBox}>
              <AppText
                variant="labelLg"
                color={c.textPrimary}
                style={styles.boldText}
                numberOfLines={1}
              >
                {challenge.title}
              </AppText>
              <View style={styles.cardDateRow}>
                <CalendarIcon size={13} color={c.textSecondary} />
                <AppText variant="labelSm" color={c.textSecondary}>
                  {challenge.startDate && challenge.endDate
                    ? `${challenge.startDate.slice(5).replace('-', '/')} - ${challenge.endDate.slice(5).replace('-', '/')}`
                    : '23/11 - 29/11'}
                </AppText>
              </View>
            </View>
          </View>

          {/* Near Finish Highlight Badge (Design 2 Feature) */}
          {challenge.highlightBadge ? (
            <View style={[styles.nearFinishBadge, { backgroundColor: c.brandSoftTint }]}>
              <FlameIcon size={12} color={c.brandPrimary} />
              <AppText variant="labelSm" color={c.brandPrimary} style={styles.boldText}>
                {challenge.highlightBadge}
              </AppText>
            </View>
          ) : challenge.isCompleted ? (
            <View style={[styles.nearFinishBadge, { backgroundColor: 'rgba(22, 163, 74, 0.12)' }]}>
              <AppText variant="labelSm" color="#16A34A" style={styles.boldText}>
                Đã hoàn thành
              </AppText>
            </View>
          ) : null}
        </View>

        {/* Progress Metric Section */}
        <View style={styles.cardProgressSection}>
          <View style={styles.cardMetricRow}>
            {/* Metric Label / Value with highlight color */}
            <AppText variant="labelMd" color={c.textPrimary}>
              {isSteps ? (
                <>
                  Đã tích luỹ:{' '}
                  <AppText variant="labelMd" color={c.brandAction} style={styles.boldText}>
                    {challenge.currentProgress.toLocaleString('vi-VN')}
                  </AppText>
                  {' / '}
                  {challenge.targetProgress.toLocaleString('vi-VN')} {challenge.unit || 'bước'}
                </>
              ) : isWater ? (
                <>
                  Tiến độ:{' '}
                  <AppText variant="labelMd" color={c.brandAction} style={styles.boldText}>
                    {challenge.currentProgress}/{challenge.targetProgress}
                  </AppText>
                  {' '}ngày
                </>
              ) : (
                <>
                  Đã hoàn thành:{' '}
                  <AppText variant="labelMd" color={c.brandAction} style={styles.boldText}>
                    {challenge.currentProgress}/{challenge.targetProgress}
                  </AppText>
                  {' '}ngày
                </>
              )}
            </AppText>

            <AppText variant="labelMd" color={c.textPrimary} style={styles.boldText}>
              {percent}%
            </AppText>
          </View>

          {/* Progress Bar with rounded indicator */}
          <View style={[styles.progressBarTrack, { backgroundColor: c.surfaceHigh }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${percent}%`,
                  backgroundColor: isWater
                    ? c.brandPrimary
                    : isSteps
                      ? c.brandSecondary
                      : isCalorie
                        ? '#E11D48'
                        : c.vipStreak,
                },
              ]}
            />
          </View>
        </View>

        {/* Bottom Metadata & Rewards Footer */}
        <View style={styles.cardFooterRow}>
          {/* Days Left Chip */}
          <View style={styles.daysLeftWrap}>
            <ClockIcon size={13} color={c.textSecondary} />
            <AppText variant="labelSm" color={c.textSecondary}>
              {challenge.daysLeft ? `Còn ${challenge.daysLeft} ngày` : 'Còn 3 ngày'}
            </AppText>
          </View>

          {/* Reward Points Pill */}
          <View
            style={[
              styles.rewardPill,
              {
                backgroundColor:
                  theme.scheme === 'dark'
                    ? 'rgba(217, 119, 6, 0.22)'
                    : '#FFDCC3',
              },
            ]}
          >
            {isSteps || isCalorie ? (
              <StarIcon size={13} color={c.vipStreak} />
            ) : (
              <TrophyIcon size={13} color={c.vipStreak} />
            )}
            <AppText variant="labelSm" color={c.vipStreak} style={styles.boldText}>
              +{challenge.rewardPoints} điểm
            </AppText>
          </View>
        </View>

        {/* If available tab, show join button */}
        {!challenge.isJoined && (
          <View style={{ marginTop: 12 }}>
            <AppButton
              label="Tham gia thử thách"
              variant="primary"
              onPress={() => joinChallenge(challenge.id)}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const content = (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.challengesContainer}>
        {/* Header Bar: Title + Total Points Pill (as seen in Screenshot 2) */}
        <View style={styles.challengesHeaderBar}>
          <View style={styles.titleColumn}>
            <View style={styles.titleWithBadgeRow}>
              <AppText variant="headlineMd" color={c.textPrimary} style={styles.boldText}>
                Thử thách
              </AppText>
              <View style={[styles.countBadge, { backgroundColor: c.brandSoftTint }]}>
                <AppText variant="labelSm" color={c.brandPrimary} style={styles.boldText}>
                  {joinedChallenges.length || 3}
                </AppText>
              </View>
            </View>
            <AppText variant="bodySm" color={c.textSecondary}>
              Chinh phục thói quen, nhận quà rực rỡ
            </AppText>
          </View>

          {/* Total Points Pill */}
          <View
            style={[
              styles.totalPointsPill,
              {
                backgroundColor:
                  theme.scheme === 'dark'
                    ? 'rgba(217, 119, 6, 0.22)'
                    : '#FFDCC3',
              },
            ]}
          >
            <StarIcon size={16} color={c.vipStreak} />
            <AppText variant="labelMd" color={c.vipStreak} style={styles.boldText}>
              {userPoints || 320} điểm
            </AppText>
          </View>
        </View>

        {/* Segmented Tabs Navigation */}
        <View style={[styles.segmentedTabBar, { backgroundColor: c.surfaceHigh }]}>
            <TouchableOpacity
              style={[
                styles.segmentedTabItem,
                challengeSubTab === 'explore' && [
                  styles.segmentedTabItemActive,
                  { backgroundColor: c.surfaceMid },
                ],
              ]}
              onPress={() => setChallengeSubTab('explore')}
            >
              <AppText
                variant="labelMd"
                color={challengeSubTab === 'explore' ? c.brandPrimary : c.textSecondary}
                style={challengeSubTab === 'explore' ? styles.boldText : undefined}
              >
                Khám phá
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentedTabItem,
                challengeSubTab === 'joined' && [
                  styles.segmentedTabItemActive,
                  { backgroundColor: c.surfaceMid },
                ],
              ]}
              onPress={() => setChallengeSubTab('joined')}
            >
              <View style={styles.tabWithDotRow}>
                <AppText
                  variant="labelMd"
                  color={challengeSubTab === 'joined' ? c.brandPrimary : c.textSecondary}
                  style={challengeSubTab === 'joined' ? styles.boldText : undefined}
                >
                  Đang tham gia
                </AppText>
                <View style={[styles.activeDot, { backgroundColor: c.brandAction }]} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentedTabItem,
                challengeSubTab === 'completed' && [
                  styles.segmentedTabItemActive,
                  { backgroundColor: c.surfaceMid },
                ],
              ]}
              onPress={() => setChallengeSubTab('completed')}
            >
              <AppText
                variant="labelMd"
                color={challengeSubTab === 'completed' ? c.brandPrimary : c.textSecondary}
                style={challengeSubTab === 'completed' ? styles.boldText : undefined}
              >
                Đã hoàn thành
              </AppText>
            </TouchableOpacity>
          </View>

          {/* Motivational Mini Banner */}
          <View style={[styles.motivationalBanner, { backgroundColor: c.surfaceMuted }]}>
            <View style={styles.motivationalLeft}>
              <View style={[styles.bannerBoltCircle, { backgroundColor: c.brandSoftTint }]}>
                <LightningBoltIcon size={18} color={c.brandSecondary} />
              </View>
              <View style={styles.bannerTextColumn}>
                <AppText variant="labelMd" color={c.textPrimary} style={styles.boldText} numberOfLines={1}>
                  Chuỗi năng động tuần này
                </AppText>
                <AppText variant="bodySm" color={c.textSecondary} numberOfLines={1}>
                  Hoàn thành 2 thử thách nữa để mở rương
                </AppText>
              </View>
            </View>
            <AppText variant="labelSm" color={c.brandPrimary} style={styles.bannerCountRatio}>
              2/4
            </AppText>
          </View>

          {/* Challenges List */}
          <View style={styles.challengesListWrap}>
            {displayChallenges.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: c.surfaceMid }]}>
                <SparklesIcon size={32} color={c.brandPrimary} />
                <AppText variant="headlineSm" color={c.textPrimary} style={{ marginTop: 8 }}>
                  Chưa có thử thách nào
                </AppText>
                <AppText variant="bodySm" color={c.textSecondary} align="center">
                  {challengeSubTab === 'completed'
                    ? 'Hoàn thành các nhiệm vụ tuần để ghi dấu chiến tích tại đây!'
                    : 'Hãy chọn một thử thách mới để bứt phá giới hạn nhé.'}
                </AppText>
              </View>
            ) : (
              displayChallenges.map(renderChallengeCard)
            )}
          </View>

          {/* Micro Interaction Footer CTA */}
          {challengeSubTab !== 'explore' && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.footerCtaBtn, { backgroundColor: c.surfaceHigh }]}
              onPress={() => setChallengeSubTab('explore')}
            >
              <CirclePlusIcon size={20} color={c.brandPrimary} />
              <AppText variant="labelLg" color={c.brandPrimary} style={styles.boldText}>
                Tham gia thêm thử thách mới
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
  );

  if (hideTopBar) {
    return content;
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: c.canvasBase }]}>
      {/* ── Top Bar (Game Header with Segmented Tabs) ──────────────── */}
      <View style={[styles.topBar, { borderBottomColor: c.surfaceBorder }]}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <ChevronLeftIcon size={22} color={c.textPrimary} />
          </TouchableOpacity>

          <View style={[styles.fireCircle, { backgroundColor: c.brandAction }]}>
            <FlameIcon size={18} color="#FFFFFF" />
          </View>
          <AppText variant="headlineSm" color={c.textPrimary} style={styles.boldText}>
            Game
          </AppText>
        </View>

        {/* Segmented Tab Pill: [ Thử thách | Huy hiệu ] */}
        <View style={[styles.headerSegmentedPill, { backgroundColor: c.surfaceHigh }]}>
          <TouchableOpacity
            style={[
              styles.headerSegmentItem,
              styles.headerSegmentItemActive,
              { backgroundColor: c.surfaceMid },
            ]}
            activeOpacity={0.8}
          >
            <AppText variant="labelSm" color={c.brandPrimary} style={styles.boldText}>
              Thử thách
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerSegmentItem}
            onPress={() => onTabChange ? onTabChange('badges') : navigation.navigate('Badges')}
            activeOpacity={0.8}
          >
            <AppText variant="labelSm" color={c.textSecondary}>
              Huy hiệu
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.topBarRight}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: c.surfaceHigh }]}
            onPress={() => navigation.navigate('FriendRequests')}
            accessibilityRole="button"
            accessibilityLabel="Thông báo"
          >
            <BellIcon size={18} color={c.textSecondary} />
            <View style={[styles.notificationDot, { backgroundColor: c.brandAction }]} />
          </TouchableOpacity>

          <View style={[styles.avatarCircle, { backgroundColor: c.brandPrimary }]}>
            <UserSingleIcon size={15} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {content}
    </SafeAreaView>
  );
}

function createStyles(theme: ThemeContextValue) {
  const { colors: c } = theme;

  return StyleSheet.create({
    safe: {
      flex: 1,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderBottomWidth: 1,
    },
    topBarLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    headerSegmentedPill: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 20,
      padding: 3,
    },
    headerSegmentItem: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 16,
    },
    headerSegmentItemActive: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    topBarRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    notificationDot: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 7,
      height: 7,
      borderRadius: 3.5,
    },
    backButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
    },
    fireCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
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
      paddingBottom: 40,
    },

    /* Challenges Overview */
    challengesContainer: {
      gap: 16,
    },
    challengesHeaderBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 4,
    },
    titleColumn: {
      gap: 2,
    },
    titleWithBadgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    countBadge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
    },
    totalPointsPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    segmentedTabBar: {
      flexDirection: 'row',
      borderRadius: 16,
      padding: 4,
    },
    segmentedTabItem: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
    },
    segmentedTabItemActive: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    tabWithDotRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    activeDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    motivationalBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 16,
    },
    motivationalLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    bannerBoltCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bannerTextColumn: {
      flex: 1,
      gap: 2,
    },
    bannerCountRatio: {
      fontWeight: '700',
      marginLeft: 8,
    },
    challengesListWrap: {
      gap: 12,
    },
    challengeCard: {
      borderRadius: 16,
      padding: 16,
      backgroundColor: c.surfaceMid,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      position: 'relative',
      overflow: 'hidden',
      gap: 12,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    highlightedCard: {
      borderWidth: 1.5,
      borderColor: c.brandPrimary,
    },
    topAccentBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      backgroundColor: c.brandPrimary,
    },
    cardHeaderRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    cardHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    challengeIconBox: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitleBox: {
      flex: 1,
      gap: 3,
    },
    cardDateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    nearFinishBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    cardProgressSection: {
      gap: 8,
    },
    cardMetricRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressBarTrack: {
      height: 6,
      borderRadius: 3,
      overflow: 'hidden',
      width: '100%',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 3,
    },
    cardFooterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 2,
    },
    daysLeftWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    rewardPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    footerCtaBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 14,
      borderRadius: 16,
      marginTop: 4,
    },
    emptyBox: {
      padding: 32,
      borderRadius: 16,
      alignItems: 'center',
      gap: 6,
    },
    boldText: {
      fontWeight: '700',
    },
  });
}
