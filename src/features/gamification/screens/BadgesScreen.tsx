import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText } from '@/components/common';
import {
  BadgeCheckIcon,
  BellIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  CrownIcon,
  FlameIcon,
  LockClosedIcon,
  StarIcon,
  TrophyIcon,
  UserSingleIcon,
  UsersIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme, type ThemeContextValue } from '@/theme';
import type { Badge } from '../types';
import { useGamification } from '../GamificationProvider';
import { getBadgeVisualConfig, type BadgeVisualConfig } from '../utils';
import { BadgeCelebrationModal } from '../components/BadgeCelebrationModal';
import { BadgeDetailBottomSheet } from '../components/BadgeDetailBottomSheet';

export interface BadgesScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, any>;
  hideTopBar?: boolean;
  onTabChange?: (tab: 'challenges' | 'badges') => void;
}

export function BadgesScreen({ navigation, hideTopBar, onTabChange }: BadgesScreenProps) {
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { badges } = useGamification();

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [celebratingBadge, setCelebratingBadge] = useState<Badge | null>(null);
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'earned' | 'locked'>('all');

  const unlockedBadges = useMemo(() => badges.filter((b) => b.isUnlocked), [badges]);
  const unlockedBadgesRatio = badges.length > 0 ? unlockedBadges.length / badges.length : 0;
  const totalBadgePoints = useMemo(
    () => unlockedBadges.reduce((sum, b) => sum + (b.points || 0), 0),
    [unlockedBadges]
  );

  const filteredBadges = useMemo(() => {
    if (badgeFilter === 'earned') return badges.filter((b) => b.isUnlocked);
    if (badgeFilter === 'locked') return badges.filter((b) => !b.isUnlocked);
    return badges;
  }, [badges, badgeFilter]);

  const renderGridBadgeIcon = (visuals: BadgeVisualConfig, isUnlocked: boolean) => {
    const iconColor = isUnlocked ? '#FFFFFF' : c.textDisabled;
    switch (visuals.iconName) {
      case 'book-open':
        return <BookOpenIcon size={28} color={iconColor} />;
      case 'flame':
        return <FlameIcon size={28} color={iconColor} />;
      case 'users':
        return <UsersIcon size={28} color={iconColor} />;
      case 'calendar':
        return <CalendarIcon size={28} color={iconColor} />;
      case 'crown':
        return <CrownIcon size={28} color={iconColor} />;
      case 'badge-check':
        return <BadgeCheckIcon size={28} color={iconColor} />;
      case 'trophy':
      default:
        return <TrophyIcon size={28} color={iconColor} />;
    }
  };

  const content = (
    <>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.badgesSection}>
          {/* Summary Card with Lavender Glow & Mini-Ring Progress */}
          <View style={[styles.summaryCard, { backgroundColor: c.surfaceMid }]}>
            <View style={styles.miniRingWrap}>
              <Svg width={56} height={56} viewBox="0 0 56 56" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle
                  cx={28}
                  cy={28}
                  r={23}
                  stroke={c.surfaceBorder}
                  strokeWidth={5}
                  fill="none"
                />
                <Circle
                  cx={28}
                  cy={28}
                  r={23}
                  stroke={c.brandAction}
                  strokeWidth={5}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 23}`}
                  strokeDashoffset={2 * Math.PI * 23 * (1 - unlockedBadgesRatio)}
                />
              </Svg>
              <View style={styles.miniRingCenter}>
                <AppText variant="labelMd" color={c.brandPrimary} style={styles.boldText}>
                  {unlockedBadges.length}/{badges.length}
                </AppText>
              </View>
            </View>

            <View style={styles.summaryTextCol}>
              <AppText variant="labelLg" color={c.textPrimary} style={styles.boldText} numberOfLines={1}>
                Bạn đã đạt {unlockedBadges.length} huy hiệu
              </AppText>
              <AppText variant="bodySm" color={c.textSecondary} numberOfLines={2} style={{ marginTop: 2 }}>
                Tiếp tục duy trì thói quen để nhận thêm nhiều phần thưởng nhé!
              </AppText>
            </View>
          </View>

          {/* Filter Chips (Segmented Pill Row) */}
          <View style={styles.badgeFilterRow}>
            <TouchableOpacity
              style={[
                styles.badgeFilterBtn,
                badgeFilter === 'all'
                  ? [styles.badgeFilterBtnActive, { backgroundColor: c.brandAction }]
                  : { backgroundColor: c.surfaceHigh },
              ]}
              onPress={() => setBadgeFilter('all')}
            >
              <AppText
                variant="labelMd"
                color={badgeFilter === 'all' ? '#FFFFFF' : c.textSecondary}
                style={badgeFilter === 'all' ? styles.boldText : undefined}
              >
                Tất cả
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.badgeFilterBtn,
                badgeFilter === 'earned'
                  ? [styles.badgeFilterBtnActive, { backgroundColor: c.brandAction }]
                  : { backgroundColor: c.surfaceHigh },
              ]}
              onPress={() => setBadgeFilter('earned')}
            >
              <AppText
                variant="labelMd"
                color={badgeFilter === 'earned' ? '#FFFFFF' : c.textSecondary}
                style={badgeFilter === 'earned' ? styles.boldText : undefined}
              >
                Đã đạt
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.badgeFilterBtn,
                badgeFilter === 'locked'
                  ? [styles.badgeFilterBtnActive, { backgroundColor: c.brandAction }]
                  : { backgroundColor: c.surfaceHigh },
              ]}
              onPress={() => setBadgeFilter('locked')}
            >
              <AppText
                variant="labelMd"
                color={badgeFilter === 'locked' ? '#FFFFFF' : c.textSecondary}
                style={badgeFilter === 'locked' ? styles.boldText : undefined}
              >
                Chưa đạt
              </AppText>
            </TouchableOpacity>
          </View>

          {/* 2-Column Badges Grid */}
          <View style={styles.badgeGrid2Col}>
            {filteredBadges.map((badge) => {
              const isUnlocked = badge.isUnlocked;
              const visuals = getBadgeVisualConfig(badge);

              return (
                <TouchableOpacity
                  key={badge.id}
                  activeOpacity={0.85}
                  style={[
                    styles.badgeGridCard,
                    { backgroundColor: c.surfaceMid },
                    !isUnlocked && { opacity: 0.88 },
                  ]}
                  onPress={() => setSelectedBadge(badge)}
                >
                  {/* Medallion Container */}
                  <View style={styles.gridMedallionWrap}>
                    <View
                      style={[
                        styles.gridMedallionCircle,
                        isUnlocked
                          ? { backgroundColor: visuals.primaryColor }
                          : { backgroundColor: c.surfaceHigh },
                      ]}
                    >
                      {renderGridBadgeIcon(visuals, isUnlocked)}
                    </View>

                    {/* Status Indicator Pin at Top-Right */}
                    {isUnlocked ? (
                      <View style={styles.unlockedPin}>
                        <CheckIcon size={11} color="#FFFFFF" />
                      </View>
                    ) : (
                      <View style={[styles.lockedPin, { backgroundColor: c.surfaceBorder }]}>
                        <LockClosedIcon size={10} color={c.textSecondary} />
                      </View>
                    )}
                  </View>

                  {/* Title */}
                  <AppText
                    variant="labelLg"
                    color={isUnlocked ? c.textPrimary : c.textSecondary}
                    style={[styles.badgeCardTitle, isUnlocked && styles.boldText]}
                    numberOfLines={1}
                  >
                    {badge.title}
                  </AppText>

                  {/* Points Chip */}
                  <View
                    style={[
                      styles.badgePointsChip,
                      {
                        backgroundColor: isUnlocked
                          ? theme.scheme === 'dark'
                            ? 'rgba(217, 119, 6, 0.22)'
                            : '#FFDCC3'
                          : c.surfaceHigh,
                      },
                    ]}
                  >
                    {isUnlocked && <StarIcon size={11} color={c.vipStreak} />}
                    <AppText
                      variant="labelSm"
                      color={isUnlocked ? c.vipStreak : c.textSecondary}
                      style={styles.boldText}
                    >
                      +{badge.points || 20} điểm
                    </AppText>
                  </View>

                  {/* Date or Condition Status */}
                  <AppText
                    variant="labelSm"
                    color={isUnlocked ? c.textSecondary : c.textDisabled}
                    style={{ marginTop: 2 }}
                    numberOfLines={1}
                  >
                    {isUnlocked ? `Đạt ${badge.unlockedAt || '12/11/2026'}` : 'Chưa đạt'}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* ── MODAL 1: CELEBRATION MODAL ─────────────────────────────── */}
      <BadgeCelebrationModal
        visible={Boolean(celebratingBadge)}
        badge={celebratingBadge}
        onClose={() => setCelebratingBadge(null)}
        onViewBadge={(b) => {
          setCelebratingBadge(null);
          setSelectedBadge(b);
        }}
      />

      {/* ── MODAL 2: DETAIL BOTTOM SHEET ───────────────────────────── */}
      <BadgeDetailBottomSheet
        visible={Boolean(selectedBadge)}
        badge={selectedBadge}
        onClose={() => setSelectedBadge(null)}
      />
    </>
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

          <AppText variant="headlineSm" color={c.textPrimary} style={styles.boldText}>
            Huy hiệu
          </AppText>
        </View>

        {/* Reward Points Pill */}
        {/* <View
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
        </View> */}
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
    fireCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
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
    iconButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
    },
    headerBadgePointsPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 16,
      gap: 4,
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

    /* Badges Section */
    badgesSection: {
      gap: 16,
    },
    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 16,
      borderRadius: 16,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 1,
    },
    miniRingWrap: {
      width: 56,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    miniRingCenter: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryTextCol: {
      flex: 1,
      gap: 2,
    },
    badgeFilterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    badgeFilterBtn: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    badgeFilterBtnActive: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
      elevation: 2,
    },
    badgeGrid2Col: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      justifyContent: 'space-between',
    },
    badgeGridCard: {
      width: '48%',
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      gap: 6,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    gridMedallionWrap: {
      width: 72,
      height: 72,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      marginVertical: 4,
    },
    gridMedallionCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.18,
      shadowRadius: 6,
      elevation: 3,
    },
    unlockedPin: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#16A34A',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    lockedPin: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: '#FFFFFF',
    },
    badgeCardTitle: {
      textAlign: 'center',
      marginTop: 2,
    },
    badgePointsChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
    },
    boldText: {
      fontWeight: '700',
    },
  });
}
