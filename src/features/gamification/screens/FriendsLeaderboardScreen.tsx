import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from '@/components/common';
import {
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ClockIcon,
  CrownIcon,
  FlameIcon,
  FootprintsIcon,
  PartyPopperIcon,
  RotateCcwIcon,
  StarIcon,
  TrendingUpIcon,
  TrophyIcon,
  UserPlusIcon,
  UserSingleIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme, type ThemeContextValue } from '@/theme';
import { todayKey } from '@/features/nutrition/utils';
import type { LeaderboardMetric } from '../types';
import { useGamification } from '../GamificationProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'FriendsLeaderboard'>;

export function FriendsLeaderboardScreen({ navigation }: Props) {
  const theme = useTheme();
  const { colors: c } = theme;
  const isDark = theme.scheme === 'dark';
  const styles = useMemo(() => createStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const {
    incomingRequests,
    userPoints,
    streak,
    getLeaderboard,
  } = useGamification();

  const [metric, setMetric] = useState<LeaderboardMetric>('challenge');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate smooth skeleton on mount or pull-to-refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRefreshing(false);
    }, 500);
  };

  const leaderboard = getLeaderboard(metric);
  const isEmpty = leaderboard.length === 0;

  // Podium top 3
  const rank1 = leaderboard.find((e) => e.rank === 1);
  const rank2 = leaderboard.find((e) => e.rank === 2);
  const rank3 = leaderboard.find((e) => e.rank === 3);

  // Ranked list (4+)
  const restList = leaderboard.filter((e) => e.rank > 3);

  // Current user entry
  const userEntry = leaderboard.find((e) => e.isCurrentUser) || {
    rank: 5,
    score:
      metric === 'streak'
        ? (streak.currentStreak || 6)
        : metric === 'steps'
          ? 48500
          : (userPoints || 720),
    unit: metric === 'streak' ? 'ngày' : metric === 'steps' ? 'bước' : 'đ',
  };

  // ── Render Loading Skeleton ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView edges={['top']} style={styles.safe}>
        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Quay lại"
          >
            <ChevronLeftIcon size={22} color={c.textPrimary} />
          </TouchableOpacity>
          <AppText variant="headlineSm" color={c.textPrimary} style={styles.topBarTitle}>
            Bảng Xếp Hạng
          </AppText>
          <View style={styles.topBarRight}>
            <View style={[styles.iconBtn, { backgroundColor: c.surfaceHigh }]} />
            <View style={[styles.iconBtn, { backgroundColor: c.surfaceHigh }]} />
            <View style={[styles.avatarSmall, { backgroundColor: c.brandPrimary }]} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Skeleton Tabs */}
          <View style={styles.skeletonTabsBar}>
            <View style={styles.skeletonTabActive} />
            <View style={styles.skeletonTabPulse} />
            <View style={styles.skeletonTabPulse} />
          </View>

          {/* Skeleton Period */}
          <View style={styles.skeletonPeriodRow}>
            <View style={styles.skeletonPeriodChip}>
              <View style={[styles.skeletonLine, { width: 140 }]} />
            </View>
            <View style={styles.skeletonSyncRow}>
              <View style={[styles.pingCircle, { backgroundColor: c.brandPrimary }]} />
              <AppText variant="labelSm" color={c.textDisabled}>Đang đồng bộ...</AppText>
            </View>
          </View>

          {/* Skeleton Podium */}
          <View style={styles.skeletonPodiumWrap}>
            <View style={styles.skeletonPodiumCol}>
              <View style={styles.skeletonAvatar60} />
              <View style={[styles.skeletonLine, { width: 60, height: 12, marginTop: 6 }]} />
              <View style={[styles.skeletonPodiumStand, { height: 70 }]} />
            </View>
            <View style={[styles.skeletonPodiumCol, { marginTop: -16 }]}>
              <View style={styles.skeletonAvatar72} />
              <View style={[styles.skeletonLine, { width: 72, height: 14, marginTop: 6 }]} />
              <View style={[styles.skeletonPodiumStand, { height: 100 }]} />
            </View>
            <View style={styles.skeletonPodiumCol}>
              <View style={styles.skeletonAvatar60} />
              <View style={[styles.skeletonLine, { width: 60, height: 12, marginTop: 6 }]} />
              <View style={[styles.skeletonPodiumStand, { height: 50 }]} />
            </View>
          </View>

          {/* Skeleton Rows */}
          <View style={styles.skeletonListCard}>
            {[1, 2, 3, 4, 5].map((idx) => (
              <View key={idx} style={[styles.skeletonRow, { backgroundColor: idx % 2 === 0 ? c.surfaceHigh : c.surfaceMid }]}>
                <View style={styles.skeletonAvatar40} />
                <View style={{ flex: 1, gap: 6, marginLeft: 10 }}>
                  <View style={[styles.skeletonLine, { width: 100, height: 12 }]} />
                  <View style={[styles.skeletonLine, { width: 140, height: 10 }]} />
                </View>
                <View style={[styles.skeletonLine, { width: 50, height: 14 }]} />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Render Main Screen ──────────────────────────────────────────────────────
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      {/* ── Fixed Top Header ────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ChevronLeftIcon size={24} color={c.textPrimary} />
        </TouchableOpacity>

        <AppText variant="headlineSm" color={c.textPrimary} style={styles.topBarTitle}>
          Bảng Xếp Hạng
        </AppText>

        <View style={styles.topBarRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('FriendSearch')}
            accessibilityLabel="Thêm bạn bè"
          >
            <UserPlusIcon size={18} color={c.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* ── Segmented Control Bar ──────────────────────────────────── */}
        <View style={styles.tabSegmentBar}>
          <TouchableOpacity
            style={[
              styles.tabSegmentBtn,
              metric === 'challenge' && styles.tabSegmentActive,
            ]}
            onPress={() => setMetric('challenge')}
            activeOpacity={0.85}
          >
            <TrophyIcon
              size={16}
              color={metric === 'challenge' ? c.brandPrimary : c.textSecondary}
            />
            <AppText
              variant="labelMd"
              color={metric === 'challenge' ? c.brandPrimary : c.textSecondary}
              style={styles.bold}
            >
              Điểm
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabSegmentBtn,
              metric === 'streak' && styles.tabSegmentActive,
            ]}
            onPress={() => setMetric('streak')}
            activeOpacity={0.85}
          >
            <FlameIcon
              size={16}
              color={metric === 'streak' ? c.vipStreak : c.textSecondary}
            />
            <AppText
              variant="labelMd"
              color={metric === 'streak' ? c.brandPrimary : c.textSecondary}
              style={styles.bold}
            >
              Chuỗi ngày
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabSegmentBtn,
              metric === 'steps' && styles.tabSegmentActive,
            ]}
            onPress={() => setMetric('steps')}
            activeOpacity={0.85}
          >
            <FootprintsIcon
              size={16}
              color={metric === 'steps' ? c.brandPrimary : c.textSecondary}
            />
            <AppText
              variant="labelMd"
              color={metric === 'steps' ? c.brandPrimary : c.textSecondary}
              style={styles.bold}
            >
              Bước chân
            </AppText>
          </TouchableOpacity>
        </View>

        {/* ── Banner: Timing or Streak / Steps Spotlight ─────────────────────── */}
        {metric === 'challenge' ? (
          <View style={styles.cycleBanner}>
            <View style={styles.cycleBannerLeft}>
              <CalendarIcon size={16} color={c.brandPrimary} />
              <AppText variant="labelMd" color={c.textPrimary} style={styles.bold}>
                Tuần này · 23/11 – 29/11
              </AppText>
            </View>
            <View style={styles.cycleResetChip}>
              <ClockIcon size={13} color={c.vipStreak} />
              <AppText variant="bodySm" color={c.textSecondary} style={{ fontSize: 12 }}>
                Đặt lại vào Thứ Hai
              </AppText>
            </View>
          </View>
        ) : metric === 'streak' ? (
          <View style={styles.streakSpotlightBanner}>
            <View style={styles.spotlightLeft}>
              <View style={styles.spotlightIconCircle}>
                <FlameIcon size={18} color={c.vipStreak} />
              </View>
              <View style={styles.spotlightInfo}>
                <AppText variant="labelMd" color={c.textPrimary} style={styles.bold}>
                  Thử thách Giữ Lửa Tuần 18
                </AppText>
                <AppText variant="bodySm" color={c.textSecondary} numberOfLines={1}>
                  Hoàn thành mục tiêu trước 23:59 mỗi ngày
                </AppText>
              </View>
            </View>
            <View style={styles.spotlightChip}>
              <AppText variant="labelSm" color={c.brandPrimary} style={styles.bold}>
                Còn 2 ngày
              </AppText>
            </View>
          </View>
        ) : (
          <View style={styles.cycleBanner}>
            <View style={styles.cycleBannerLeft}>
              <FootprintsIcon size={16} color={c.brandPrimary} />
              <AppText variant="labelMd" color={c.textPrimary} style={styles.bold}>
                Vạn bước chân tuần này
              </AppText>
            </View>
            <View style={styles.cycleResetChip}>
              <RotateCcwIcon size={13} color={c.brandPrimary} />
              <AppText variant="bodySm" color={c.textSecondary} style={{ fontSize: 12 }}>
                Đồng bộ tự động
              </AppText>
            </View>
          </View>
        )}

        {/* ── Empty State Check ─────────────────────────────────────── */}
        {isEmpty ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCard}>
              <View style={styles.emptyIllustrationBox}>
                <View style={styles.emptyGlow} />
                <View style={styles.emptyAvatarLeft}>
                  <UserSingleIcon size={24} color={c.textDisabled} />
                </View>
                <View style={styles.emptyAvatarRight}>
                  <UserSingleIcon size={24} color={c.textDisabled} />
                </View>
                <View style={styles.emptyHubCenter}>
                  <View style={styles.emptyHubCircle}>
                    <UserPlusIcon size={22} color={c.brandPrimary} />
                  </View>
                </View>
                <View style={styles.emptyParticle1} />
                <View style={styles.emptyParticle2} />
              </View>

              <AppText variant="headlineSm" color={c.textPrimary} style={styles.emptyTitle}>
                Chưa có bạn bè nào trong bảng xếp hạng
              </AppText>
              <AppText variant="bodySm" color={c.textSecondary} style={styles.emptySubtext}>
                Mời bạn bè cùng tham gia để theo dõi tiến độ và tạo động lực rèn luyện mỗi ngày.
              </AppText>

              <TouchableOpacity
                style={styles.emptyCtaButton}
                onPress={() => navigation.navigate('FriendSearch')}
                activeOpacity={0.88}
              >
                <UserPlusIcon size={20} color={c.onBrand} />
                <AppText variant="labelLg" color={c.onBrand} style={styles.bold}>
                  Thêm bạn bè
                </AppText>
              </TouchableOpacity>
            </View>

            <View style={styles.socialPerkRow}>
              <PartyPopperIcon size={16} color={c.vipStreak} />
              <AppText variant="labelSm" color={c.textSecondary}>
                Nhận +50 điểm năng lượng cho mỗi người bạn gia nhập
              </AppText>
            </View>

            {/* Solo User Card */}
            <View style={styles.soloCard}>
              <View style={styles.soloCardLeft}>
                <View style={styles.soloRankCircle}>
                  <AppText variant="headlineSm" color={c.vipStreak} style={styles.bold}>
                    #1
                  </AppText>
                </View>
                <View style={styles.soloAvatarCircle}>
                  <UserSingleIcon size={20} color={c.onBrand} />
                  <View style={styles.soloCheckBadge}>
                    <CheckIcon size={9} color={c.onBrand} />
                  </View>
                </View>
                <View>
                  <View style={styles.soloNameRow}>
                    <AppText variant="labelLg" color={c.textPrimary} style={styles.bold}>
                      Bạn
                    </AppText>
                    <View style={styles.soloTag}>
                      <AppText variant="labelSm" color={c.brandPrimary} style={styles.bold}>
                        Hạng hiện tại
                      </AppText>
                    </View>
                  </View>
                  <AppText variant="bodySm" color={c.textSecondary}>
                    Sẵn sàng để thi đua
                  </AppText>
                </View>
              </View>

              <View style={styles.soloPointsWrap}>
                <AppText variant="headlineSm" color={c.brandPrimary} style={styles.bold}>
                  {userPoints || 720}
                </AppText>
                <AppText variant="labelSm" color={c.textSecondary}>
                  điểm
                </AppText>
              </View>
            </View>
          </View>
        ) : (
          <>
            {/* ── Top 3 Podium Section ─────────────────────────────────── */}
            <View style={styles.podiumCard}>
              {/* Rank 2 (Left) */}
              {rank2 && (
                <View style={styles.podiumCol}>
                  <View style={styles.podiumAvatarWrap}>
                    <View style={styles.podiumAvatarCircle}>
                      <Image source={{ uri: rank2.avatarUrl }} style={styles.avatarImg} />
                    </View>
                    <View style={styles.podiumRankBadge}>
                      <AppText variant="labelSm" color={c.textPrimary} style={styles.bold}>2</AppText>
                    </View>
                  </View>
                  <AppText variant="labelMd" color={c.textPrimary} numberOfLines={1} style={[styles.bold, { marginTop: 4 }]}>
                    {rank2.name}
                  </AppText>
                  <View style={styles.metricChip}>
                    {metric === 'streak' ? (
                      <FlameIcon size={12} color={c.vipStreak} />
                    ) : metric === 'steps' ? (
                      <FootprintsIcon size={12} color={c.brandPrimary} />
                    ) : (
                      <TrophyIcon size={12} color={c.vipStreak} />
                    )}
                    <AppText
                      variant="labelSm"
                      color={metric === 'steps' ? c.brandPrimary : c.vipStreak}
                      style={styles.bold}
                    >
                      {metric === 'streak'
                        ? `${rank2.score} ngày`
                        : metric === 'steps'
                          ? `${rank2.score.toLocaleString('vi-VN')} bước`
                          : `${rank2.score.toLocaleString('vi-VN')} đ`}
                    </AppText>
                  </View>
                  <View style={[styles.podiumStand, { height: 48 }]}>
                    <AppText variant="headlineSm" color={c.textDisabled} style={styles.bold}>#2</AppText>
                  </View>
                </View>
              )}

              {/* Rank 1 (Center Hero) */}
              {rank1 && (
                <View style={[styles.podiumCol, { marginTop: -16 }]}>
                  <View style={{ marginBottom: 2 }}>
                    <CrownIcon size={26} color={c.vipStreak} />
                  </View>
                  <View style={styles.podiumAvatarWrap}>
                    <View style={styles.podiumAvatarHero}>
                      <Image source={{ uri: rank1.avatarUrl }} style={styles.avatarImg} />
                    </View>
                    <View style={styles.podiumRankHeroBadge}>
                      <AppText variant="labelSm" color={c.onBrand} style={styles.bold}>1</AppText>
                    </View>
                  </View>
                  <AppText variant="labelLg" color={c.textPrimary} numberOfLines={1} style={[styles.bold, { marginTop: 4 }]}>
                    {rank1.name}
                  </AppText>
                  <View style={[styles.metricChip, { backgroundColor: isDark ? 'rgba(217, 119, 6, 0.25)' : '#FFDCC3' }]}>
                    {metric === 'streak' ? (
                      <FlameIcon size={13} color={c.vipStreak} />
                    ) : metric === 'steps' ? (
                      <FootprintsIcon size={13} color={c.vipStreak} />
                    ) : (
                      <TrophyIcon size={13} color={c.vipStreak} />
                    )}
                    <AppText variant="labelSm" color={c.vipStreak} style={styles.bold}>
                      {metric === 'streak'
                        ? `${rank1.score} ngày`
                        : metric === 'steps'
                          ? `${rank1.score.toLocaleString('vi-VN')} bước`
                          : `${rank1.score.toLocaleString('vi-VN')} đ`}
                    </AppText>
                  </View>
                  <View style={[styles.podiumStand, { height: 80, backgroundColor: c.brandSoftTint }]}>
                    <TrophyIcon size={18} color={c.brandPrimary} />
                    <AppText variant="labelSm" color={c.brandPrimary} style={[styles.bold, { marginTop: 2 }]}>
                      Quán quân
                    </AppText>
                  </View>
                </View>
              )}

              {/* Rank 3 (Right) */}
              {rank3 && (
                <View style={styles.podiumCol}>
                  <View style={styles.podiumAvatarWrap}>
                    <View style={styles.podiumAvatarCircle}>
                      <Image source={{ uri: rank3.avatarUrl }} style={styles.avatarImg} />
                    </View>
                    <View style={[styles.podiumRankBadge, { backgroundColor: isDark ? 'rgba(217, 119, 6, 0.25)' : '#FFDCC3' }]}>
                      <AppText variant="labelSm" color={c.vipStreak} style={styles.bold}>3</AppText>
                    </View>
                  </View>
                  <AppText variant="labelMd" color={c.textPrimary} numberOfLines={1} style={[styles.bold, { marginTop: 4 }]}>
                    {rank3.name}
                  </AppText>
                  <View style={styles.metricChip}>
                    {metric === 'streak' ? (
                      <FlameIcon size={12} color={c.vipStreak} />
                    ) : metric === 'steps' ? (
                      <FootprintsIcon size={12} color={c.brandPrimary} />
                    ) : (
                      <TrophyIcon size={12} color={c.vipStreak} />
                    )}
                    <AppText
                      variant="labelSm"
                      color={metric === 'steps' ? c.brandPrimary : c.textSecondary}
                      style={styles.bold}
                    >
                      {metric === 'streak'
                        ? `${rank3.score} ngày`
                        : metric === 'steps'
                          ? `${rank3.score.toLocaleString('vi-VN')} bước`
                          : `${rank3.score.toLocaleString('vi-VN')} đ`}
                    </AppText>
                  </View>
                  <View style={[styles.podiumStand, { height: 36 }]}>
                    <AppText variant="labelSm" color={c.textDisabled} style={styles.bold}>#3</AppText>
                  </View>
                </View>
              )}
            </View>

            {/* ── Ranked List (Rank 4+) ───────────────────────────────── */}
            <View style={styles.rankedListCard}>
              {restList.map((entry, index) => {
                const isHighlightJump = entry.rankChange && entry.rankChange.includes('+2');
                return (
                  <View key={entry.id || index}>
                    <View
                      style={[
                        styles.rankedRow,
                        isHighlightJump && { backgroundColor: c.brandSoftTint, borderRadius: 12 },
                      ]}
                    >
                      <View style={styles.rankedRowLeft}>
                        <View style={styles.rankNumCol}>
                          <AppText
                            variant="labelMd"
                            color={isHighlightJump ? c.brandPrimary : c.textSecondary}
                            style={styles.bold}
                          >
                            {entry.rank}
                          </AppText>
                          {entry.rankChange && (
                            <AppText variant="labelSm" color={c.brandPrimary} style={styles.rankDeltaText}>
                              {entry.rankChange}
                            </AppText>
                          )}
                        </View>

                        <View style={styles.rankedAvatarWrap}>
                          <Image source={{ uri: entry.avatarUrl }} style={styles.avatarImg} />
                          {isHighlightJump && (
                            <View style={styles.pingBadge} />
                          )}
                        </View>

                        <View style={styles.rankedInfoCol}>
                          <View style={styles.rankedNameRow}>
                            <AppText variant="labelMd" color={c.textPrimary} style={styles.bold} numberOfLines={1}>
                              {entry.name}
                            </AppText>
                            {isHighlightJump && (
                              <View style={styles.jumpBadge}>
                                <AppText variant="labelSm" color={c.onBrand} style={{ fontSize: 9, fontWeight: '700' }}>
                                  THĂNG HẠNG
                                </AppText>
                              </View>
                            )}
                          </View>
                          <AppText variant="labelSm" color={c.textSecondary} numberOfLines={1}>
                            {entry.subtitle ?? `Chuỗi ${entry.streakDays ?? 5} ngày`}
                          </AppText>
                        </View>
                      </View>

                      <View style={styles.rankedScoreChip}>
                        {metric === 'streak' ? (
                          <FlameIcon size={14} color={c.vipStreak} />
                        ) : metric === 'steps' ? (
                          <FootprintsIcon size={13} color={c.brandPrimary} />
                        ) : (
                          <TrophyIcon size={13} color={c.vipStreak} />
                        )}
                        <AppText
                          variant="labelMd"
                          color={isHighlightJump ? c.brandPrimary : c.textPrimary}
                          style={styles.bold}
                        >
                          {metric === 'streak'
                            ? `${entry.score} ngày`
                            : metric === 'steps'
                              ? `${entry.score.toLocaleString('vi-VN')} bước`
                              : `${entry.score.toLocaleString('vi-VN')} đ`}
                        </AppText>
                      </View>
                    </View>
                    {index < restList.length - 1 && (
                      <View style={styles.rowDivider} />
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      {/* ── Sticky Bottom "Hạng của tôi" Card ──────────────────────── */}
      <View style={[styles.stickyBottomContainer, { paddingBottom: Math.max(12, insets.bottom) }]}>
        <View style={styles.stickyCard}>
          <View style={styles.stickyTopRow}>
            <View style={styles.stickyLeft}>
              <View style={styles.stickyRankBadge}>
                <AppText variant="labelSm" color={c.onBrand} style={styles.bold}>
                  #{userEntry.rank}
                </AppText>
              </View>

              <View style={styles.stickyAvatarWrap}>
                <View style={styles.stickyAvatarCircle}>
                  <UserSingleIcon size={18} color={c.brandPrimary} />
                </View>
                <View style={styles.stickyStarBadge}>
                  <StarIcon size={8} color={c.onBrand} />
                </View>
              </View>

              <View style={styles.stickyUserText}>
                <View style={styles.stickyNameRow}>
                  <AppText variant="labelLg" color={c.textPrimary} style={styles.bold}>
                    Bạn
                  </AppText>
                  <View style={styles.stickyPill}>
                    <AppText variant="labelSm" color={c.brandPrimary} style={styles.bold}>
                      Hạng của tôi
                    </AppText>
                  </View>
                </View>
                <AppText variant="labelSm" color={c.textSecondary} numberOfLines={1}>
                  {metric === 'streak'
                    ? 'Chuỗi lửa đang cháy ổn định'
                    : metric === 'steps'
                      ? 'Còn 2.700 bước để vượt Minh Anh'
                      : 'Còn 140 đ để vượt Minh Anh'}
                </AppText>
              </View>
            </View>

            <View style={styles.stickyRightScore}>
              <View style={styles.scoreCol}>
                <AppText
                  variant="labelLg"
                  color={metric === 'challenge' ? c.vipStreak : c.brandPrimary}
                  style={[styles.bold, { fontWeight: '700' }]}
                >
                  {userEntry.score.toLocaleString('vi-VN')}
                </AppText>
                <AppText
                  variant="labelSm"
                  color={metric === 'challenge' ? c.vipStreak : c.textSecondary}
                  style={{ fontSize: 10, fontWeight: '700' }}
                >
                  {metric === 'streak' ? 'ngày' : metric === 'steps' ? 'bước' : 'đ'}
                </AppText>
              </View>
              <View style={styles.stickyTrendingBox}>
                <TrendingUpIcon size={16} color={c.brandPrimary} />
              </View>
            </View>
          </View>

          {/* Prompt row for Streak Tab */}
          {metric === 'streak' && (
            <View style={styles.streakPromptRow}>
              <View style={styles.streakPromptLeft}>
                <FlameIcon size={15} color={c.vipStreak} />
                <AppText variant="bodySm" color={c.textPrimary} numberOfLines={1}>
                  Còn <AppText variant="bodySm" color={c.vipStreak} style={styles.bold}>1 ngày</AppText> để vượt Minh Anh
                </AppText>
              </View>
              <TouchableOpacity
                style={styles.recordNowBtn}
                onPress={() => navigation.navigate('FoodSearch', { date: todayKey(), meal: 'breakfast' })}
                activeOpacity={0.85}
              >
                <AppText variant="labelSm" color={c.onBrand} style={styles.bold}>
                  Ghi nhận ngay
                </AppText>
              </TouchableOpacity>
            </View>
          )}

          {/* Prompt row for Steps Tab */}
          {metric === 'steps' && (
            <View style={styles.streakPromptRow}>
              <View style={styles.streakPromptLeft}>
                <FootprintsIcon size={15} color={c.brandPrimary} />
                <AppText variant="bodySm" color={c.textPrimary} numberOfLines={1}>
                  Còn <AppText variant="bodySm" color={c.brandPrimary} style={styles.bold}>1.500 bước</AppText> để đạt mốc 50.000 tuần này
                </AppText>
              </View>
              <View style={styles.recordNowBtn}>
                <AppText variant="labelSm" color={c.onBrand} style={styles.bold}>
                  Đang đếm bước
                </AppText>
              </View>
            </View>
          )}
        </View>
      </View>
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
    topBar: {
      height: 56,
      paddingHorizontal: s.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: c.surfaceBorder,
      backgroundColor: c.canvasBase,
    },
    backButton: {
      padding: s.xs,
      marginLeft: -4,
    },
    topBarTitle: {
      fontWeight: '700',
    },
    topBarRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.sm,
    },
    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundColor: c.surfaceHigh,
    },
    notifBadge: {
      position: 'absolute',
      top: 2,
      right: 2,
      minWidth: 14,
      height: 14,
      borderRadius: 7,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 2,
      backgroundColor: c.brandPrimary,
    },
    notifText: {
      fontSize: 9,
      fontWeight: '700',
    },
    avatarSmall: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.brandPrimary,
    },
    scrollContent: {
      paddingHorizontal: s.md,
      paddingTop: s.sm + s.xs,
    },
    tabSegmentBar: {
      flexDirection: 'row',
      borderRadius: 30,
      padding: 4,
      marginBottom: s.sm + s.xs,
      backgroundColor: c.surfaceHigh,
    },
    tabSegmentBtn: {
      flex: 1,
      height: 36,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    tabSegmentActive: {
      backgroundColor: c.surfaceMid,
      shadowColor: c.brandPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    cycleBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 14,
      marginBottom: s.md,
      backgroundColor: c.surfaceHigh,
    },
    cycleBannerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    cycleResetChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: c.surfaceMid,
    },
    streakSpotlightBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 14,
      marginBottom: s.md,
      backgroundColor: c.surfaceHigh,
    },
    spotlightLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    spotlightIconCircle: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? 'rgba(217, 119, 6, 0.25)' : '#FFDCC3',
    },
    spotlightInfo: {
      flex: 1,
    },
    spotlightChip: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 14,
      backgroundColor: c.surfaceMid,
      shadowColor: c.overlay,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    podiumCard: {
      borderRadius: 22,
      paddingHorizontal: 14,
      paddingTop: 24,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceMid,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: s.md,
      shadowColor: c.brandPrimary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.2 : 0.06,
      shadowRadius: 16,
      elevation: 3,
    },
    podiumCol: {
      flex: 1,
      alignItems: 'center',
    },
    podiumAvatarWrap: {
      position: 'relative',
      alignItems: 'center',
    },
    podiumAvatarCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      overflow: 'hidden',
      backgroundColor: c.surfaceHigh,
    },
    podiumAvatarHero: {
      width: 68,
      height: 68,
      borderRadius: 34,
      borderWidth: 3,
      borderColor: isDark ? 'rgba(217, 119, 6, 0.4)' : '#FFDCC3',
      overflow: 'hidden',
    },
    avatarImg: {
      width: '100%',
      height: '100%',
    },
    podiumRankBadge: {
      position: 'absolute',
      bottom: -6,
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceHigh,
    },
    podiumRankHeroBadge: {
      position: 'absolute',
      bottom: -6,
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.vipStreak,
    },
    metricChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      marginTop: 4,
      backgroundColor: c.surfaceHigh,
    },
    podiumStand: {
      width: '100%',
      borderTopLeftRadius: 14,
      borderTopRightRadius: 14,
      marginTop: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceHigh,
    },
    rankedListCard: {
      borderRadius: 20,
      padding: 8,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceMid,
      shadowColor: c.brandPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.2 : 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    rankedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      paddingHorizontal: 8,
    },
    rankedRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 8,
    },
    rankNumCol: {
      width: 26,
      alignItems: 'center',
    },
    rankDeltaText: {
      fontSize: 9,
      fontWeight: '700',
      lineHeight: 11,
    },
    rankedAvatarWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      overflow: 'hidden',
      position: 'relative',
    },
    pingBadge: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: c.brandPrimary,
    },
    rankedInfoCol: {
      flex: 1,
      gap: 2,
    },
    rankedNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    jumpBadge: {
      paddingHorizontal: 5,
      paddingVertical: 1,
      borderRadius: 6,
      backgroundColor: c.brandPrimary,
    },
    rankedScoreChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      backgroundColor: c.surfaceHigh,
    },
    rowDivider: {
      height: 1,
      marginHorizontal: 10,
      backgroundColor: c.surfaceHigh,
    },
    stickyBottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 14,
    },
    stickyCard: {
      borderRadius: 20,
      padding: 12,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceMid,
      shadowColor: c.brandPrimary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.35 : 0.16,
      shadowRadius: 20,
      elevation: 6,
      gap: 8,
    },
    stickyTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    stickyLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    stickyRankBadge: {
      width: 28,
      height: 28,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.brandPrimary,
    },
    stickyAvatarWrap: {
      position: 'relative',
    },
    stickyAvatarCircle: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.brandSoftTint,
    },
    stickyStarBadge: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: 14,
      height: 14,
      borderRadius: 7,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.brandPrimary,
    },
    stickyUserText: {
      flex: 1,
    },
    stickyNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    stickyPill: {
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 8,
      backgroundColor: c.brandSoftTint,
    },
    stickyRightScore: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    scoreCol: {
      alignItems: 'flex-end',
    },
    stickyTrendingBox: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceHigh,
    },
    streakPromptRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: c.surfaceHigh,
    },
    streakPromptLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flex: 1,
    },
    recordNowBtn: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      backgroundColor: c.brandPrimary,
    },

    // Empty State Styles
    emptyContainer: {
      gap: 16,
      marginTop: 8,
    },
    emptyCard: {
      borderRadius: 22,
      padding: 24,
      alignItems: 'center',
      textAlign: 'center',
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceMid,
    },
    emptyIllustrationBox: {
      width: 140,
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      marginBottom: 8,
    },
    emptyGlow: {
      position: 'absolute',
      width: 100,
      height: 80,
      borderRadius: 40,
      opacity: 0.5,
      backgroundColor: c.brandSoftTint,
    },
    emptyAvatarLeft: {
      position: 'absolute',
      left: 10,
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceHigh,
    },
    emptyAvatarRight: {
      position: 'absolute',
      right: 10,
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceHigh,
    },
    emptyHubCenter: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceMid,
      shadowColor: c.overlay,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    emptyHubCircle: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.brandSoftTint,
    },
    emptyParticle1: {
      position: 'absolute',
      top: 6,
      right: 14,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: isDark ? 'rgba(217, 119, 6, 0.25)' : '#FFDCC3',
    },
    emptyParticle2: {
      position: 'absolute',
      bottom: 8,
      left: 12,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: c.brandSoftTint,
    },
    emptyTitle: {
      fontWeight: '700',
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 6,
    },
    emptySubtext: {
      textAlign: 'center',
      lineHeight: 18,
      marginBottom: 16,
      paddingHorizontal: 10,
    },
    emptyCtaButton: {
      height: 46,
      paddingHorizontal: 24,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      width: '100%',
      maxWidth: 240,
      backgroundColor: c.brandAction,
    },
    socialPerkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    soloCard: {
      borderRadius: 18,
      padding: 14,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceMid,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    soloCardLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    soloRankCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? 'rgba(217, 119, 6, 0.25)' : '#FFDCC3',
    },
    soloAvatarCircle: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundColor: c.brandPrimary,
    },
    soloCheckBadge: {
      position: 'absolute',
      bottom: -1,
      right: -1,
      width: 14,
      height: 14,
      borderRadius: 7,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.brandPrimary,
    },
    soloNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    soloTag: {
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 8,
      backgroundColor: c.surfaceHigh,
    },
    soloPointsWrap: {
      alignItems: 'flex-end',
    },

    // Skeleton Styles
    skeletonTabsBar: {
      height: 40,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 4,
      marginBottom: 14,
      backgroundColor: c.surfaceHigh,
    },
    skeletonTabActive: {
      flex: 1,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.surfaceMid,
    },
    skeletonTabPulse: {
      flex: 1,
      height: 16,
      borderRadius: 8,
      marginHorizontal: 12,
      backgroundColor: c.surfaceHigh,
    },
    skeletonPeriodRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    skeletonPeriodChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 14,
      backgroundColor: c.surfaceHigh,
    },
    skeletonSyncRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    pingCircle: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    skeletonPodiumWrap: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: 12,
      paddingTop: 16,
      marginBottom: 18,
    },
    skeletonPodiumCol: {
      flex: 1,
      alignItems: 'center',
    },
    skeletonAvatar60: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: c.surfaceHigh,
    },
    skeletonAvatar72: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: c.surfaceHigh,
    },
    skeletonPodiumStand: {
      width: '100%',
      borderTopLeftRadius: 14,
      borderTopRightRadius: 14,
      marginTop: 8,
      backgroundColor: c.surfaceHigh,
    },
    skeletonListCard: {
      borderRadius: 20,
      padding: 8,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceMid,
      gap: 6,
    },
    skeletonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderRadius: 14,
    },
    skeletonAvatar40: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.surfaceHigh,
    },
    skeletonLine: {
      height: 10,
      borderRadius: 5,
      backgroundColor: c.surfaceHigh,
    },
    bold: { fontWeight: '700' },
  });
}
