import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from '@/components/common';
import {
  ChevronLeftIcon,
  CirclePlusIcon,
  DropletsIcon,
  FlameIcon,
  FootprintsIcon,
  GamepadIcon,
  GearSettingsIcon,
  LightningBoltIcon,
  LockClosedIcon,
  MailInboxIcon,
  SproutIcon,
  StarIcon,
  TrophyIcon,
  TrendingUpIcon,
  UserPlusIcon,
  UserSingleIcon,
  UsersIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useGamification } from '../GamificationProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'GameHub'>;

export function GameHubScreen({ navigation }: Props) {
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const {
    streak,
    friends,
    incomingRequests,
    userPoints,
    challenges,
    badges,
    getLeaderboard,
  } = useGamification();

  // Color tokens aligned with Daylight / Nocturne Vitality
  const colors = {
    canvas: theme.colors.canvasBase,
    cardBg: theme.colors.surfaceMid,
    cardLow: isDark ? 'rgba(123, 79, 224, 0.12)' : '#F6F1FF',
    cardHigh: isDark ? '#252038' : '#EBE6F4',
    cardHighest: isDark ? '#302A46' : '#E5E0EE',
    primary: theme.colors.brandPrimary,
    primaryContainer: isDark ? '#9E64F7' : '#7B4FE0',
    primaryFixed: isDark ? 'rgba(123, 79, 224, 0.28)' : '#E9DDFF',
    textPrimary: theme.colors.textPrimary,
    textSecondary: theme.colors.textSecondary,
    textOutline: isDark ? '#8E889F' : '#7A7485',
    border: theme.colors.surfaceBorder,
    tertiary: '#D97706',
    tertiaryFixed: isDark ? 'rgba(217, 119, 6, 0.25)' : '#FFDCC3',
    onTertiaryFixed: isDark ? '#FDE68A' : '#6E3900',
    secondary: isDark ? '#B488FC' : '#7040C7',
    secondaryFixed: isDark ? 'rgba(164, 118, 254, 0.22)' : '#EADDFF',
  };

  const pointsLeaderboard = getLeaderboard('challenge');
  const userRankEntry = pointsLeaderboard.find((e) => e.isCurrentUser);
  const userRank = userRankEntry ? userRankEntry.rank : 5;
  const currentPoints = userPoints || 720;

  // Active challenges for carousel
  const activeChallenges = challenges.slice(0, 2);

  // Top 3 leaderboard entries
  const top1 = pointsLeaderboard.find((e) => e.rank === 1) || {
    name: 'Linh Chi',
    score: 1240,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsnS3icm-H4kgZ7UG_ZiI-E1NKmP9ib_AWBW--b2iAcAgNIyBb-OQD00poxIMyQUlyqwjcpOtq_MgZH4Xd5PP3Hgxx_dT-AcTMiYwX_ZW3l__PdvIV9LT2RSt0Mol6STQJfRGx379nX52EuQqsu-h9lG00bhRThglNSu2Bh9JrBMEUF8K8UIUnCIQ8UGsmeCvMbbOGbavm5URWtu71dC8-ENQ67rU-Z2Q1iKp-zR8',
    subtitle: 'Chuỗi 18 ngày',
    tag: 'Quán quân',
  };

  const top2 = pointsLeaderboard.find((e) => e.rank === 2) || {
    name: 'Hoàng Nam',
    score: 1080,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc-t6xwG5W9BspgP0Zd1zuvVIOQGiuvipANMEvohdi6OOHQ1BUv0xeyMIv5oPQSjaiZJ_LZJqEk1g2XlK9yc1M-W5rnNsUoHekXM6RvYaJV4qmp7Os-qF_hfIsf0Y_lTVp2drvuxHJdRrOBu47W7tMU9ouiqnIEp7YqC34jsykrW8Wb1sHjiRqrEdVpYDVhD9bL6dODyLLiRkIz7w_Rk23MOxxsaDp69_svT-z8vU',
    subtitle: 'Chuỗi 12 ngày',
  };

  const top3 = pointsLeaderboard.find((e) => e.rank === 3) || {
    name: 'Tuấn Kiệt',
    score: 940,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF3uitS9DITnLiw5Crjmm5uTJyklDgDBEILrmXncDSnx7I7faOB6Mb4X1y3jXjRXkBD8r4SSiNPjPMJnSQSR6ZL5X6TWE9oF5xDa8XzG4D0cKcBPMNGX0VxwgEdAPGrHc8CvVCkzjRQ6vntXuY8trt9GrfrVYaVV7-NidmvX1gFwnZxxpVy1upcCmRvbNLUOLDMUgxaVjKQ19aq_eMuKDW_QkDVw3s4ipPFbKzn40',
    subtitle: 'Chuỗi 9 ngày',
  };

  const unlockedBadges = badges.filter((b) => b.isUnlocked);
  const totalBadges = badges.length;

  // Active friends avatars (first 4)
  const activeFriends = friends.slice(0, 4);
  const remainingFriendsCount = Math.max(0, (friends.length || 12) - 4);

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: colors.canvas }]}>
      {/* ── Fixed Top Header ────────────────────────────────────────── */}
      <View style={[styles.headerBar, { backgroundColor: colors.canvas, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <ChevronLeftIcon size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={[styles.gameIconBox, { backgroundColor: colors.primaryFixed }]}>
            <GamepadIcon size={18} color={colors.primaryContainer} />
          </View>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.headerTitle}>
            Game Hub
          </AppText>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.streakPill, { backgroundColor: colors.tertiaryFixed }]}
            onPress={() => navigation.navigate('StreakDetail')}
            accessibilityRole="button"
            accessibilityLabel={`Chuỗi ${streak.currentStreak || 7} ngày`}
          >
            <FlameIcon size={15} color={colors.tertiary} />
            <AppText variant="labelSm" color={colors.onTertiaryFixed} style={styles.streakText}>
              {streak.currentStreak || 7} NGÀY
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.profileAvatar, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('StreakDetail')}
            accessibilityLabel="Hồ sơ cá nhân"
          >
            <UserSingleIcon size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Canvas Title & Sub-actions ─────────────────────────────── */}
        <View style={styles.canvasHeader}>
          <AppText variant="headlineLg" color={colors.textPrimary} style={styles.canvasTitle}>
            Game
          </AppText>
          <View style={styles.canvasActions}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
              onPress={() => navigation.navigate('FriendRequests')}
              accessibilityLabel="Hộp thư bạn bè"
            >
              <MailInboxIcon size={20} color={colors.textSecondary} />
              {incomingRequests.length > 0 && (
                <View style={[styles.badgeDot, { backgroundColor: colors.primaryContainer }]}>
                  <AppText variant="labelSm" color="#FFFFFF" style={styles.badgeText}>
                    {incomingRequests.length}
                  </AppText>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
              onPress={() => navigation.navigate('GameSettings')}
              accessibilityLabel="Quyền riêng tư & Game"
            >
              <GearSettingsIcon size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Hero Card: Weekly Standing ─────────────────────────────── */}
        <View style={[styles.heroCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={[styles.heroGlow, { backgroundColor: colors.primaryFixed }]} />
          <View style={styles.heroTopRow}>
            <View>
              <AppText variant="labelSm" color={colors.textOutline} style={styles.heroRankLabel}>
                HẠNG TUẦN NÀY
              </AppText>
              <View style={styles.heroRankValueRow}>
                <AppText variant="headlineLg" color={colors.primaryContainer} style={styles.heroRankNumber}>
                  #{userRank}
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary} style={styles.heroRankSubtitle}>
                  trong nhóm bạn bè
                </AppText>
              </View>
            </View>

            <View style={[styles.pointsPill, { backgroundColor: colors.tertiaryFixed }]}>
              <StarIcon size={14} color={colors.tertiary} />
              <AppText variant="labelLg" color={colors.tertiary} style={styles.pointsText}>
                {currentPoints} điểm
              </AppText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.cardHigh }]} />

          <View style={styles.heroGapRow}>
            <View style={styles.heroGapLeft}>
              <LightningBoltIcon size={18} color={colors.tertiary} />
              <AppText variant="bodySm" color={colors.textSecondary} numberOfLines={1}>
                Còn <AppText variant="bodySm" color={colors.textPrimary} style={styles.bold}>140 điểm</AppText> để vượt Minh Anh
              </AppText>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('FriendsLeaderboard')}
              accessibilityLabel="Xem bảng xếp hạng"
            >
              <AppText variant="labelMd" color={colors.primary} style={styles.bold}>
                Xem BXH →
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.heroPeriodRow}>
            <AppText variant="labelSm" color={colors.textOutline}>
              Kỳ xếp hạng: Tuần 23/11 – 29/11
            </AppText>
            <View style={[styles.pulseDot, { backgroundColor: colors.secondary }]} />
          </View>
        </View>

        {/* ── Section: Leaderboard Preview ──────────────────────────── */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <AppText variant="headlineSm" color={colors.textPrimary} style={styles.sectionTitle}>
              Bảng xếp hạng bạn bè
            </AppText>
            <TouchableOpacity
              onPress={() => navigation.navigate('FriendsLeaderboard')}
              accessibilityLabel="Xem tất cả bảng xếp hạng"
            >
              <AppText variant="labelLg" color={colors.primary} style={styles.bold}>
                Xem tất cả →
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={[styles.leaderboardCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            {/* Rank 1 */}
            <View style={[styles.leaderboardRow, { backgroundColor: isDark ? colors.cardLow : '#FCF8FF' }]}>
              <View style={styles.leaderboardRowLeft}>
                <View style={[styles.podiumBadgeBox, { backgroundColor: colors.tertiaryFixed }]}>
                  <TrophyIcon size={16} color={colors.tertiary} />
                </View>
                <View style={styles.avatarWrap}>
                  <Image source={{ uri: top1.avatarUrl }} style={styles.leaderboardAvatar} />
                  <View style={[styles.rankMiniPill, { backgroundColor: colors.tertiary }]}>
                    <AppText variant="labelSm" color="#FFFFFF" style={styles.rankMiniText}>1</AppText>
                  </View>
                </View>
                <View style={styles.playerInfo}>
                  <View style={styles.playerNameRow}>
                    <AppText variant="bodyMd" color={colors.textPrimary} style={styles.bold} numberOfLines={1}>
                      {top1.name}
                    </AppText>
                    <View style={[styles.winnerTag, { backgroundColor: colors.tertiaryFixed }]}>
                      <AppText variant="labelSm" color={colors.onTertiaryFixed} style={styles.winnerTagText}>
                        Quán quân
                      </AppText>
                    </View>
                  </View>
                  <AppText variant="labelSm" color={colors.textOutline}>
                    {top1.subtitle ?? 'Chuỗi 18 ngày'}
                  </AppText>
                </View>
              </View>
              <AppText variant="labelLg" color={colors.tertiary} style={styles.bold}>
                {top1.score.toLocaleString('vi-VN')} đ
              </AppText>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.cardHigh }]} />

            {/* Rank 2 */}
            <View style={styles.leaderboardRow}>
              <View style={styles.leaderboardRowLeft}>
                <View style={[styles.podiumBadgeBox, { backgroundColor: colors.cardHigh }]}>
                  <TrophyIcon size={16} color={colors.textOutline} />
                </View>
                <View style={styles.avatarWrap}>
                  <Image source={{ uri: top2.avatarUrl }} style={styles.leaderboardAvatar} />
                  <View style={[styles.rankMiniPill, { backgroundColor: colors.textOutline }]}>
                    <AppText variant="labelSm" color="#FFFFFF" style={styles.rankMiniText}>2</AppText>
                  </View>
                </View>
                <View style={styles.playerInfo}>
                  <AppText variant="bodyMd" color={colors.textPrimary} style={styles.semiBold} numberOfLines={1}>
                    {top2.name}
                  </AppText>
                  <AppText variant="labelSm" color={colors.textOutline}>
                    {top2.subtitle ?? 'Chuỗi 12 ngày'}
                  </AppText>
                </View>
              </View>
              <AppText variant="labelLg" color={colors.textPrimary} style={styles.semiBold}>
                {top2.score.toLocaleString('vi-VN')} đ
              </AppText>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.cardHigh }]} />

            {/* Rank 3 */}
            <View style={styles.leaderboardRow}>
              <View style={styles.leaderboardRowLeft}>
                <View style={[styles.podiumBadgeBox, { backgroundColor: colors.tertiaryFixed }]}>
                  <TrophyIcon size={16} color={colors.tertiary} />
                </View>
                <View style={styles.avatarWrap}>
                  <Image source={{ uri: top3.avatarUrl }} style={styles.leaderboardAvatar} />
                  <View style={[styles.rankMiniPill, { backgroundColor: '#CD7F32' }]}>
                    <AppText variant="labelSm" color="#FFFFFF" style={styles.rankMiniText}>3</AppText>
                  </View>
                </View>
                <View style={styles.playerInfo}>
                  <AppText variant="bodyMd" color={colors.textPrimary} style={styles.semiBold} numberOfLines={1}>
                    {top3.name}
                  </AppText>
                  <AppText variant="labelSm" color={colors.textOutline}>
                    {top3.subtitle ?? 'Chuỗi 9 ngày'}
                  </AppText>
                </View>
              </View>
              <AppText variant="labelLg" color={colors.textPrimary} style={styles.semiBold}>
                {top3.score.toLocaleString('vi-VN')} đ
              </AppText>
            </View>

            {/* User Highlight Row */}
            <View style={[styles.userHighlightRow, { backgroundColor: colors.cardLow }]}>
              <View style={styles.leaderboardRowLeft}>
                <View style={[styles.userRankCircle, { backgroundColor: colors.primaryContainer }]}>
                  <AppText variant="labelSm" color="#FFFFFF" style={styles.bold}>{userRank}</AppText>
                </View>
                <View style={[styles.userIconCircle, { backgroundColor: colors.primary }]}>
                  <UserSingleIcon size={16} color="#FFFFFF" />
                </View>
                <View style={styles.playerInfo}>
                  <AppText variant="bodyMd" color={colors.primaryContainer} style={styles.bold}>
                    Bạn (Tôi)
                  </AppText>
                  <View style={styles.userDeltaRow}>
                    <TrendingUpIcon size={13} color={colors.primary} />
                    <AppText variant="labelSm" color={colors.primary} style={[styles.semiBold, { marginLeft: 3 }]}>
                      +1 hôm nay
                    </AppText>
                  </View>
                </View>
              </View>
              <AppText variant="labelLg" color={colors.primaryContainer} style={styles.bold}>
                {currentPoints} đ
              </AppText>
            </View>
          </View>
        </View>

        {/* ── Section: Active Challenges Carousel ───────────────────── */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithCount}>
              <AppText variant="headlineSm" color={colors.textPrimary} style={styles.sectionTitle}>
                Thử thách đang tham gia
              </AppText>
              <View style={[styles.countBadge, { backgroundColor: colors.secondaryFixed }]}>
                <AppText variant="labelSm" color={colors.secondary} style={styles.bold}>
                  {challenges.filter((c) => c.isJoined).length || 3}
                </AppText>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('BadgesChallenges', { initialTab: 'challenges' })}
              accessibilityLabel="Xem tất cả thử thách"
            >
              <AppText variant="labelLg" color={colors.primary} style={styles.bold}>
                Xem tất cả →
              </AppText>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
          >
            {/* Challenge 1 */}
            <TouchableOpacity
              style={[styles.challengeCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
              onPress={() => navigation.navigate('ChallengeDetail', { challengeId: activeChallenges[0]?.id || 'challenge-water-7d' })}
              activeOpacity={0.88}
            >
              <View>
                <View style={styles.challengeCardTop}>
                  <View style={[styles.challengeIconBox, { backgroundColor: colors.cardLow }]}>
                    <DropletsIcon size={20} color={colors.secondary} />
                  </View>
                  <View style={[styles.challengeTag, { backgroundColor: colors.primaryFixed }]}>
                    <AppText variant="labelSm" color={colors.primaryContainer} style={styles.bold}>
                      Gần xong!
                    </AppText>
                  </View>
                </View>
                <AppText variant="bodyLg" color={colors.textPrimary} style={styles.challengeTitle} numberOfLines={1}>
                  {activeChallenges[0]?.title || 'Uống đủ nước 7 ngày'}
                </AppText>
                <View style={styles.progressSection}>
                  <View style={styles.progressTextRow}>
                    <AppText variant="labelSm" color={colors.textSecondary}>Tiến độ</AppText>
                    <AppText variant="labelSm" color={colors.textSecondary}>5/7 ngày (71%)</AppText>
                  </View>
                  <View style={[styles.progressTrack, { backgroundColor: colors.cardHigh }]}>
                    <View style={[styles.progressFill, { width: '71%', backgroundColor: colors.secondary }]} />
                  </View>
                </View>
              </View>

              <View style={styles.challengeFooter}>
                <AppText variant="labelSm" color={colors.textOutline}>
                  Còn 2 ngày
                </AppText>
                <View style={[styles.rewardBadge, { backgroundColor: colors.tertiaryFixed }]}>
                  <AppText variant="labelSm" color={colors.tertiary} style={styles.bold}>
                    +60 đ
                  </AppText>
                </View>
              </View>
            </TouchableOpacity>

            {/* Challenge 2 */}
            <TouchableOpacity
              style={[styles.challengeCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
              onPress={() => navigation.navigate('ChallengeDetail', { challengeId: activeChallenges[1]?.id || 'challenge-steps-50k' })}
              activeOpacity={0.88}
            >
              <View>
                <View style={styles.challengeCardTop}>
                  <View style={[styles.challengeIconBox, { backgroundColor: colors.cardLow }]}>
                    <FootprintsIcon size={20} color={colors.primary} />
                  </View>
                  <View style={[styles.challengeTag, { backgroundColor: colors.cardHigh }]}>
                    <AppText variant="labelSm" color={colors.textPrimary} style={styles.bold}>
                      Tuần này
                    </AppText>
                  </View>
                </View>
                <AppText variant="bodyLg" color={colors.textPrimary} style={styles.challengeTitle} numberOfLines={1}>
                  {activeChallenges[1]?.title || 'Đi 50.000 bước tuần'}
                </AppText>
                <View style={styles.progressSection}>
                  <View style={styles.progressTextRow}>
                    <AppText variant="labelSm" color={colors.textSecondary}>Tiến độ</AppText>
                    <AppText variant="labelSm" color={colors.textSecondary}>32.500 / 50k (65%)</AppText>
                  </View>
                  <View style={[styles.progressTrack, { backgroundColor: colors.cardHigh }]}>
                    <View style={[styles.progressFill, { width: '65%', backgroundColor: colors.primaryContainer }]} />
                  </View>
                </View>
              </View>

              <View style={styles.challengeFooter}>
                <AppText variant="labelSm" color={colors.textOutline}>
                  Còn 3 ngày
                </AppText>
                <View style={[styles.rewardBadge, { backgroundColor: colors.tertiaryFixed }]}>
                  <AppText variant="labelSm" color={colors.tertiary} style={styles.bold}>
                    +80 đ
                  </AppText>
                </View>
              </View>
            </TouchableOpacity>

            {/* Explore Card CTA */}
            <TouchableOpacity
              style={[styles.exploreCard, { backgroundColor: colors.cardLow, borderColor: colors.border }]}
              onPress={() => navigation.navigate('BadgesChallenges', { initialTab: 'challenges' })}
              activeOpacity={0.85}
            >
              <View style={[styles.exploreIconCircle, { backgroundColor: colors.primaryFixed }]}>
                <CirclePlusIcon size={24} color={colors.primaryContainer} />
              </View>
              <AppText variant="labelLg" color={colors.primary} style={[styles.bold, { marginTop: 8 }]}>
                Khám phá thử thách
              </AppText>
              <AppText variant="labelSm" color={colors.tertiary} style={styles.semiBold}>
                Tới +200 điểm
              </AppText>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* ── Section: Recent Badges ─────────────────────────────────── */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <AppText variant="headlineSm" color={colors.textPrimary} style={styles.sectionTitle}>
              Huy hiệu gần đây
            </AppText>
            <View style={styles.badgesHeaderRight}>
              <AppText variant="labelSm" color={colors.textSecondary}>
                Đã đạt {unlockedBadges.length}/{totalBadges}
              </AppText>
              <TouchableOpacity
                onPress={() => navigation.navigate('BadgesChallenges', { initialTab: 'badges' })}
                accessibilityLabel="Xem tất cả huy hiệu"
                style={{ marginLeft: 6 }}
              >
                <AppText variant="labelLg" color={colors.primary} style={styles.bold}>
                  Xem tất cả →
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.badgesCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.badgesGrid}>
              {/* Badge 1: Streak */}
              <TouchableOpacity
                style={styles.badgeCol}
                onPress={() => navigation.navigate('BadgesChallenges', { initialTab: 'badges' })}
              >
                <View style={[styles.badgeIconContainer, { backgroundColor: colors.tertiaryFixed }]}>
                  <FlameIcon size={24} color={colors.tertiary} />
                  <View style={[styles.checkCircle, { backgroundColor: colors.cardBg }]}>
                    <AppText style={[styles.checkText, { color: colors.primary }]}>✓</AppText>
                  </View>
                </View>
                <AppText variant="labelSm" color={colors.textPrimary} style={styles.badgeName} numberOfLines={1}>
                  Chuỗi 7 ngày
                </AppText>
                <AppText variant="labelSm" color={colors.tertiary} style={styles.bold}>
                  +20đ
                </AppText>
              </TouchableOpacity>

              {/* Badge 2: First Log */}
              <TouchableOpacity
                style={styles.badgeCol}
                onPress={() => navigation.navigate('BadgesChallenges', { initialTab: 'badges' })}
              >
                <View style={[styles.badgeIconContainer, { backgroundColor: colors.secondaryFixed }]}>
                  <SproutIcon size={24} color={colors.secondary} />
                  <View style={[styles.checkCircle, { backgroundColor: colors.cardBg }]}>
                    <AppText style={[styles.checkText, { color: colors.primary }]}>✓</AppText>
                  </View>
                </View>
                <AppText variant="labelSm" color={colors.textPrimary} style={styles.badgeName} numberOfLines={1}>
                  Lần ghi đầu
                </AppText>
                <AppText variant="labelSm" color={colors.tertiary} style={styles.bold}>
                  +10đ
                </AppText>
              </TouchableOpacity>

              {/* Badge 3: First Friend */}
              <TouchableOpacity
                style={styles.badgeCol}
                onPress={() => navigation.navigate('BadgesChallenges', { initialTab: 'badges' })}
              >
                <View style={[styles.badgeIconContainer, { backgroundColor: colors.primaryFixed }]}>
                  <UsersIcon size={24} color={colors.primaryContainer} />
                  <View style={[styles.checkCircle, { backgroundColor: colors.cardBg }]}>
                    <AppText style={[styles.checkText, { color: colors.primary }]}>✓</AppText>
                  </View>
                </View>
                <AppText variant="labelSm" color={colors.textPrimary} style={styles.badgeName} numberOfLines={1}>
                  Bạn bè đầu
                </AppText>
                <AppText variant="labelSm" color={colors.tertiary} style={styles.bold}>
                  +10đ
                </AppText>
              </TouchableOpacity>

              {/* Badge 4: Locked */}
              <TouchableOpacity
                style={[styles.badgeCol, { opacity: 0.7 }]}
                onPress={() => navigation.navigate('BadgesChallenges', { initialTab: 'badges' })}
              >
                <View style={[styles.badgeIconContainer, { backgroundColor: colors.cardHigh }]}>
                  <LockClosedIcon size={20} color={colors.textOutline} />
                </View>
                <AppText variant="labelSm" color={colors.textSecondary} style={styles.badgeName} numberOfLines={1}>
                  +{Math.max(0, totalBadges - 3)} khác
                </AppText>
                <AppText variant="labelSm" color={colors.textOutline}>
                  Chưa mở
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Section: Friends ───────────────────────────────────────── */}
        <View style={styles.sectionWrap}>
          <View style={[styles.friendsCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.friendsTopRow}>
              <View style={styles.avatarsOverlapRow}>
                {activeFriends.map((f, i) => (
                  <View key={f.id || i} style={[styles.friendAvatarWrap, { zIndex: 10 - i, borderColor: colors.cardBg }]}>
                    <Image source={{ uri: f.avatarUrl }} style={styles.friendAvatarImg} />
                  </View>
                ))}
                {remainingFriendsCount > 0 && (
                  <View style={[styles.friendOverflowBadge, { backgroundColor: colors.cardHigh, borderColor: colors.cardBg, zIndex: 5 }]}>
                    <AppText variant="labelSm" color={colors.primaryContainer} style={styles.bold}>
                      +{remainingFriendsCount}
                    </AppText>
                  </View>
                )}
              </View>
              <AppText variant="bodySm" color={colors.textSecondary} style={styles.semiBold}>
                {friends.length || 12} bạn bè đang hoạt động
              </AppText>
            </View>

            <View style={styles.friendsButtonsRow}>
              <TouchableOpacity
                style={[styles.primaryCtaBtn, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('FriendSearch')}
                activeOpacity={0.88}
              >
                <UserPlusIcon size={18} color="#FFFFFF" />
                <AppText variant="labelLg" color="#FFFFFF" style={styles.bold}>
                  Thêm bạn
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryCtaBtn, { backgroundColor: colors.cardLow }]}
                onPress={() => navigation.navigate('FriendRequests')}
                activeOpacity={0.88}
              >
                <MailInboxIcon size={18} color={colors.primaryContainer} />
                <AppText variant="labelLg" color={colors.primaryContainer} style={styles.bold}>
                  Lời mời
                </AppText>
                {incomingRequests.length > 0 && (
                  <View style={[styles.dotIndicator, { backgroundColor: colors.primaryContainer }]} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  headerBar: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    padding: 4,
    marginRight: 2,
  },
  gameIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  streakText: {
    fontWeight: '700',
    fontSize: 11,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 12,
  },
  canvasHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  canvasTitle: {
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  canvasActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  badgeDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    shadowColor: '#7B4FE0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 20,
  },
  heroGlow: {
    position: 'absolute',
    top: -24,
    right: -24,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.4,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  heroRankLabel: {
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  heroRankValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  heroRankNumber: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  heroRankSubtitle: {
    fontWeight: '500',
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
  heroGapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroGapLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  heroPeriodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sectionWrap: {
    marginBottom: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  sectionTitleWithCount: {
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
  leaderboardCard: {
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#7B4FE0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  leaderboardRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  podiumBadgeBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrap: {
    position: 'relative',
    width: 40,
    height: 40,
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  rankMiniPill: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankMiniText: {
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
  playerInfo: {
    flex: 1,
    minWidth: 0,
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  winnerTag: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  winnerTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  userHighlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 14,
    marginTop: 6,
  },
  userRankCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDeltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  carouselContainer: {
    gap: 12,
    paddingRight: 8,
  },
  challengeCard: {
    width: 236,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    justifyContent: 'space-between',
    shadowColor: '#7B4FE0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  challengeCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  challengeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  challengeTitle: {
    fontWeight: '700',
    marginTop: 10,
  },
  progressSection: {
    marginTop: 8,
    gap: 4,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  challengeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  rewardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  exploreCard: {
    width: 200,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgesHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgesCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#7B4FE0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  badgesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  badgeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  checkCircle: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkText: {
    fontSize: 10,
    fontWeight: '800',
  },
  badgeName: {
    fontWeight: '600',
    textAlign: 'center',
  },
  friendsCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#7B4FE0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    gap: 14,
  },
  friendsTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarsOverlapRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendAvatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    marginLeft: -8,
  },
  friendAvatarImg: {
    width: '100%',
    height: '100%',
  },
  friendOverflowBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  friendsButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryCtaBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#7B4FE0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  secondaryCtaBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    position: 'relative',
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bold: {
    fontWeight: '700',
  },
  semiBold: {
    fontWeight: '600',
  },
});
