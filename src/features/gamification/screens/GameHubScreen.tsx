import React, { useMemo } from 'react';
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
  BadgeCheckIcon,
  BookOpenIcon,
  CalendarIcon,
  ChevronLeftIcon,
  CirclePlusIcon,
  CrownIcon,
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
import { useTheme, type ThemeContextValue } from '@/theme';
import { useGamification } from '../GamificationProvider';
import { getBadgeVisualConfig } from '../utils';

type Props = NativeStackScreenProps<RootStackParamList, 'GameHub'>;

export function GameHubScreen({ navigation }: Props) {
  const theme = useTheme();
  const { colors: c } = theme;
  const isDark = theme.scheme === 'dark';
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {
    streak,
    friends,
    incomingRequests,
    userPoints,
    challenges,
    badges,
    getLeaderboard,
  } = useGamification();

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
    <SafeAreaView edges={['top']} style={styles.safe}>
      {/* ── Fixed Top Header ────────────────────────────────────────── */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <ChevronLeftIcon size={22} color={c.textPrimary} />
          </TouchableOpacity>
          <View style={styles.gameIconBox}>
            <GamepadIcon size={18} color={c.brandPrimary} />
          </View>
          <AppText variant="headlineSm" color={c.textPrimary} style={styles.headerTitle}>
            Game Hub
          </AppText>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.streakPill}
            onPress={() => navigation.navigate('StreakDetail')}
            accessibilityRole="button"
            accessibilityLabel={`Chuỗi ${streak.currentStreak || 7} ngày`}
          >
            <FlameIcon
              size={20}
              color={streak.currentStreak > 0 ? c.trackerBurn : c.textSecondary}
            />
            <AppText variant="headlineSm" style={styles.streakText}>
              {streak.currentStreak || 0}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Canvas Title & Sub-actions ─────────────────────────────── */}
        <View style={styles.canvasHeader}>
          <AppText variant="headlineLg" color={c.textPrimary} style={styles.canvasTitle}>
            Game
          </AppText>
          <View style={styles.canvasActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('FriendsList')}
              accessibilityLabel="Danh sách bạn bè"
            >
              <UsersIcon size={18} color={c.textSecondary} />
              {incomingRequests.length > 0 && (
                <View style={styles.badgeDot}>
                  <AppText variant="labelSm" color={c.onBrand} style={styles.badgeText}>
                    {incomingRequests.length}
                  </AppText>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('GameSettings')}
              accessibilityLabel="Quyền riêng tư & Game"
            >
              <GearSettingsIcon size={20} color={c.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Hero Card: Weekly Standing ─────────────────────────────── */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <View style={styles.heroTopRow}>
            <View>
              <AppText variant="labelSm" color={c.textDisabled} style={styles.heroRankLabel}>
                HẠNG TUẦN NÀY
              </AppText>
              <View style={styles.heroRankValueRow}>
                <AppText variant="headlineLg" color={c.brandPrimary} style={styles.heroRankNumber}>
                  #{userRank}
                </AppText>
                <AppText variant="bodySm" color={c.textSecondary} style={styles.heroRankSubtitle}>
                  trong nhóm bạn bè
                </AppText>
              </View>
            </View>

            <View style={styles.pointsPill}>
              <StarIcon size={14} color={c.vipStreak} />
              <AppText variant="labelLg" color={c.vipStreak} style={styles.pointsText}>
                {currentPoints} điểm
              </AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.heroGapRow}>
            <View style={styles.heroGapLeft}>
              <LightningBoltIcon size={18} color={c.vipStreak} />
              <AppText variant="bodySm" color={c.textSecondary} numberOfLines={1}>
                Còn <AppText variant="bodySm" color={c.textPrimary} style={styles.bold}>140 điểm</AppText> để vượt Minh Anh
              </AppText>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('FriendsLeaderboard')}
              accessibilityLabel="Xem bảng xếp hạng"
            >
              <AppText variant="labelMd" color={c.brandPrimary} style={styles.bold}>
                Xem BXH
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.heroPeriodRow}>
            <AppText variant="labelSm" color={c.textDisabled}>
              Kỳ xếp hạng: Tuần 23/11 – 29/11
            </AppText>
            <View style={styles.pulseDot} />
          </View>
        </View>

        {/* ── Section: Leaderboard Preview ──────────────────────────── */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <AppText variant="headlineSm" color={c.textPrimary} style={styles.sectionTitle}>
              Bảng xếp hạng bạn bè
            </AppText>
            <TouchableOpacity
              onPress={() => navigation.navigate('FriendsLeaderboard')}
              accessibilityLabel="Xem tất cả bảng xếp hạng"
            >
              <AppText variant="labelLg" color={c.brandPrimary} style={styles.bold}>
                Xem tất cả
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.leaderboardCard}>
            {/* Rank 1 */}
            <View style={[styles.leaderboardRow, styles.leaderboardRowRank1]}>
              <View style={styles.leaderboardRowLeft}>
                <View style={[styles.podiumBadgeBox, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.22)' : '#FEF3C7' }]}>
                  <TrophyIcon size={16} color={c.vipStreak} />
                </View>
                <View style={styles.avatarWrap}>
                  <Image source={{ uri: top1.avatarUrl }} style={styles.leaderboardAvatar} />
                  <View style={[styles.rankMiniPill, { backgroundColor: c.vipStreak }]}>
                    <AppText variant="labelSm" color={c.onBrand} style={styles.rankMiniText}>1</AppText>
                  </View>
                </View>
                <View style={styles.playerInfo}>
                  <View style={styles.playerNameRow}>
                    <AppText variant="bodyMd" color={c.textPrimary} style={styles.bold} numberOfLines={1}>
                      {top1.name}
                    </AppText>
                    <View style={styles.winnerTag}>
                      <AppText variant="labelSm" color={c.vipStreak} style={styles.winnerTagText}>
                        Quán quân
                      </AppText>
                    </View>
                  </View>
                  <AppText variant="labelSm" color={c.textDisabled}>
                    {top1.subtitle ?? 'Chuỗi 18 ngày'}
                  </AppText>
                </View>
              </View>
              <AppText variant="labelLg" color={c.vipStreak} style={styles.bold}>
                {top1.score.toLocaleString('vi-VN')} đ
              </AppText>
            </View>

            <View style={styles.divider} />

            {/* Rank 2 */}
            <View style={styles.leaderboardRow}>
              <View style={styles.leaderboardRowLeft}>
                <View style={[styles.podiumBadgeBox, { backgroundColor: c.surfaceHigh }]}>
                  <TrophyIcon size={16} color={c.textDisabled} />
                </View>
                <View style={styles.avatarWrap}>
                  <Image source={{ uri: top2.avatarUrl }} style={styles.leaderboardAvatar} />
                  <View style={[styles.rankMiniPill, { backgroundColor: c.textDisabled }]}>
                    <AppText variant="labelSm" color={c.onBrand} style={styles.rankMiniText}>2</AppText>
                  </View>
                </View>
                <View style={styles.playerInfo}>
                  <AppText variant="bodyMd" color={c.textPrimary} style={styles.semiBold} numberOfLines={1}>
                    {top2.name}
                  </AppText>
                  <AppText variant="labelSm" color={c.textDisabled}>
                    {top2.subtitle ?? 'Chuỗi 12 ngày'}
                  </AppText>
                </View>
              </View>
              <AppText variant="labelLg" color={c.textPrimary} style={styles.semiBold}>
                {top2.score.toLocaleString('vi-VN')} đ
              </AppText>
            </View>

            <View style={styles.divider} />

            {/* Rank 3 */}
            <View style={styles.leaderboardRow}>
              <View style={styles.leaderboardRowLeft}>
                <View style={[styles.podiumBadgeBox, { backgroundColor: isDark ? 'rgba(217, 119, 6, 0.18)' : '#FFEDE1' }]}>
                  <TrophyIcon size={16} color={c.vipStreak} />
                </View>
                <View style={styles.avatarWrap}>
                  <Image source={{ uri: top3.avatarUrl }} style={styles.leaderboardAvatar} />
                  <View style={[styles.rankMiniPill, { backgroundColor: isDark ? '#D97706' : '#CA8A04' }]}>
                    <AppText variant="labelSm" color={c.onBrand} style={styles.rankMiniText}>3</AppText>
                  </View>
                </View>
                <View style={styles.playerInfo}>
                  <AppText variant="bodyMd" color={c.textPrimary} style={styles.semiBold} numberOfLines={1}>
                    {top3.name}
                  </AppText>
                  <AppText variant="labelSm" color={c.textDisabled}>
                    {top3.subtitle ?? 'Chuỗi 9 ngày'}
                  </AppText>
                </View>
              </View>
              <AppText variant="labelLg" color={c.textPrimary} style={styles.semiBold}>
                {top3.score.toLocaleString('vi-VN')} đ
              </AppText>
            </View>

            {/* User Highlight Row */}
            <View style={styles.userHighlightRow}>
              <View style={styles.leaderboardRowLeft}>
                <View style={styles.userRankCircle}>
                  <AppText variant="labelSm" color={c.onBrand} style={styles.bold}>{userRank}</AppText>
                </View>
                <View style={styles.userIconCircle}>
                  <UserSingleIcon size={16} color={c.onBrand} />
                </View>
                <View style={styles.playerInfo}>
                  <AppText variant="bodyMd" color={c.brandPrimary} style={styles.bold}>
                    Bạn (Tôi)
                  </AppText>
                  <View style={styles.userDeltaRow}>
                    <TrendingUpIcon size={13} color={c.brandPrimary} />
                    <AppText variant="labelSm" color={c.brandPrimary} style={[styles.semiBold, { marginLeft: 3 }]}>
                      +1 hôm nay
                    </AppText>
                  </View>
                </View>
              </View>
              <AppText variant="labelLg" color={c.brandPrimary} style={styles.bold}>
                {currentPoints} đ
              </AppText>
            </View>
          </View>
        </View>

        {/* ── Section: Active Challenges Carousel ───────────────────── */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithCount}>
              <AppText variant="headlineSm" color={c.textPrimary} style={styles.sectionTitle}>
                Thử thách đang tham gia
              </AppText>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Challenges')}
              accessibilityLabel="Xem tất cả thử thách"
            >
              <AppText variant="labelLg" color={c.brandPrimary} style={styles.bold}>
                Xem tất cả
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
              style={styles.challengeCard}
              onPress={() => navigation.navigate('ChallengeDetail', { challengeId: activeChallenges[0]?.id || 'challenge-water-7d' })}
              activeOpacity={0.88}
            >
              <View>
                <View style={styles.challengeCardTop}>
                  <View style={styles.challengeIconBox}>
                    <DropletsIcon size={20} color={c.trackerWater} />
                  </View>
                  <View style={[styles.challengeTag, { backgroundColor: c.brandSoftTint }]}>
                    <AppText variant="labelSm" color={c.brandPrimary} style={styles.bold}>
                      Gần xong!
                    </AppText>
                  </View>
                </View>
                <AppText variant="bodyLg" color={c.textPrimary} style={styles.challengeTitle} numberOfLines={1}>
                  {activeChallenges[0]?.title || 'Uống đủ nước 7 ngày'}
                </AppText>
                <View style={styles.progressSection}>
                  <View style={styles.progressTextRow}>
                    <AppText variant="labelSm" color={c.textSecondary}>Tiến độ</AppText>
                    <AppText variant="labelSm" color={c.textSecondary}>5/7 ngày (71%)</AppText>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: '71%', backgroundColor: c.trackerWater }]} />
                  </View>
                </View>
              </View>

              <View style={styles.challengeFooter}>
                <AppText variant="labelSm" color={c.textDisabled}>
                  Còn 2 ngày
                </AppText>
                <View style={styles.rewardBadge}>
                  <AppText variant="labelSm" color={c.vipStreak} style={styles.bold}>
                    +60 đ
                  </AppText>
                </View>
              </View>
            </TouchableOpacity>

            {/* Challenge 2 */}
            <TouchableOpacity
              style={styles.challengeCard}
              onPress={() => navigation.navigate('ChallengeDetail', { challengeId: activeChallenges[1]?.id || 'challenge-steps-50k' })}
              activeOpacity={0.88}
            >
              <View>
                <View style={styles.challengeCardTop}>
                  <View style={styles.challengeIconBox}>
                    <FootprintsIcon size={20} color={c.brandPrimary} />
                  </View>
                  <View style={[styles.challengeTag, { backgroundColor: c.surfaceHigh }]}>
                    <AppText variant="labelSm" color={c.textPrimary} style={styles.bold}>
                      Tuần này
                    </AppText>
                  </View>
                </View>
                <AppText variant="bodyLg" color={c.textPrimary} style={styles.challengeTitle} numberOfLines={1}>
                  {activeChallenges[1]?.title || 'Đi 50.000 bước tuần'}
                </AppText>
                <View style={styles.progressSection}>
                  <View style={styles.progressTextRow}>
                    <AppText variant="labelSm" color={c.textSecondary}>Tiến độ</AppText>
                    <AppText variant="labelSm" color={c.textSecondary}>32.500 / 50k (65%)</AppText>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: '65%', backgroundColor: c.brandPrimary }]} />
                  </View>
                </View>
              </View>

              <View style={styles.challengeFooter}>
                <AppText variant="labelSm" color={c.textDisabled}>
                  Còn 3 ngày
                </AppText>
                <View style={styles.rewardBadge}>
                  <AppText variant="labelSm" color={c.vipStreak} style={styles.bold}>
                    +80 đ
                  </AppText>
                </View>
              </View>
            </TouchableOpacity>

            {/* Explore Card CTA */}
            <TouchableOpacity
              style={styles.exploreCard}
              onPress={() => navigation.navigate('Challenges')}
              activeOpacity={0.85}
            >
              <View style={styles.exploreIconCircle}>
                <CirclePlusIcon size={24} color={c.brandPrimary} />
              </View>
              <AppText variant="labelLg" color={c.brandPrimary} style={[styles.bold, { marginTop: 8 }]}>
                Khám phá thử thách
              </AppText>
              <AppText variant="labelSm" color={c.vipStreak} style={styles.semiBold}>
                Tới +200 điểm
              </AppText>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* ── Section: Recent Badges ─────────────────────────────────── */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <AppText variant="headlineSm" color={c.textPrimary} style={styles.sectionTitle}>
              Huy hiệu gần đây
            </AppText>
            <View style={styles.badgesHeaderRight}>
              <AppText variant="labelSm" color={c.textSecondary}>
                Đã đạt {unlockedBadges.length}/{totalBadges}
              </AppText>
              <TouchableOpacity
                onPress={() => navigation.navigate('Badges')}
                accessibilityLabel="Xem tất cả huy hiệu"
                style={{ marginLeft: 6 }}
              >
                <AppText variant="labelLg" color={c.brandPrimary} style={styles.bold}>
                  Xem tất cả
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.badgesCard}>
            <View style={styles.badgesGrid}>
              {badges.slice(0, 4).map((badge) => {
                const visuals = getBadgeVisualConfig(badge);
                const isUnlocked = badge.isUnlocked;

                return (
                  <TouchableOpacity
                    key={badge.id}
                    style={[styles.badgeCol, !isUnlocked && { opacity: 0.75 }]}
                    onPress={() => navigation.navigate('Badges')}
                  >
                    <View
                      style={[
                        styles.badgeIconContainer,
                        {
                          backgroundColor: isUnlocked
                            ? visuals.primaryColor
                            : c.surfaceHigh,
                        },
                      ]}
                    >
                      {visuals.iconName === 'flame' ? (
                        <FlameIcon size={24} color={isUnlocked ? '#FFFFFF' : c.textDisabled} />
                      ) : visuals.iconName === 'book-open' ? (
                        <BookOpenIcon size={24} color={isUnlocked ? '#FFFFFF' : c.textDisabled} />
                      ) : visuals.iconName === 'users' ? (
                        <UsersIcon size={24} color={isUnlocked ? '#FFFFFF' : c.textDisabled} />
                      ) : visuals.iconName === 'calendar' ? (
                        <CalendarIcon size={22} color={isUnlocked ? '#FFFFFF' : c.textDisabled} />
                      ) : visuals.iconName === 'crown' ? (
                        <CrownIcon size={24} color={isUnlocked ? '#FFFFFF' : c.textDisabled} />
                      ) : visuals.iconName === 'badge-check' ? (
                        <BadgeCheckIcon size={24} color={isUnlocked ? '#FFFFFF' : c.textDisabled} />
                      ) : (
                        <TrophyIcon size={24} color={isUnlocked ? '#FFFFFF' : c.textDisabled} />
                      )}
                      {isUnlocked ? (
                        <View style={styles.checkCircle}>
                          <AppText style={styles.checkText}>✓</AppText>
                        </View>
                      ) : (
                        <View style={[styles.checkCircle, { backgroundColor: c.surfaceBorder }]}>
                          <LockClosedIcon size={8} color={c.textSecondary} />
                        </View>
                      )}
                    </View>
                    <AppText variant="labelSm" color={c.textPrimary} style={styles.badgeName} numberOfLines={1}>
                      {badge.title}
                    </AppText>
                    <AppText variant="labelSm" color={isUnlocked ? c.vipStreak : c.textDisabled} style={styles.bold}>
                      {isUnlocked ? `+${badge.points}đ` : 'Chưa mở'}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* ── Section: Friends ───────────────────────────────────────── */}
        <View style={styles.sectionWrap}>
          <View style={styles.friendsCard}>
            <TouchableOpacity
              style={styles.friendsTopRow}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('FriendsList')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <AppText variant="bodySm" color={c.textSecondary} style={styles.semiBold}>
                  {friends.length || 0} bạn bè đang hoạt động
                </AppText>
                <AppText variant="labelSm" color={c.brandPrimary} style={styles.bold}>
                  →
                </AppText>
              </View>
            </TouchableOpacity>

            <View style={styles.friendsButtonsRow}>
              <TouchableOpacity
                style={styles.primaryCtaBtn}
                onPress={() => navigation.navigate('FriendSearch')}
                activeOpacity={0.88}
              >
                <UserPlusIcon size={18} color={c.onBrand} />
                <AppText variant="labelLg" color={c.onBrand} style={styles.bold}>
                  Thêm bạn
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryCtaBtn}
                onPress={() => navigation.navigate('FriendRequests')}
                activeOpacity={0.88}
              >
                <MailInboxIcon size={18} color={c.brandPrimary} />
                <AppText variant="labelLg" color={c.brandPrimary} style={styles.bold}>
                  Lời mời
                </AppText>
                {incomingRequests.length > 0 && (
                  <View style={styles.dotIndicator} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: ThemeContextValue) {
  const { colors: c, spacing: s, radii: r, shadows: sh } = theme;
  const isDark = theme.scheme === 'dark';

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.canvasBase,
    },
    headerBar: {
      height: 56,
      paddingHorizontal: s.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: c.surfaceBorder,
      backgroundColor: c.canvasBase,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.sm,
    },
    backButton: {
      padding: s.xs,
      marginRight: 2,
    },
    gameIconBox: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.brandSoftTint,
    },
    headerTitle: {
      fontWeight: '700',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.sm,
    },
    streakPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.xs,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: r.full,
    },
    streakText: {
      fontSize: 16,
      lineHeight: 20,
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
    },
    profileAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.brandPrimary,
    },
    scrollContent: {
      paddingHorizontal: s.md,
      paddingBottom: 40,
      paddingTop: s.sm + s.xs,
    },
    canvasHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: s.md,
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
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceMid,
      position: 'relative',
      shadowColor: c.overlay,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
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
      backgroundColor: c.brandPrimary,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: '700',
    },
    heroCard: {
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceMid,
      shadowColor: c.brandPrimary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.25 : 0.08,
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
      backgroundColor: c.brandSoftTint,
      opacity: isDark ? 0.6 : 0.45,
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
      borderRadius: r.full,
      backgroundColor: isDark ? 'rgba(245, 158, 11, 0.18)' : '#FEF3C7',
    },
    pointsText: {
      fontWeight: '700',
    },
    divider: {
      height: 1,
      width: '100%',
      marginVertical: 12,
      backgroundColor: c.surfaceHigh,
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
      backgroundColor: c.brandSecondary,
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
      backgroundColor: c.brandSoftTint,
    },
    leaderboardCard: {
      borderRadius: 20,
      padding: 14,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceMid,
      shadowColor: c.brandPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.2 : 0.05,
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
    leaderboardRowRank1: {
      backgroundColor: isDark ? 'rgba(158, 100, 247, 0.12)' : '#F9F6FF',
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
      backgroundColor: isDark ? 'rgba(245, 158, 11, 0.22)' : '#FEF3C7',
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
      backgroundColor: c.surfaceHigh,
    },
    userRankCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.brandPrimary,
    },
    userIconCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.brandPrimary,
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
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceMid,
      justifyContent: 'space-between',
      shadowColor: c.brandPrimary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: isDark ? 0.2 : 0.05,
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
      backgroundColor: c.surfaceHigh,
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
      backgroundColor: c.progressTrack,
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
      backgroundColor: isDark ? 'rgba(245, 158, 11, 0.18)' : '#FEF3C7',
    },
    exploreCard: {
      width: 200,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceHigh,
      alignItems: 'center',
      justifyContent: 'center',
    },
    exploreIconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.brandSoftTint,
    },
    badgesHeaderRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    badgesCard: {
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceMid,
      shadowColor: c.brandPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.2 : 0.05,
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
      backgroundColor: c.surfaceMid,
      shadowColor: c.overlay,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 2,
      elevation: 2,
    },
    checkText: {
      fontSize: 10,
      fontWeight: '800',
      color: c.brandPrimary,
    },
    badgeName: {
      fontWeight: '600',
      textAlign: 'center',
    },
    friendsCard: {
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceMid,
      shadowColor: c.brandPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.2 : 0.05,
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
      borderColor: c.surfaceMid,
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
      borderColor: c.surfaceMid,
      backgroundColor: c.surfaceHigh,
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
      backgroundColor: c.brandAction,
      shadowColor: c.brandPrimary,
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
      backgroundColor: c.surfaceHigh,
    },
    dotIndicator: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: c.brandPrimary,
    },
    bold: {
      fontWeight: '700',
    },
    semiBold: {
      fontWeight: '600',
    },
  });
}
