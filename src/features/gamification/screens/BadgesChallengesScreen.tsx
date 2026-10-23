import React, { useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppText, ProgressBar } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import type { Badge } from '../types';
import { useGamification } from '../GamificationProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'BadgesChallenges'>;

export function BadgesChallengesScreen({ navigation }: Props) {
  const theme = useTheme();
  const { badges, challenges, joinChallenge } = useGamification();

  const [activeTab, setActiveTab] = useState<'badges' | 'challenges'>('badges');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
      {/* ── Tabs Header ─────────────────────────────────────────────── */}
      <View style={[styles.tabBar, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'badges' && {
              borderBottomColor: theme.colors.brandPrimary,
              borderBottomWidth: 3,
            },
          ]}
          onPress={() => setActiveTab('badges')}
        >
          <AppText
            variant="headlineSm"
            color={activeTab === 'badges' ? theme.colors.brandPrimary : theme.colors.textSecondary}
          >
            Huy hiệu ({badges.filter((b) => b.isUnlocked).length}/{badges.length})
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'challenges' && {
              borderBottomColor: theme.colors.brandPrimary,
              borderBottomWidth: 3,
            },
          ]}
          onPress={() => setActiveTab('challenges')}
        >
          <AppText
            variant="headlineSm"
            color={activeTab === 'challenges' ? theme.colors.brandPrimary : theme.colors.textSecondary}
          >
            Thử thách cộng đồng
          </AppText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ── TAB 1: BADGES ─────────────────────────────────────────── */}
        {activeTab === 'badges' && (
          <View style={styles.badgesSection}>
            <View style={styles.badgesGrid}>
              {badges.map((badge) => {
                const isUnlocked = badge.isUnlocked;
                return (
                  <TouchableOpacity
                    key={badge.id}
                    style={[
                      styles.badgeCard,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: isUnlocked
                          ? theme.colors.brandPrimary
                          : 'rgba(128,128,128,0.2)',
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
                          backgroundColor: isUnlocked
                            ? theme.colors.brandSoftTint
                            : 'rgba(128,128,128,0.1)',
                        },
                      ]}
                    >
                      <AppText variant="headlineLg">{badge.iconGlyph}</AppText>
                    </View>
                    <AppText variant="bodySm" align="center" style={styles.badgeTitle}>
                      {badge.title}
                    </AppText>
                    <View
                      style={[
                        styles.unlockStatus,
                        {
                          backgroundColor: isUnlocked
                            ? 'rgba(46, 204, 113, 0.15)'
                            : 'rgba(128,128,128,0.1)',
                        },
                      ]}
                    >
                      <AppText
                        variant="caption"
                        color={isUnlocked ? theme.colors.brandPrimary : theme.colors.textSecondary}
                      >
                        {isUnlocked ? '✓ Đã mở' : '🔒 Khóa'}
                      </AppText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ── TAB 2: CHALLENGES ─────────────────────────────────────── */}
        {activeTab === 'challenges' && (
          <View style={styles.challengesSection}>
            {/* ── Banner Artwork ────────────────────────────────────── */}
            <View style={styles.courseBannerWrap}>
              <Image
                source={images.courseArtwork}
                style={styles.courseBanner}
                resizeMode="cover"
              />
              <View style={styles.courseBannerOverlay}>
                <AppText variant="headlineSm" color="#FFFFFF">
                  Thử thách sức khỏe Kallo
                </AppText>
                <AppText variant="caption" color="rgba(255,255,255,0.85)">
                  Cùng hàng ngàn thành viên rèn luyện thói quen dinh dưỡng
                </AppText>
              </View>
            </View>

            {challenges.map((challenge) => {
              const progressRatio = Math.min(
                1,
                challenge.currentProgress / (challenge.targetProgress || 1)
              );
              return (
                <AppCard key={challenge.id} style={styles.challengeCard}>
                  <View style={styles.challengeHeader}>
                    <View style={styles.flex}>
                      <AppText variant="headlineSm">{challenge.title}</AppText>
                      <AppText variant="bodySm" color={theme.colors.textSecondary}>
                        {challenge.description}
                      </AppText>
                    </View>
                    <View style={styles.rewardPill}>
                      <AppText variant="caption" color={theme.colors.calorieBurned}>
                        +{challenge.rewardPoints} đ
                      </AppText>
                    </View>
                  </View>

                  <View style={styles.progressRow}>
                    <View style={styles.flex}>
                      <AppText variant="caption" color={theme.colors.textSecondary}>
                        Tiến độ: {challenge.currentProgress.toLocaleString()} /{' '}
                        {challenge.targetProgress.toLocaleString()} {challenge.unit}
                      </AppText>
                      <ProgressBar
                        value={progressRatio}
                        color={theme.colors.brandPrimary}
                      />
                    </View>
                  </View>

                  <View style={styles.challengeFooter}>
                    <AppText variant="caption" color={theme.colors.textSecondary}>
                      Thời hạn: {challenge.durationDays} ngày
                    </AppText>
                    {challenge.isJoined ? (
                      <View style={styles.joinedBadge}>
                        <AppText variant="caption" color={theme.colors.brandPrimary}>
                          Đang tham gia ✓
                        </AppText>
                      </View>
                    ) : (
                      <AppButton
                        label="Tham gia ngay"
                        variant="primary"
                        onPress={() => joinChallenge(challenge.id)}
                      />
                    )}
                  </View>
                </AppCard>
              );
            })}
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
          <View style={[styles.badgeModalBox, { backgroundColor: theme.colors.surface }]}>
            <Image
              source={images.awardBackground}
              style={styles.awardBg}
              resizeMode="cover"
            />
            <Image
              source={images.paywallTrophy}
              style={styles.trophyIcon}
              resizeMode="contain"
            />

            <AppText variant="headlineMd" align="center">
              {selectedBadge?.title}
            </AppText>

            <AppText
              variant="bodyMd"
              color={theme.colors.textSecondary}
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
                    ? theme.colors.brandSoftTint
                    : 'rgba(128,128,128,0.1)',
                },
              ]}
            >
              <AppText
                variant="bodySm"
                color={
                  selectedBadge?.isUnlocked
                    ? theme.colors.brandPrimary
                    : theme.colors.textSecondary
                }
                align="center"
              >
                {selectedBadge?.isUnlocked
                  ? `Mở khóa thành công • ${selectedBadge.unlockedAt || 'Gần đây'}`
                  : 'Tiếp tục rèn luyện để mở khóa huy hiệu này nhé!'}
              </AppText>
            </View>

            <AppButton
              label="Đóng"
              variant="primary"
              onPress={() => setSelectedBadge(null)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 36,
  },
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
  challengesSection: {
    gap: 14,
  },
  courseBannerWrap: {
    height: 140,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E1B2E',
  },
  courseBanner: {
    width: '100%',
    height: '100%',
  },
  courseBannerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(20, 18, 30, 0.45)',
    padding: 16,
    justifyContent: 'flex-end',
    gap: 4,
  },
  challengeCard: {
    gap: 12,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  flex: { flex: 1 },
  rewardPill: {
    backgroundColor: 'rgba(253, 203, 110, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressRow: {
    gap: 6,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  joinedBadge: {
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
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
    padding: 24,
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  awardBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.15,
  },
  trophyIcon: {
    width: 80,
    height: 80,
    marginBottom: 4,
  },
  badgeDesc: {
    lineHeight: 20,
  },
  unlockedBox: {
    width: '100%',
    padding: 10,
    borderRadius: 12,
  },
});
