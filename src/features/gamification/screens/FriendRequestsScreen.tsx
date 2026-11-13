import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppText } from '@/components/common';
import {
  ChevronLeftIcon,
  MailInboxIcon,
  UserSingleIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import type { FriendRequest } from '../types';
import { useGamification } from '../GamificationProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'FriendRequests'>;

export function FriendRequestsScreen({ navigation }: Props) {
  const theme = useTheme();
  const { colors: c } = theme;
  const {
    incomingRequests,
    outgoingRequests,
    respondFriendRequest,
    cancelFriendRequest,
  } = useGamification();

  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');

  const handleAccept = (req: FriendRequest) => {
    respondFriendRequest(req.id, 'ACCEPT');
    Alert.alert('Thành công', `Đã chấp nhận lời mời từ ${req.user.displayName}`);
  };

  const handleDecline = (req: FriendRequest) => {
    Alert.alert(
      'Từ chối lời mời',
      `Bạn có chắc chắn muốn từ chối lời mời kết bạn từ ${req.user.displayName}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Từ chối',
          style: 'destructive',
          onPress: () => respondFriendRequest(req.id, 'DECLINE'),
        },
      ]
    );
  };

  const handleCancelOutgoing = (req: FriendRequest) => {
    Alert.alert(
      'Thu hồi lời mời',
      `Thu hồi lời mời kết bạn đã gửi tới ${req.user.displayName}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Thu hồi',
          style: 'destructive',
          onPress: () => cancelFriendRequest(req.id),
        },
      ]
    );
  };

  const renderIncomingItem = ({ item }: { item: FriendRequest }) => (
    <AppCard style={styles.card}>
      <View style={styles.userInfo}>
        <View style={[styles.avatarBox, { backgroundColor: c.brandSoftTint }]}>
          <UserSingleIcon size={24} color={c.brandPrimary} />
        </View>
        <View style={styles.userTextWrap}>
          <AppText variant="headlineSm" color={c.textPrimary}>
            {item.user.displayName}
          </AppText>
          <AppText variant="caption" color={c.textSecondary}>
            Đã gửi {item.createdAt}
          </AppText>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.declineButton, { backgroundColor: c.surfaceHigh, borderColor: c.surfaceBorder }]}
          onPress={() => handleDecline(item)}
        >
          <AppText variant="caption" color={c.textSecondary} style={styles.bold}>
            Từ chối
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.acceptButton, { backgroundColor: c.brandAction }]}
          onPress={() => handleAccept(item)}
        >
          <AppText variant="caption" color={c.onBrand} style={styles.bold}>
            Chấp nhận
          </AppText>
        </TouchableOpacity>
      </View>
    </AppCard>
  );

  const renderOutgoingItem = ({ item }: { item: FriendRequest }) => (
    <AppCard style={styles.card}>
      <View style={styles.userInfo}>
        <View style={[styles.avatarBox, { backgroundColor: c.surfaceHigh }]}>
          <UserSingleIcon size={24} color={c.textSecondary} />
        </View>
        <View style={styles.userTextWrap}>
          <AppText variant="headlineSm" color={c.textPrimary}>
            {item.user.displayName}
          </AppText>
          <AppText variant="caption" color={c.textSecondary}>
            Đã gửi • Chờ phản hồi
          </AppText>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.cancelButton, { backgroundColor: c.surfaceHigh, borderColor: c.statusDanger }]}
        onPress={() => handleCancelOutgoing(item)}
      >
        <AppText variant="caption" color={c.statusDanger} style={styles.bold}>
          Thu hồi
        </AppText>
      </TouchableOpacity>
    </AppCard>
  );

  const currentList = activeTab === 'incoming' ? incomingRequests : outgoingRequests;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.canvasBase }]}>
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <View style={[styles.topBar, { borderBottomColor: c.surfaceBorder }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronLeftIcon size={24} color={c.textPrimary} />
        </TouchableOpacity>
        <AppText variant="headlineSm" color={c.textPrimary} style={styles.topBarTitle}>
          Lời mời kết bạn
        </AppText>
        <TouchableOpacity
          style={styles.searchLinkBtn}
          onPress={() => navigation.navigate('FriendSearch')}
        >
          <AppText variant="caption" color={c.brandPrimary} style={styles.bold}>
            + Tìm bạn
          </AppText>
        </TouchableOpacity>
      </View>

      {/* ── Tabs Header ─────────────────────────────────────────────── */}
      <View style={[styles.tabBar, { borderBottomColor: c.surfaceBorder }]}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'incoming' && {
              borderBottomColor: c.brandPrimary,
              borderBottomWidth: 3,
            },
          ]}
          onPress={() => setActiveTab('incoming')}
        >
          <AppText
            variant="headlineSm"
            color={activeTab === 'incoming' ? c.brandPrimary : c.textSecondary}
          >
            Đã nhận ({incomingRequests.length})
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'outgoing' && {
              borderBottomColor: c.brandPrimary,
              borderBottomWidth: 3,
            },
          ]}
          onPress={() => setActiveTab('outgoing')}
        >
          <AppText
            variant="headlineSm"
            color={activeTab === 'outgoing' ? c.brandPrimary : c.textSecondary}
          >
            Đã gửi ({outgoingRequests.length})
          </AppText>
        </TouchableOpacity>
      </View>

      {/* ── List Content ────────────────────────────────────────────── */}
      <FlatList
        data={currentList}
        keyExtractor={(item) => item.id}
        renderItem={activeTab === 'incoming' ? renderIncomingItem : renderOutgoingItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: c.brandSoftTint }]}>
              <MailInboxIcon size={34} color={c.brandPrimary} />
            </View>
            <AppText variant="headlineSm" color={c.textPrimary} align="center">
              {activeTab === 'incoming'
                ? 'Không có lời mời nào đang chờ'
                : 'Bạn chưa gửi lời mời kết bạn nào'}
            </AppText>
            <AppText variant="bodySm" color={c.textSecondary} align="center">
              {activeTab === 'incoming'
                ? 'Khi có người dùng gửi lời mời kết bạn qua tên hoặc mã, thông báo sẽ hiển thị tại đây.'
                : 'Tìm kiếm bạn bè qua tên tài khoản hoặc mã kết bạn để bắt đầu thử thách!'}
            </AppText>
            <View style={styles.emptyBtnWrap}>
              <AppButton
                label="Tìm bạn bè mới ngay"
                variant="primary"
                onPress={() => navigation.navigate('FriendSearch')}
              />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
  },
  searchLinkBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 18,
    gap: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userTextWrap: {
    flex: 1,
    gap: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  declineButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  acceptButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  cancelButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  bold: { fontWeight: '700' },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emptyBtnWrap: {
    marginTop: 12,
    width: 220,
  },
});

