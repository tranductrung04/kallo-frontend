import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppSwitch, AppText } from '@/components/common';
import {
  CheckIcon,
  ChevronLeftIcon,
  FlameIcon,
  GearSettingsIcon,
  LockClosedIcon,
  MailInboxIcon,
  RunningIcon,
  TrophyIcon,
  UserSingleIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import type { LeaderboardMetric } from '../types';
import { useGamification } from '../GamificationProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'FriendsLeaderboard'>;

export function FriendsLeaderboardScreen({ navigation }: Props) {
  const theme = useTheme();
  const {
    friends,
    isSharingPrivacy,
    toggleSharingPrivacy,
    getLeaderboard,
    acceptFriendRequest,
    incomingRequests,
  } = useGamification();

  const [metric, setMetric] = useState<LeaderboardMetric>('streak');
  const leaderboard = getLeaderboard(metric);

  const renderRankBadge = (rank: number) => {
    if (rank === 1) return <TrophyIcon size={20} color="#F59E0B" />;
    if (rank === 2) return <TrophyIcon size={20} color="#94A3B8" />;
    if (rank === 3) return <TrophyIcon size={20} color="#CD7F32" />;
    return <AppText variant="headlineSm">#{rank}</AppText>;
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <View style={[styles.topBar, { borderBottomColor: theme.colors.surfaceBorder }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ChevronLeftIcon size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <AppText variant="headlineSm" color={theme.colors.textPrimary} numberOfLines={1} style={styles.topBarTitle}>
          Bảng xếp hạng bạn bè
        </AppText>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('GameSettings')}
          accessibilityLabel="Cài đặt trò chơi"
        >
          <GearSettingsIcon size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Community Hero Banner ─────────────────────────────────── */}
        <View style={styles.bannerContainer}>
          <Image
            source={images.communityBanner}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <View style={styles.bannerTopRow}>
              <View style={styles.bannerLeftActions}>
                <Image
                  source={images.groupUsers}
                  style={styles.groupUsersIcon}
                  resizeMode="contain"
                />
                {incomingRequests.length > 0 && (
                  <TouchableOpacity
                    style={[styles.requestCountBadge, { backgroundColor: theme.colors.brandPrimary }]}
                    onPress={() => navigation.navigate('FriendRequests')}
                  >
                    <MailInboxIcon size={14} color={theme.colors.onBrand} />
                    <AppText variant="caption" color={theme.colors.onBrand} style={styles.bold}>
                      {incomingRequests.length}
                    </AppText>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.bannerRightActions}>
                <TouchableOpacity
                  style={styles.settingsIconBtn}
                  onPress={() => navigation.navigate('GameSettings')}
                  accessibilityLabel="Cài đặt trò chơi"
                >
                  <GearSettingsIcon size={20} color={theme.colors.onBrand} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addFriendBtn}
                  onPress={() => navigation.navigate('FriendSearch')}
                >
                  <AppText variant="caption" color={theme.colors.onBrand} style={styles.bold}>
                    + Thêm bạn
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
            <AppText variant="headlineSm" color="#FFFFFF">
              Bảng xếp hạng Bạn bè
            </AppText>
            <AppText variant="caption" color="rgba(255,255,255,0.85)">
              Cập nhật trực tiếp qua thời gian thực (độ trễ ≤ 3s)
            </AppText>
          </View>
        </View>

        {/* ── FR-GAM-07: Privacy Toggle Card ─────────────────────────── */}
        <AppCard style={styles.privacyCard}>
          <View style={styles.privacyRow}>
            <View style={styles.privacyText}>
              <AppText variant="headlineSm">Chia sẻ thành tích</AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Cho phép bạn bè thấy thứ hạng của tôi trên bảng xếp hạng
              </AppText>
            </View>
            <AppSwitch
              value={isSharingPrivacy}
              onValueChange={toggleSharingPrivacy}
              accessibilityLabel="Chia sẻ thành tích"
            />
          </View>
          <TouchableOpacity
            style={styles.privacyNotice}
            onPress={() => navigation.navigate('GameSettings')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <LockClosedIcon size={12} color={theme.colors.brandPrimary} />
              <AppText variant="caption" color={theme.colors.brandPrimary}>
                Bảo mật: Tuyệt đối không hiển thị cân nặng. Xem cài đặt chi tiết →
              </AppText>
            </View>
          </TouchableOpacity>
        </AppCard>

        {/* ── Metric Tabs ────────────────────────────────────────────── */}
        <View style={styles.metricTabsRow}>
          <TouchableOpacity
            style={[
              styles.metricTab,
              metric === 'streak' && {
                backgroundColor: theme.colors.brandPrimary,
              },
            ]}
            onPress={() => setMetric('streak')}
          >
            <FlameIcon
              size={16}
              color={metric === 'streak' ? theme.colors.onBrand : theme.colors.macroProtein}
            />
            <AppText
              variant="bodySm"
              color={metric === 'streak' ? theme.colors.onBrand : theme.colors.textPrimary}
              style={styles.bold}
            >
              Chuỗi Streak
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.metricTab,
              metric === 'challenge' && {
                backgroundColor: theme.colors.brandPrimary,
              },
            ]}
            onPress={() => setMetric('challenge')}
          >
            <TrophyIcon
              size={16}
              color={metric === 'challenge' ? theme.colors.onBrand : theme.colors.vipStreak}
            />
            <AppText
              variant="bodySm"
              color={metric === 'challenge' ? theme.colors.onBrand : theme.colors.textPrimary}
              style={styles.bold}
            >
              Thử thách
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.metricTab,
              metric === 'steps' && {
                backgroundColor: theme.colors.brandPrimary,
              },
            ]}
            onPress={() => setMetric('steps')}
          >
            <RunningIcon
              size={16}
              color={metric === 'steps' ? theme.colors.onBrand : theme.colors.brandPrimary}
            />
            <AppText
              variant="bodySm"
              color={metric === 'steps' ? theme.colors.onBrand : theme.colors.textPrimary}
              style={styles.bold}
            >
              Bước chân
            </AppText>
          </TouchableOpacity>
        </View>

        {/* ── Leaderboard Table ──────────────────────────────────────── */}
        <AppCard style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <AppText variant="caption" color={theme.colors.textSecondary}>
              HẠNG
            </AppText>
            <AppText variant="caption" color={theme.colors.textSecondary} style={styles.colName}>
              THÀNH VIÊN
            </AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>
              THÀNH TÍCH
            </AppText>
          </View>

          {leaderboard.map((entry) => (
            <View
              key={entry.id}
              style={[
                styles.tableRow,
                entry.isCurrentUser && {
                  backgroundColor: theme.colors.brandSoftTint,
                  borderRadius: 12,
                },
              ]}
            >
              <View style={styles.rankBadgeBox}>
                {renderRankBadge(entry.rank)}
              </View>

              <View style={[styles.avatarBox, { backgroundColor: theme.colors.surface }]}>
                <AppText variant="bodyMd">{entry.avatarGlyph}</AppText>
              </View>

              <View style={styles.colName}>
                <AppText
                  variant="bodySm"
                  color={entry.isCurrentUser ? theme.colors.brandPrimary : theme.colors.textPrimary}
                  style={entry.isCurrentUser ? styles.bold : undefined}
                >
                  {entry.name}
                </AppText>
              </View>

              <View style={styles.scoreBox}>
                <AppText variant="headlineSm" color={theme.colors.brandPrimary}>
                  {entry.score.toLocaleString()}
                </AppText>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  {entry.unit}
                </AppText>
              </View>
            </View>
          ))}
        </AppCard>

        {/* ── Friends List Section ───────────────────────────────────── */}
        <View style={styles.friendsSection}>
          <View style={styles.sectionTitleRow}>
            <AppText variant="headlineSm">Danh sách bạn bè ({friends.length})</AppText>
            <TouchableOpacity onPress={() => navigation.navigate('FriendSearch')}>
              <AppText variant="bodySm" color={theme.colors.brandPrimary}>
                + Kết bạn mới
              </AppText>
            </TouchableOpacity>
          </View>

          {friends.map((friend) => (
            <TouchableOpacity
              key={friend.id}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('FriendProfile', { friendUserId: friend.id })}
            >
              <AppCard style={styles.friendCard}>
                <View style={styles.friendInfo}>
                  <View style={[styles.friendAvatar, { backgroundColor: theme.colors.brandSoftTint }]}>
                    <UserSingleIcon size={20} color={theme.colors.brandPrimary} />
                  </View>
                  <View>
                    <AppText variant="bodyMd">{friend.name}</AppText>
                    <AppText variant="caption" color={theme.colors.textSecondary}>
                      @{friend.username} • {friend.streak} ngày streak
                    </AppText>
                  </View>
                </View>

                {friend.status === 'pending_received' ? (
                  <AppButton
                    label="Chấp nhận"
                    variant="primary"
                    onPress={() => acceptFriendRequest(friend.id)}
                  />
                ) : friend.status === 'pending_sent' ? (
                  <AppText variant="caption" color={theme.colors.textSecondary}>
                    Đã gửi lời mời
                  </AppText>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <CheckIcon size={12} color={theme.colors.brandPrimary} />
                    <AppText variant="caption" color={theme.colors.brandPrimary}>
                      Bạn bè
                    </AppText>
                  </View>
                )}
              </AppCard>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  bannerContainer: {
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E1B2E',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(20, 18, 30, 0.45)',
    padding: 16,
    justifyContent: 'space-between',
  },
  bannerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerLeftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requestCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  settingsIconBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsEmoji: {
    fontSize: 18,
  },
  groupUsersIcon: {
    width: 60,
    height: 30,
  },
  addFriendBtn: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  privacyCard: {
    gap: 8,
  },
  privacyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  privacyText: {
    flex: 1,
    paddingRight: 10,
    gap: 2,
  },
  privacyNotice: {
    backgroundColor: 'rgba(46, 204, 113, 0.08)',
    padding: 8,
    borderRadius: 8,
  },
  metricTabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
  },
  tableCard: {
    gap: 8,
    paddingHorizontal: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: 'rgba(128,128,128,0.15)',
  },
  colName: {
    flex: 1,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  rankBadgeBox: {
    width: 36,
    alignItems: 'center',
  },
  avatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBox: {
    alignItems: 'flex-end',
  },
  bold: {
    fontWeight: '700',
  },
  friendsSection: {
    gap: 12,
    marginTop: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
});
