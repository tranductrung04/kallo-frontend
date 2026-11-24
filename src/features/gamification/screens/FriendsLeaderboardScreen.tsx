import React, { useEffect, useState } from 'react';
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
  LockClosedIcon,
  MailInboxIcon,
  PartyPopperIcon,
  StarIcon,
  TrendingUpIcon,
  TrophyIcon,
  UserPlusIcon,
  UserSingleIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import type { LeaderboardMetric } from '../types';
import { useGamification } from '../GamificationProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'FriendsLeaderboard'>;

export function FriendsLeaderboardScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme.scheme === 'dark';
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

  // Color tokens aligned with Daylight / Nocturne Vitality
  const colors = {
    canvas: theme.colors.canvasBase,
    surface: theme.colors.surfaceMid,
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
    secondaryFixedDim: isDark ? 'rgba(164, 118, 254, 0.4)' : '#D3BBFF',
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
    score: metric === 'streak' ? (streak.currentStreak || 6) : (userPoints || 720),
    unit: metric === 'streak' ? 'ngày' : 'điểm',
  };

  // ── Render Loading Skeleton ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: colors.canvas }]}>
        {/* Header */}
        <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Quay lại"
          >
            <ChevronLeftIcon size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.topBarTitle}>
            Bảng Xếp Hạng
          </AppText>
          <View style={styles.topBarRight}>
            <View style={[styles.iconBtn, { backgroundColor: colors.cardHigh }]} />
            <View style={[styles.iconBtn, { backgroundColor: colors.cardHigh }]} />
            <View style={[styles.avatarSmall, { backgroundColor: colors.primary }]} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Skeleton Tabs */}
          <View style={[styles.skeletonTabsBar, { backgroundColor: colors.cardHigh }]}>
            <View style={[styles.skeletonTabActive, { backgroundColor: colors.surface }]} />
            <View style={[styles.skeletonTabPulse, { backgroundColor: colors.cardHighest }]} />
            <View style={[styles.skeletonTabPulse, { backgroundColor: colors.cardHighest }]} />
          </View>

          {/* Skeleton Period */}
          <View style={styles.skeletonPeriodRow}>
            <View style={[styles.skeletonPeriodChip, { backgroundColor: colors.cardLow }]}>
              <View style={[styles.skeletonLine, { width: 140, backgroundColor: colors.cardHighest }]} />
            </View>
            <View style={styles.skeletonSyncRow}>
              <View style={[styles.pingCircle, { backgroundColor: colors.primaryContainer }]} />
              <AppText variant="labelSm" color={colors.textOutline}>Đang đồng bộ...</AppText>
            </View>
          </View>

          {/* Skeleton Podium */}
          <View style={styles.skeletonPodiumWrap}>
            <View style={styles.skeletonPodiumCol}>
              <View style={[styles.skeletonAvatar60, { backgroundColor: colors.cardHighest }]} />
              <View style={[styles.skeletonLine, { width: 60, height: 12, marginTop: 6, backgroundColor: colors.cardHighest }]} />
              <View style={[styles.skeletonPodiumStand, { height: 70, backgroundColor: colors.cardHigh }]} />
            </View>
            <View style={[styles.skeletonPodiumCol, { marginTop: -16 }]}>
              <View style={[styles.skeletonAvatar72, { backgroundColor: colors.cardHighest }]} />
              <View style={[styles.skeletonLine, { width: 72, height: 14, marginTop: 6, backgroundColor: colors.cardHighest }]} />
              <View style={[styles.skeletonPodiumStand, { height: 100, backgroundColor: colors.cardHigh }]} />
            </View>
            <View style={styles.skeletonPodiumCol}>
              <View style={[styles.skeletonAvatar60, { backgroundColor: colors.cardHighest }]} />
              <View style={[styles.skeletonLine, { width: 60, height: 12, marginTop: 6, backgroundColor: colors.cardHighest }]} />
              <View style={[styles.skeletonPodiumStand, { height: 50, backgroundColor: colors.cardHigh }]} />
            </View>
          </View>

          {/* Skeleton Rows */}
          <View style={[styles.skeletonListCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {[1, 2, 3, 4, 5].map((idx) => (
              <View key={idx} style={[styles.skeletonRow, { backgroundColor: idx % 2 === 0 ? colors.cardLow : colors.surface }]}>
                <View style={[styles.skeletonAvatar40, { backgroundColor: colors.cardHighest }]} />
                <View style={{ flex: 1, gap: 6, marginLeft: 10 }}>
                  <View style={[styles.skeletonLine, { width: 100, height: 12, backgroundColor: colors.cardHighest }]} />
                  <View style={[styles.skeletonLine, { width: 140, height: 10, backgroundColor: colors.cardHigh }]} />
                </View>
                <View style={[styles.skeletonLine, { width: 50, height: 14, backgroundColor: colors.cardHighest }]} />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Render Main Screen ──────────────────────────────────────────────────────
  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: colors.canvas }]}>
      {/* ── Fixed Top Header ────────────────────────────────────────── */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ChevronLeftIcon size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <AppText variant="headlineSm" color={colors.textPrimary} style={styles.topBarTitle}>
          Bảng Xếp Hạng
        </AppText>

        <View style={styles.topBarRight}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.cardHigh }]}
            onPress={() => navigation.navigate('FriendSearch')}
            accessibilityLabel="Thêm bạn bè"
          >
            <UserPlusIcon size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.cardHigh }]}
            onPress={() => navigation.navigate('FriendRequests')}
            accessibilityLabel="Lời mời kết bạn"
          >
            <MailInboxIcon size={18} color={colors.textSecondary} />
            {incomingRequests.length > 0 && (
              <View style={[styles.notifBadge, { backgroundColor: colors.primary }]}>
                <AppText variant="labelSm" color="#FFFFFF" style={styles.notifText}>
                  {incomingRequests.length}
                </AppText>
              </View>
            )}
          </TouchableOpacity>

          <View style={[styles.avatarSmall, { backgroundColor: colors.primary }]}>
            <UserSingleIcon size={16} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* ── Segmented Control Bar ──────────────────────────────────── */}
        <View style={[styles.tabSegmentBar, { backgroundColor: colors.cardHigh }]}>
          <TouchableOpacity
            style={[
              styles.tabSegmentBtn,
              metric === 'challenge' && [styles.tabSegmentActive, { backgroundColor: colors.surface }],
            ]}
            onPress={() => setMetric('challenge')}
            activeOpacity={0.85}
          >
            <TrophyIcon
              size={16}
              color={metric === 'challenge' ? colors.primary : colors.textSecondary}
            />
            <AppText
              variant="labelMd"
              color={metric === 'challenge' ? colors.primary : colors.textSecondary}
              style={styles.bold}
            >
              Điểm
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabSegmentBtn,
              metric === 'streak' && [styles.tabSegmentActive, { backgroundColor: colors.surface }],
            ]}
            onPress={() => setMetric('streak')}
            activeOpacity={0.85}
          >
            <FlameIcon
              size={16}
              color={metric === 'streak' ? colors.tertiary : colors.textSecondary}
            />
            <AppText
              variant="labelMd"
              color={metric === 'streak' ? colors.primary : colors.textSecondary}
              style={styles.bold}
            >
              Chuỗi ngày
            </AppText>
          </TouchableOpacity>

          <View style={[styles.tabSegmentBtn, { opacity: 0.6 }]}>
            <AppText variant="labelMd" color={colors.textOutline}>
              Bước chân
            </AppText>
            <View style={{ marginLeft: 3 }}>
              <LockClosedIcon size={13} color={colors.textOutline} />
            </View>
          </View>
        </View>

        {/* ── Banner: Timing or Streak Spotlight ─────────────────────── */}
        {metric === 'challenge' ? (
          <View style={[styles.cycleBanner, { backgroundColor: colors.cardLow }]}>
            <View style={styles.cycleBannerLeft}>
              <CalendarIcon size={16} color={colors.primary} />
              <AppText variant="labelMd" color={colors.textPrimary} style={styles.bold}>
                Tuần này · 23/11 – 29/11
              </AppText>
            </View>
            <View style={[styles.cycleResetChip, { backgroundColor: colors.surface }]}>
              <ClockIcon size={13} color={colors.tertiary} />
              <AppText variant="bodySm" color={colors.textSecondary} style={{ fontSize: 12 }}>
                Đặt lại vào Thứ Hai
              </AppText>
            </View>
          </View>
        ) : (
          <View style={[styles.streakSpotlightBanner, { backgroundColor: colors.cardLow }]}>
            <View style={styles.spotlightLeft}>
              <View style={[styles.spotlightIconCircle, { backgroundColor: colors.tertiaryFixed }]}>
                <FlameIcon size={18} color={colors.tertiary} />
              </View>
              <View style={styles.spotlightInfo}>
                <AppText variant="labelMd" color={colors.textPrimary} style={styles.bold}>
                  Thử thách Giữ Lửa Tuần 18
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary} numberOfLines={1}>
                  Hoàn thành mục tiêu trước 23:59 mỗi ngày
                </AppText>
              </View>
            </View>
            <View style={[styles.spotlightChip, { backgroundColor: colors.surface }]}>
              <AppText variant="labelSm" color={colors.primary} style={styles.bold}>
                Còn 2 ngày
              </AppText>
            </View>
          </View>
        )}

        {/* ── Empty State Check ─────────────────────────────────────── */}
        {isEmpty ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.emptyIllustrationBox}>
                <View style={[styles.emptyGlow, { backgroundColor: colors.primaryFixed }]} />
                <View style={[styles.emptyAvatarLeft, { backgroundColor: colors.cardHigh }]}>
                  <UserSingleIcon size={24} color={colors.textOutline} />
                </View>
                <View style={[styles.emptyAvatarRight, { backgroundColor: colors.cardHighest }]}>
                  <UserSingleIcon size={24} color={colors.textOutline} />
                </View>
                <View style={[styles.emptyHubCenter, { backgroundColor: colors.surface }]}>
                  <View style={[styles.emptyHubCircle, { backgroundColor: colors.secondaryFixed }]}>
                    <UserPlusIcon size={22} color={colors.primary} />
                  </View>
                </View>
                <View style={[styles.emptyParticle1, { backgroundColor: colors.tertiaryFixed }]} />
                <View style={[styles.emptyParticle2, { backgroundColor: colors.secondaryFixedDim }]} />
              </View>

              <AppText variant="headlineSm" color={colors.textPrimary} style={styles.emptyTitle}>
                Chưa có bạn bè nào trong bảng xếp hạng
              </AppText>
              <AppText variant="bodySm" color={colors.textSecondary} style={styles.emptySubtext}>
                Mời bạn bè cùng tham gia để theo dõi tiến độ và tạo động lực rèn luyện mỗi ngày.
              </AppText>

              <TouchableOpacity
                style={[styles.emptyCtaButton, { backgroundColor: colors.primaryContainer }]}
                onPress={() => navigation.navigate('FriendSearch')}
                activeOpacity={0.88}
              >
                <UserPlusIcon size={20} color="#FFFFFF" />
                <AppText variant="labelLg" color="#FFFFFF" style={styles.bold}>
                  Thêm bạn bè
                </AppText>
              </TouchableOpacity>
            </View>

            <View style={styles.socialPerkRow}>
              <PartyPopperIcon size={16} color={colors.tertiary} />
              <AppText variant="labelSm" color={colors.textSecondary}>
                Nhận +50 điểm năng lượng cho mỗi người bạn gia nhập
              </AppText>
            </View>

            {/* Solo User Card */}
            <View style={[styles.soloCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.soloCardLeft}>
                <View style={[styles.soloRankCircle, { backgroundColor: colors.tertiaryFixed }]}>
                  <AppText variant="headlineSm" color={colors.onTertiaryFixed} style={styles.bold}>
                    #1
                  </AppText>
                </View>
                <View style={[styles.soloAvatarCircle, { backgroundColor: colors.primary }]}>
                  <UserSingleIcon size={20} color="#FFFFFF" />
                  <View style={[styles.soloCheckBadge, { backgroundColor: colors.primaryContainer }]}>
                    <CheckIcon size={9} color="#FFFFFF" />
                  </View>
                </View>
                <View>
                  <View style={styles.soloNameRow}>
                    <AppText variant="labelLg" color={colors.textPrimary} style={styles.bold}>
                      Bạn
                    </AppText>
                    <View style={[styles.soloTag, { backgroundColor: colors.cardLow }]}>
                      <AppText variant="labelSm" color={colors.primary} style={styles.bold}>
                        Hạng hiện tại
                      </AppText>
                    </View>
                  </View>
                  <AppText variant="bodySm" color={colors.textSecondary}>
                    Sẵn sàng để thi đua
                  </AppText>
                </View>
              </View>

              <View style={styles.soloPointsWrap}>
                <AppText variant="headlineSm" color={colors.primary} style={styles.bold}>
                  {userPoints || 720}
                </AppText>
                <AppText variant="labelSm" color={colors.textSecondary}>
                  điểm
                </AppText>
              </View>
            </View>
          </View>
        ) : (
          <>
            {/* ── Top 3 Podium Section ─────────────────────────────────── */}
            <View style={[styles.podiumCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {/* Rank 2 (Left) */}
              {rank2 && (
                <View style={styles.podiumCol}>
                  <View style={styles.podiumAvatarWrap}>
                    <View style={[styles.podiumAvatarCircle, { backgroundColor: colors.cardHigh }]}>
                      <Image source={{ uri: rank2.avatarUrl }} style={styles.avatarImg} />
                    </View>
                    <View style={[styles.podiumRankBadge, { backgroundColor: colors.cardHighest }]}>
                      <AppText variant="labelSm" color={colors.textPrimary} style={styles.bold}>2</AppText>
                    </View>
                  </View>
                  <AppText variant="labelMd" color={colors.textPrimary} numberOfLines={1} style={[styles.bold, { marginTop: 4 }]}>
                    {rank2.name}
                  </AppText>
                  <View style={[styles.metricChip, { backgroundColor: colors.cardLow }]}>
                    {metric === 'streak' ? (
                      <FlameIcon size={12} color={colors.tertiary} />
                    ) : (
                      <StarIcon size={12} color={colors.tertiary} />
                    )}
                    <AppText variant="labelSm" color={colors.tertiary} style={styles.bold}>
                      {metric === 'streak' ? `${rank2.score} ngày` : `${rank2.score.toLocaleString('vi-VN')} đ`}
                    </AppText>
                  </View>
                  <View style={[styles.podiumStand, { height: 48, backgroundColor: colors.cardHigh }]}>
                    <AppText variant="headlineSm" color={colors.textOutline} style={styles.bold}>#2</AppText>
                  </View>
                </View>
              )}

              {/* Rank 1 (Center Hero) */}
              {rank1 && (
                <View style={[styles.podiumCol, { marginTop: -16 }]}>
                  <View style={{ marginBottom: 2 }}>
                    <CrownIcon size={26} color={colors.tertiary} />
                  </View>
                  <View style={styles.podiumAvatarWrap}>
                    <View style={[styles.podiumAvatarHero, { borderColor: colors.tertiaryFixed }]}>
                      <Image source={{ uri: rank1.avatarUrl }} style={styles.avatarImg} />
                    </View>
                    <View style={[styles.podiumRankHeroBadge, { backgroundColor: colors.tertiary }]}>
                      <AppText variant="labelSm" color="#FFFFFF" style={styles.bold}>1</AppText>
                    </View>
                  </View>
                  <AppText variant="labelLg" color={colors.textPrimary} numberOfLines={1} style={[styles.bold, { marginTop: 4 }]}>
                    {rank1.name}
                  </AppText>
                  <View style={[styles.metricChip, { backgroundColor: colors.tertiaryFixed }]}>
                    {metric === 'streak' ? (
                      <FlameIcon size={13} color={colors.tertiary} />
                    ) : (
                      <StarIcon size={13} color={colors.tertiary} />
                    )}
                    <AppText variant="labelSm" color={colors.onTertiaryFixed} style={styles.bold}>
                      {metric === 'streak' ? `${rank1.score} ngày` : `${rank1.score.toLocaleString('vi-VN')} đ`}
                    </AppText>
                  </View>
                  <View style={[styles.podiumStand, { height: 80, backgroundColor: colors.primaryFixed }]}>
                    <TrophyIcon size={18} color={colors.primary} />
                    <AppText variant="labelSm" color={colors.primary} style={[styles.bold, { marginTop: 2 }]}>
                      Quán quân
                    </AppText>
                  </View>
                </View>
              )}

              {/* Rank 3 (Right) */}
              {rank3 && (
                <View style={styles.podiumCol}>
                  <View style={styles.podiumAvatarWrap}>
                    <View style={[styles.podiumAvatarCircle, { backgroundColor: colors.cardHigh }]}>
                      <Image source={{ uri: rank3.avatarUrl }} style={styles.avatarImg} />
                    </View>
                    <View style={[styles.podiumRankBadge, { backgroundColor: colors.tertiaryFixed }]}>
                      <AppText variant="labelSm" color={colors.onTertiaryFixed} style={styles.bold}>3</AppText>
                    </View>
                  </View>
                  <AppText variant="labelMd" color={colors.textPrimary} numberOfLines={1} style={[styles.bold, { marginTop: 4 }]}>
                    {rank3.name}
                  </AppText>
                  <View style={[styles.metricChip, { backgroundColor: colors.cardLow }]}>
                    {metric === 'streak' ? (
                      <FlameIcon size={12} color={colors.tertiary} />
                    ) : (
                      <StarIcon size={12} color={colors.tertiary} />
                    )}
                    <AppText variant="labelSm" color={colors.textSecondary} style={styles.bold}>
                      {metric === 'streak' ? `${rank3.score} ngày` : `${rank3.score.toLocaleString('vi-VN')} đ`}
                    </AppText>
                  </View>
                  <View style={[styles.podiumStand, { height: 36, backgroundColor: colors.cardLow }]}>
                    <AppText variant="labelSm" color={colors.textOutline} style={styles.bold}>#3</AppText>
                  </View>
                </View>
              )}
            </View>

            {/* ── Ranked List (Rank 4+) ───────────────────────────────── */}
            <View style={[styles.rankedListCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {restList.map((entry, index) => {
                const isHighlightJump = entry.rankChange && entry.rankChange.includes('+2');
                return (
                  <View key={entry.id || index}>
                    <View
                      style={[
                        styles.rankedRow,
                        isHighlightJump && { backgroundColor: colors.secondaryFixed, borderRadius: 12 },
                      ]}
                    >
                      <View style={styles.rankedRowLeft}>
                        <View style={styles.rankNumCol}>
                          <AppText
                            variant="labelMd"
                            color={isHighlightJump ? colors.primary : colors.textSecondary}
                            style={styles.bold}
                          >
                            {entry.rank}
                          </AppText>
                          {entry.rankChange && (
                            <AppText variant="labelSm" color={colors.primary} style={styles.rankDeltaText}>
                              {entry.rankChange}
                            </AppText>
                          )}
                        </View>

                        <View style={styles.rankedAvatarWrap}>
                          <Image source={{ uri: entry.avatarUrl }} style={styles.avatarImg} />
                          {isHighlightJump && (
                            <View style={[styles.pingBadge, { backgroundColor: colors.primary }]} />
                          )}
                        </View>

                        <View style={styles.rankedInfoCol}>
                          <View style={styles.rankedNameRow}>
                            <AppText variant="labelMd" color={colors.textPrimary} style={styles.bold} numberOfLines={1}>
                              {entry.name}
                            </AppText>
                            {isHighlightJump && (
                              <View style={[styles.jumpBadge, { backgroundColor: colors.primary }]}>
                                <AppText variant="labelSm" color="#FFFFFF" style={{ fontSize: 9, fontWeight: '700' }}>
                                  THĂNG HẠNG
                                </AppText>
                              </View>
                            )}
                          </View>
                          <AppText variant="labelSm" color={colors.textSecondary} numberOfLines={1}>
                            {entry.subtitle ?? `Chuỗi ${entry.streakDays ?? 5} ngày`}
                          </AppText>
                        </View>
                      </View>

                      <View style={[styles.rankedScoreChip, { backgroundColor: colors.cardLow }]}>
                        {metric === 'streak' ? (
                          <FlameIcon size={14} color={colors.tertiary} />
                        ) : (
                          <StarIcon size={13} color={colors.tertiary} />
                        )}
                        <AppText
                          variant="labelMd"
                          color={isHighlightJump ? colors.primary : colors.textPrimary}
                          style={styles.bold}
                        >
                          {metric === 'streak' ? `${entry.score} ngày` : `${entry.score.toLocaleString('vi-VN')}`}
                        </AppText>
                      </View>
                    </View>
                    {index < restList.length - 1 && (
                      <View style={[styles.rowDivider, { backgroundColor: colors.cardHigh }]} />
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
        <View style={[styles.stickyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.stickyTopRow}>
            <View style={styles.stickyLeft}>
              <View style={[styles.stickyRankBadge, { backgroundColor: colors.primary }]}>
                <AppText variant="labelSm" color="#FFFFFF" style={styles.bold}>
                  #{userEntry.rank}
                </AppText>
              </View>

              <View style={styles.stickyAvatarWrap}>
                <View style={[styles.stickyAvatarCircle, { backgroundColor: colors.primaryFixed }]}>
                  <UserSingleIcon size={18} color={colors.primary} />
                </View>
                <View style={[styles.stickyStarBadge, { backgroundColor: colors.primary }]}>
                  <StarIcon size={8} color="#FFFFFF" />
                </View>
              </View>

              <View style={styles.stickyUserText}>
                <View style={styles.stickyNameRow}>
                  <AppText variant="labelLg" color={colors.textPrimary} style={styles.bold}>
                    Bạn
                  </AppText>
                  <View style={[styles.stickyPill, { backgroundColor: colors.secondaryFixed }]}>
                    <AppText variant="labelSm" color={colors.primary} style={styles.bold}>
                      Hạng của tôi
                    </AppText>
                  </View>
                </View>
                <AppText variant="labelSm" color={colors.textSecondary} numberOfLines={1}>
                  {metric === 'streak'
                    ? 'Chuỗi lửa đang cháy ổn định'
                    : 'Còn 140 điểm để vượt Minh Anh'}
                </AppText>
              </View>
            </View>

            <View style={styles.stickyRightScore}>
              <View style={styles.scoreCol}>
                <AppText variant="labelLg" color={colors.primary} style={styles.bold}>
                  {userEntry.score}
                </AppText>
                <AppText variant="labelSm" color={colors.textSecondary} style={{ fontSize: 10 }}>
                  {metric === 'streak' ? 'ngày' : 'điểm'}
                </AppText>
              </View>
              <View style={[styles.stickyTrendingBox, { backgroundColor: colors.cardLow }]}>
                <TrendingUpIcon size={16} color={colors.primary} />
              </View>
            </View>
          </View>

          {/* Prompt row for Streak Tab */}
          {metric === 'streak' && (
            <View style={[styles.streakPromptRow, { backgroundColor: colors.cardLow }]}>
              <View style={styles.streakPromptLeft}>
                <FlameIcon size={15} color={colors.tertiary} />
                <AppText variant="bodySm" color={colors.textPrimary} numberOfLines={1}>
                  Còn <AppText variant="bodySm" color={colors.tertiary} style={styles.bold}>1 ngày</AppText> để vượt Minh Anh
                </AppText>
              </View>
              <TouchableOpacity
                style={[styles.recordNowBtn, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('FoodSearch', { date: 'today', meal: 'breakfast' })}
                activeOpacity={0.85}
              >
                <AppText variant="labelSm" color="#FFFFFF" style={styles.bold}>
                  Ghi nhận ngay →
                </AppText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 6,
    marginLeft: -4,
  },
  topBarTitle: {
    fontWeight: '700',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  tabSegmentBar: {
    flexDirection: 'row',
    borderRadius: 30,
    padding: 4,
    marginBottom: 12,
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
    shadowColor: '#7B4FE0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
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
    marginBottom: 16,
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
  },
  streakSpotlightBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 16,
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
  },
  spotlightInfo: {
    flex: 1,
  },
  spotlightChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    shadowColor: '#000',
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#7B4FE0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
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
  },
  podiumAvatarHero: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
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
  },
  podiumRankHeroBadge: {
    position: 'absolute',
    bottom: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  podiumStand: {
    width: '100%',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankedListCard: {
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    shadowColor: '#7B4FE0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
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
  },
  rankedScoreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  rowDivider: {
    height: 1,
    marginHorizontal: 10,
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
    shadowColor: '#7B4FE0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
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
  },
  streakPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
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
  },
  emptyAvatarLeft: {
    position: 'absolute',
    left: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyAvatarRight: {
    position: 'absolute',
    right: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyHubCenter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
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
  },
  emptyParticle1: {
    position: 'absolute',
    top: 6,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyParticle2: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
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
  },
  soloAvatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
  },
  skeletonTabActive: {
    flex: 1,
    height: 32,
    borderRadius: 16,
  },
  skeletonTabPulse: {
    flex: 1,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 12,
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
  },
  skeletonAvatar72: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  skeletonPodiumStand: {
    width: '100%',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    marginTop: 8,
  },
  skeletonListCard: {
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
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
  },
  skeletonLine: {
    height: 10,
    borderRadius: 5,
  },
  bold: { fontWeight: '700' },
});
