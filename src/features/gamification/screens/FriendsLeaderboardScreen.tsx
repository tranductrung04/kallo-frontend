import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppText } from '@/components/common';
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
    sendFriendRequest,
    acceptFriendRequest,
  } = useGamification();

  const [metric, setMetric] = useState<LeaderboardMetric>('streak');
  const [showAddModal, setShowAddModal] = useState(false);
  const [friendUsername, setFriendUsername] = useState('');

  const leaderboard = getLeaderboard(metric);

  const handleSendRequest = () => {
    if (!friendUsername.trim()) return;
    const ok = sendFriendRequest(friendUsername);
    if (ok) {
      Alert.alert('Đã gửi lời mời', `Đã gửi lời mời kết bạn tới @${friendUsername}`);
      setFriendUsername('');
      setShowAddModal(false);
    } else {
      Alert.alert('Thông báo', 'Tài khoản này đã có trong danh sách bạn bè hoặc đã gửi lời mời.');
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
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
              <Image
                source={images.groupUsers}
                style={styles.groupUsersIcon}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.addFriendBtn}
                onPress={() => setShowAddModal(true)}
              >
                <AppText variant="caption" color="#FFFFFF">
                  + Thêm bạn
                </AppText>
              </TouchableOpacity>
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
            <Switch
              value={isSharingPrivacy}
              onValueChange={toggleSharingPrivacy}
              trackColor={{ false: 'rgba(128,128,128,0.3)', true: theme.colors.brandPrimary }}
            />
          </View>
          <View style={styles.privacyNotice}>
            <AppText variant="caption" color={theme.colors.brandPrimary}>
              🔒 Bảo mật: Tuyệt đối không bao giờ hiển thị cân nặng cá nhân lên bảng xếp hạng.
            </AppText>
          </View>
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
            <AppText
              variant="bodySm"
              color={metric === 'streak' ? '#FFFFFF' : theme.colors.textPrimary}
            >
              🔥 Chuỗi Streak
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
            <AppText
              variant="bodySm"
              color={metric === 'challenge' ? '#FFFFFF' : theme.colors.textPrimary}
            >
              🏆 Thử thách
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
            <AppText
              variant="bodySm"
              color={metric === 'steps' ? '#FFFFFF' : theme.colors.textPrimary}
            >
              👟 Bước chân
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
                <AppText variant="headlineSm">{getRankBadge(entry.rank)}</AppText>
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
            <TouchableOpacity onPress={() => setShowAddModal(true)}>
              <AppText variant="bodySm" color={theme.colors.brandPrimary}>
                + Kết bạn mới
              </AppText>
            </TouchableOpacity>
          </View>

          {friends.map((friend) => (
            <AppCard key={friend.id} style={styles.friendCard}>
              <View style={styles.friendInfo}>
                <View style={[styles.friendAvatar, { backgroundColor: theme.colors.brandSoftTint }]}>
                  <AppText variant="bodyMd">{friend.avatarGlyph}</AppText>
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
                <AppText variant="caption" color={theme.colors.brandPrimary}>
                  Bạn bè ✓
                </AppText>
              )}
            </AppCard>
          ))}
        </View>
      </ScrollView>

      {/* ── Add Friend Modal ─────────────────────────────────────────── */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalBox, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <AppText variant="headlineSm">Kết nối bạn bè mới</AppText>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <AppText variant="headlineSm">✕</AppText>
              </TouchableOpacity>
            </View>

            <AppText variant="bodySm" color={theme.colors.textSecondary}>
              Nhập tên tài khoản hoặc email của bạn bè để cùng thi đua duy trì thói quen sống khỏe.
            </AppText>

            <TextInput
              style={[
                styles.friendInput,
                { color: theme.colors.textPrimary, borderColor: theme.colors.border },
              ]}
              placeholder="Nhập tên đăng nhập (ví dụ: nam_fitness)"
              placeholderTextColor={theme.colors.textSecondary}
              value={friendUsername}
              onChangeText={setFriendUsername}
              autoCapitalize="none"
            />

            <AppButton
              label="Gửi lời mời kết bạn"
              variant="primary"
              onPress={handleSendRequest}
              disabled={!friendUsername.trim()}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 18, 30, 0.45)',
    padding: 16,
    justifyContent: 'space-between',
  },
  bannerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
    alignItems: 'center',
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
