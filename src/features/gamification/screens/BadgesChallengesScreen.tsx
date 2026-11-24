import React, { useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppText, ProgressBar } from '@/components/common';
import {
  AlarmClockIcon,
  AlertCircleIcon,
  BellIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  CirclePlusIcon,
  ClockIcon,
  CrownIcon,
  DropletsIcon,
  FlameIcon,
  FootprintsIcon,
  LightningBoltIcon,
  LockClosedIcon,
  ScaleOutlineIcon,
  SparklesIcon,
  SproutIcon,
  StarIcon,
  TargetIcon,
  TrophyIcon,
  UserSingleIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme, type ThemeContextValue } from '@/theme';
import type { Badge, Challenge } from '../types';
import { useGamification } from '../GamificationProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'BadgesChallenges'>;

export interface BadgeThemeConfig {
  activeColor: string;
  lightBg: string;
  darkBg: string;
  renderIcon: (size: number, color: string) => React.ReactNode;
}

export function getBadgeVisualConfig(badgeIdOrCode?: string): BadgeThemeConfig {
  const key = (badgeIdOrCode || '').toLowerCase();

  if (key.includes('first') || key.includes('khởi đầu')) {
    return {
      activeColor: '#10B981',
      lightBg: '#ECFDF5',
      darkBg: 'rgba(16, 185, 129, 0.18)',
      renderIcon: (size, color) => <SproutIcon size={size} color={color} />,
    };
  }

  if (key.includes('streak-7') || key.includes('streak_7') || key.includes('7')) {
    return {
      activeColor: '#EF4444',
      lightBg: '#FEF2F2',
      darkBg: 'rgba(239, 68, 68, 0.18)',
      renderIcon: (size, color) => <FlameIcon size={size} color={color} />,
    };
  }

  if (key.includes('streak-30') || key.includes('streak_30') || key.includes('30')) {
    return {
      activeColor: '#F59E0B',
      lightBg: '#FEF3C7',
      darkBg: 'rgba(245, 158, 11, 0.18)',
      renderIcon: (size, color) => <CrownIcon size={size} color={color} />,
    };
  }

  if (key.includes('water') || key.includes('thủy thần')) {
    return {
      activeColor: '#0284C7',
      lightBg: '#E0F2FE',
      darkBg: 'rgba(2, 132, 199, 0.18)',
      renderIcon: (size, color) => <DropletsIcon size={size} color={color} />,
    };
  }

  if (key.includes('steps') || key.includes('bước')) {
    return {
      activeColor: '#8B5CF6',
      lightBg: '#EDE9FE',
      darkBg: 'rgba(139, 92, 246, 0.18)',
      renderIcon: (size, color) => <FootprintsIcon size={size} color={color} />,
    };
  }

  if (key.includes('macro') || key.includes('scale')) {
    return {
      activeColor: '#EC4899',
      lightBg: '#FCE7F3',
      darkBg: 'rgba(236, 72, 153, 0.18)',
      renderIcon: (size, color) => <ScaleOutlineIcon size={size} color={color} />,
    };
  }

  return {
    activeColor: '#F59E0B',
    lightBg: '#FEF3C7',
    darkBg: 'rgba(245, 158, 11, 0.18)',
    renderIcon: (size, color) => <TrophyIcon size={size} color={color} />,
  };
}

function BadgeVisual({
  id,
  isUnlocked = true,
  size = 30,
}: {
  id: string;
  isUnlocked?: boolean;
  size?: number;
}) {
  const theme = useTheme();
  const config = getBadgeVisualConfig(id);
  const color = isUnlocked
    ? config.activeColor
    : (theme.scheme === 'dark' ? '#64748B' : '#94A3B8');

  return config.renderIcon(size, color);
}

export function BadgesChallengesScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { badges, challenges, joinChallenge, userPoints } = useGamification();

  const [activeTab, setActiveTab] = useState<'badges' | 'challenges'>(
    route?.params?.initialTab ?? 'challenges'
  );
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
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
              {isWater && <DropletsIcon size={26} color={c.brandPrimary} />}
              {isSteps && <FootprintsIcon size={26} color={c.brandSecondary} />}
              {isLog && <BookOpenIcon size={26} color={c.brandPrimary} />}
              {isCalorie && <TargetIcon size={26} color={c.macroProtein} />}
              {!isWater && !isSteps && !isLog && !isCalorie && (
                <SparklesIcon size={26} color={c.brandPrimary} />
              )}
            </View>

            <View style={styles.cardTitleWrap}>
              <AppText variant="headlineSm" color={c.textPrimary} numberOfLines={1}>
                {challenge.title}
              </AppText>
              <View style={styles.cardDateRow}>
                <CalendarIcon size={13} color={c.textSecondary} />
                <AppText variant="bodySm" color={c.textSecondary}>
                  {challenge.startDate || '23/11'} – {challenge.endDate || '29/11'}
                </AppText>
              </View>
            </View>
          </View>

          {/* Highlight / Status Badges */}
          {isWater && (
            <View style={[styles.statusBadge, { backgroundColor: c.brandSoftTint }]}>
              <FlameIcon size={13} color={c.brandPrimary} />
              <AppText variant="labelSm" color={c.brandPrimary} style={styles.boldText}>
                Gần xong!
              </AppText>
            </View>
          )}

          {isLog && (
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    theme.scheme === 'dark'
                      ? 'rgba(217, 119, 6, 0.25)'
                      : '#FFEDE1',
                },
              ]}
            >
              <AlarmClockIcon size={12} color={c.vipStreak} />
              <AppText variant="labelSm" color={c.vipStreak} style={styles.boldText}>
                Hôm nay
              </AppText>
            </View>
          )}
        </View>

        {/* Progress Box */}
        <View style={[styles.progressBox, { backgroundColor: c.surfaceMuted }]}>
          <View style={styles.progressLabelRow}>
            {isSteps ? (
              <AppText variant="labelMd" color={c.textPrimary}>
                Đã tích luỹ:{' '}
                <AppText variant="labelMd" color={c.brandSecondary} style={styles.boldText}>
                  {challenge.currentProgress.toLocaleString('vi-VN')}
                </AppText>{' '}
                / {challenge.targetProgress.toLocaleString('vi-VN')} bước
              </AppText>
            ) : (
              <AppText variant="labelMd" color={c.textPrimary}>
                {isWater ? 'Tiến độ: ' : 'Đã hoàn thành: '}
                <AppText
                  variant="labelMd"
                  color={isCalorie ? c.macroProtein : c.brandPrimary}
                  style={styles.boldText}
                >
                  {challenge.currentProgress}/{challenge.targetProgress} {challenge.unit}
                </AppText>
              </AppText>
            )}
            <AppText variant="labelMd" color={c.textPrimary} style={styles.boldText}>
              {percent}%
            </AppText>
          </View>

          <View style={[styles.progressTrack, { backgroundColor: c.progressTrack }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${percent}%`,
                  backgroundColor: isCalorie
                    ? c.macroProtein
                    : isSteps
                    ? c.brandSecondary
                    : c.brandAction,
                },
              ]}
            />
          </View>
        </View>

        {/* Card Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.footerTimeLeft}>
            {isLog ? (
              <View style={styles.warningTimeLeft}>
                <AlertCircleIcon size={15} color={c.vipStreak} />
                <AppText variant="labelMd" color={c.vipStreak} style={styles.boldText}>
                  Còn 1 ngày
                </AppText>
              </View>
            ) : (
              <View style={styles.normalTimeLeft}>
                <ClockIcon size={15} color={c.textSecondary} />
                <AppText variant="labelMd" color={c.textSecondary}>
                  Còn {challenge.daysLeft ?? 3} ngày
                </AppText>
              </View>
            )}
          </View>

          {/* Reward Badge */}
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
            {isSteps ? (
              <StarIcon size={14} color={c.vipStreak} />
            ) : (
              <TrophyIcon size={14} color={c.vipStreak} />
            )}
            <AppText variant="labelMd" color={c.vipStreak} style={styles.boldText}>
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
            <ChevronLeftIcon size={22} color={c.textPrimary} />
          </TouchableOpacity>

          <View style={[styles.fireCircle, { backgroundColor: c.brandAction }]}>
            <FlameIcon size={18} color="#FFFFFF" />
          </View>
          <AppText variant="headlineSm" color={c.textPrimary} style={styles.boldText}>
            Game
          </AppText>
        </View>

        <View style={styles.topBarRight}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: c.surfaceHigh }]}
            onPress={() => navigation.navigate('FriendRequests')}
            accessibilityRole="button"
            accessibilityLabel="Thông báo"
          >
            <BellIcon size={20} color={c.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.avatarCircle, { backgroundColor: c.brandPrimary }]}>
            <UserSingleIcon size={16} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── TAB: CHALLENGES (MOCKUP 1) ──────────────────────────────── */}
        {activeTab === 'challenges' && (
          <View style={styles.challengesContainer}>
            {/* Header Bar: Title + Total Points Pill */}
            <View style={styles.challengesHeaderBar}>
              <View style={styles.titleColumn}>
                <View style={styles.titleWithBadgeRow}>
                  <AppText variant="headlineMd" color={c.textPrimary} style={styles.boldText}>
                    Thử thách
                  </AppText>
                  <View style={[styles.countBadge, { backgroundColor: c.brandSoftTint }]}>
                    <AppText variant="labelSm" color={c.brandPrimary} style={styles.boldText}>
                      {joinedChallenges.length || 4}
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
                        ? 'rgba(217, 119, 6, 0.2)'
                        : '#FFDCC3',
                  },
                ]}
              >
                <StarIcon size={18} color={c.vipStreak} />
                <AppText variant="labelLg" color={c.vipStreak} style={styles.boldText}>
                  {userPoints || 320}
                </AppText>
                <AppText variant="labelSm" color={c.vipStreak} style={{ opacity: 0.85 }}>
                  điểm
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
                <View style={styles.joinedTabLabelRow}>
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
        )}

        {/* ── TAB: BADGES ────────────────────────────────────────────── */}
        {activeTab === 'badges' && (
          <View style={styles.badgesSection}>
            <View style={styles.badgesGrid}>
              {badges.map((badge) => {
                const isUnlocked = badge.isUnlocked;
                const config = getBadgeVisualConfig(badge.id || badge.code);
                const iconBgColor = isUnlocked
                  ? (theme.scheme === 'dark' ? config.darkBg : config.lightBg)
                  : (theme.scheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)');

                return (
                  <TouchableOpacity
                    key={badge.id}
                    style={[
                      styles.badgeCard,
                      {
                        backgroundColor: c.surfaceMid,
                        borderColor: isUnlocked
                          ? config.activeColor
                          : c.surfaceBorder,
                      },
                      isUnlocked && styles.badgeCardUnlocked,
                    ]}
                    onPress={() => setSelectedBadge(badge)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.badgeIconBox,
                        {
                          backgroundColor: iconBgColor,
                        },
                      ]}
                    >
                      <BadgeVisual id={badge.id || badge.code} isUnlocked={isUnlocked} size={30} />
                    </View>
                    <AppText variant="bodySm" align="center" style={styles.badgeTitle}>
                      {badge.title}
                    </AppText>
                    <View
                      style={[
                        styles.unlockStatus,
                        {
                          backgroundColor: isUnlocked
                            ? (theme.scheme === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.12)')
                            : (theme.scheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'),
                        },
                      ]}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        {isUnlocked ? (
                          <CheckIcon size={12} color="#10B981" />
                        ) : (
                          <LockClosedIcon size={12} color={c.textSecondary} />
                        )}
                        <AppText
                          variant="caption"
                          color={isUnlocked ? '#10B981' : c.textSecondary}
                          style={styles.boldText}
                        >
                          {isUnlocked ? 'Đã mở' : 'Khóa'}
                        </AppText>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* ── Badge Detail & Congratulation Modal ──────────────────────── */}
      <Modal
        visible={Boolean(selectedBadge)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedBadge(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.badgeModalBox, { backgroundColor: c.surfaceMid }]}>
            {selectedBadge && (() => {
              const config = getBadgeVisualConfig(selectedBadge.id || selectedBadge.code);
              const headerBg = selectedBadge.isUnlocked
                ? (theme.scheme === 'dark' ? config.darkBg : config.lightBg)
                : (theme.scheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)');

              return (
                <View
                  style={[
                    styles.modalHeaderSection,
                    {
                      backgroundColor: headerBg,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.modalBadgeIconBox,
                      {
                        backgroundColor: c.surfaceMid,
                        borderColor: selectedBadge.isUnlocked
                          ? config.activeColor + (theme.scheme === 'dark' ? '44' : '33')
                          : c.surfaceBorder,
                      },
                    ]}
                  >
                    <BadgeVisual
                      id={selectedBadge.id || selectedBadge.code}
                      isUnlocked={selectedBadge.isUnlocked}
                      size={44}
                    />
                  </View>

                  <AppText variant="headlineMd" align="center" style={styles.modalBadgeTitle}>
                    {selectedBadge.title}
                  </AppText>
                </View>
              );
            })()}

            <View style={styles.modalBodySection}>
              <AppText
                variant="bodyMd"
                color={c.textSecondary}
                align="center"
                style={styles.badgeDesc}
              >
                {selectedBadge?.description}
              </AppText>

              <View
                style={[
                  styles.unlockedBox,
                  {
                    backgroundColor: selectedBadge?.isUnlocked
                      ? (theme.scheme === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.12)')
                      : (theme.scheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'),
                  },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  {selectedBadge?.isUnlocked ? (
                    <CheckIcon size={14} color="#10B981" />
                  ) : (
                    <LockClosedIcon size={14} color={c.textSecondary} />
                  )}
                  <AppText
                    variant="bodySm"
                    color={
                      selectedBadge?.isUnlocked
                        ? '#10B981'
                        : c.textSecondary
                    }
                    align="center"
                    style={styles.boldText}
                  >
                    {selectedBadge?.isUnlocked
                      ? `Mở khóa thành công • ${selectedBadge.unlockedAt || 'Gần đây'}`
                      : 'Tiếp tục rèn luyện để mở khóa huy hiệu này nhé!'}
                  </AppText>
                </View>
              </View>

              <AppButton
                label="Đóng"
                variant="primary"
                onPress={() => setSelectedBadge(null)}
                style={styles.closeBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
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
      gap: 10,
    },
    topBarRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    backButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
    },
    fireCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
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
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 1,
    },

    /* Segmented Navigation */
    segmentedTabBar: {
      flexDirection: 'row',
      padding: 4,
      borderRadius: 18,
      gap: 4,
    },
    segmentedTabItem: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
    },
    segmentedTabItemActive: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
      elevation: 2,
    },
    joinedTabLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    activeDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },

    /* Motivational Banner */
    motivationalBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 18,
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

    /* Challenges List */
    challengesListWrap: {
      gap: 14,
    },
    challengeCard: {
      backgroundColor: c.surfaceMid,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      shadowColor: isDark ? '#000000' : 'rgba(123, 79, 224, 0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 2,
      position: 'relative',
      overflow: 'hidden',
    },
    highlightedCard: {
      borderColor: isDark ? 'rgba(164, 118, 254, 0.4)' : 'rgba(123, 79, 224, 0.3)',
      shadowColor: 'rgba(123, 79, 224, 0.25)',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 4,
    },
    topAccentBar: {
      position: 'absolute',
      top: 0,
      left: 16,
      right: 16,
      height: 3,
      borderRadius: 2,
      backgroundColor: c.brandAction,
    },
    cardHeaderRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 12,
      marginTop: 2,
    },
    cardHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    challengeIconBox: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitleWrap: {
      flex: 1,
      gap: 3,
    },
    cardDateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },

    /* Progress Box inside Card */
    progressBox: {
      padding: 10,
      borderRadius: 12,
      gap: 6,
      marginBottom: 12,
    },
    progressLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressTrack: {
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
      width: '100%',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },

    /* Card Footer */
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 2,
    },
    footerTimeLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    normalTimeLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    warningTimeLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    rewardPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 16,
    },

    /* Footer CTA */
    footerCtaBtn: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 24,
      marginTop: 4,
    },

    emptyBox: {
      padding: 32,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },

    /* Badges section */
    badgesSection: {
      gap: 16,
    },
    badgesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    badgeCard: {
      width: '48%',
      padding: 16,
      borderRadius: 18,
      borderWidth: 1,
      alignItems: 'center',
      gap: 8,
    },
    badgeCardUnlocked: {
      shadowColor: '#2ECC71',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3,
    },
    badgeIconBox: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeTitle: {
      fontWeight: '600',
    },
    unlockStatus: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
    },

    /* Modal */
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    badgeModalBox: {
      width: '100%',
      maxWidth: 340,
      borderRadius: 24,
      overflow: 'hidden',
      position: 'relative',
      alignItems: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 20,
      elevation: 8,
    },
    modalHeaderSection: {
      width: '100%',
      paddingTop: 28,
      paddingBottom: 22,
      paddingHorizontal: 20,
      alignItems: 'center',
      gap: 12,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    modalBadgeIconBox: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    modalBadgeTitle: {
      fontWeight: '700',
    },
    modalBodySection: {
      width: '100%',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 24,
      alignItems: 'center',
      gap: 14,
    },
    badgeDesc: {
      lineHeight: 20,
    },
    unlockedBox: {
      width: '100%',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
    },
    closeBtn: {
      minWidth: 120,
      paddingHorizontal: 28,
    },
    boldText: {
      fontWeight: '700',
    },
  });
}
