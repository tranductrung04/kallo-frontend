import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  Share,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppText } from '@/components/common';
import {
  ChevronLeftIcon,
  CloseXIcon,
  SearchIcon,
  ShareNodesIcon,
  UserSingleIcon,
  UsersIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import type { UserSearchResult } from '../types';
import { useGamification } from '../GamificationProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'FriendSearch'>;

export function FriendSearchScreen({ navigation }: Props) {
  const theme = useTheme();
  const { colors: c } = theme;
  const {
    gameSettings,
    searchUsers,
    sendFriendRequestToUser,
    respondFriendRequest,
    incomingRequests,
  } = useGamification();

  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<UserSearchResult[]>([]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    const found = searchUsers(text);
    setResults(found);
  };

  const handleSend = (user: UserSearchResult) => {
    const res = sendFriendRequestToUser(user.displayName);
    if (res.success) {
      Alert.alert('Thành công', res.message);
      // Update relationship in local list
      setResults((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, relationship: 'PENDING_OUT' } : u
        )
      );
    } else {
      Alert.alert('Thông báo', res.message);
    }
  };

  const handleAcceptIncoming = (user: UserSearchResult) => {
    const req = incomingRequests.find((r) => r.user.displayName === user.displayName);
    if (req) {
      respondFriendRequest(req.id, 'ACCEPT');
      Alert.alert('Đã kết bạn', `Bạn và ${user.displayName} đã trở thành bạn bè!`);
      setResults((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, relationship: 'FRIENDS' } : u
        )
      );
    }
  };

  const handleShareMyCode = async () => {
    try {
      await Share.share({
        message: `Hãy kết bạn với mình trên ứng dụng Kallo qua mã kết bạn: ${gameSettings.friendCode} để cùng nhau theo dõi sức khỏe và thi đua nhé!`,
      });
    } catch {
      // Ignored
    }
  };

  const renderItem = ({ item }: { item: UserSearchResult }) => {
    return (
      <AppCard style={styles.userCard}>
        <View style={styles.userInfo}>
          <View style={[styles.avatarBox, { backgroundColor: c.brandSoftTint }]}>
            <UserSingleIcon size={24} color={c.brandPrimary} />
          </View>
          <View style={styles.userTextWrap}>
            <AppText variant="headlineSm" color={c.textPrimary}>
              {item.displayName}
            </AppText>
            <AppText variant="caption" color={c.textSecondary}>
              Người dùng Kallo
            </AppText>
          </View>
        </View>

        <View style={styles.actionWrap}>
          {item.relationship === 'FRIENDS' ? (
            <View style={[styles.badgePill, { backgroundColor: c.brandSoftTint }]}>
              <AppText variant="caption" color={c.brandPrimary} style={styles.bold}>
                Bạn bè ✓
              </AppText>
            </View>
          ) : item.relationship === 'PENDING_OUT' ? (
            <View style={[styles.badgePill, { backgroundColor: c.surfaceHigh }]}>
              <AppText variant="caption" color={c.textSecondary}>
                Đã gửi lời mời
              </AppText>
            </View>
          ) : item.relationship === 'PENDING_IN' ? (
            <AppButton
              label="Chấp nhận"
              variant="primary"
              onPress={() => handleAcceptIncoming(item)}
            />
          ) : (
            <AppButton
              label="+ Kết bạn"
              variant="primary"
              onPress={() => handleSend(item)}
            />
          )}
        </View>
      </AppCard>
    );
  };

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
          Tìm kiếm bạn bè
        </AppText>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <View style={styles.container}>
        {/* ── Search Input ──────────────────────────────────────────── */}
        <View style={[styles.searchBox, { backgroundColor: c.surfaceHigh, borderColor: c.surfaceBorder }]}>
          <SearchIcon size={20} color={c.textSecondary} />
          <TextInput
            style={[styles.input, { color: c.textPrimary }]}
            placeholder="Tìm theo tên hoặc mã kết bạn (8 ký tự)..."
            placeholderTextColor={c.textSecondary}
            value={query}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <CloseXIcon size={18} color={c.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── My Friend Code Banner ─────────────────────────────────── */}
        <AppCard style={styles.myCodeCard}>
          <View style={styles.myCodeRow}>
            <View style={styles.flex}>
              <AppText variant="caption" color={c.textSecondary}>
                MÃ KẾT BẠN CỦA BẠN
              </AppText>
              <AppText variant="headlineMd" color={c.brandPrimary} style={styles.codeText}>
                {gameSettings.friendCode}
              </AppText>
            </View>
            <TouchableOpacity style={[styles.shareCodeBtn, { backgroundColor: c.brandAction }]} onPress={handleShareMyCode}>
              <ShareNodesIcon size={16} color={c.onBrand} />
              <AppText variant="caption" color={c.onBrand} style={styles.bold}>
                Chia sẻ mã
              </AppText>
            </TouchableOpacity>
          </View>
        </AppCard>

        {/* ── Results List ──────────────────────────────────────────── */}
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            hasSearched ? (
              <View style={styles.emptyWrap}>
                <View style={[styles.emptyIconCircle, { backgroundColor: c.surfaceHigh }]}>
                  <SearchIcon size={32} color={c.textSecondary} />
                </View>
                <AppText variant="headlineSm" color={c.textPrimary} align="center">
                  Không tìm thấy người dùng
                </AppText>
                <AppText variant="bodySm" color={c.textSecondary} align="center">
                  Hãy thử tìm kiếm với tên đầy đủ hoặc kiểm tra lại mã kết bạn 8 ký tự nhé.
                </AppText>
              </View>
            ) : (
              <View style={styles.emptyWrap}>
                <View style={[styles.emptyIconCircle, { backgroundColor: c.brandSoftTint }]}>
                  <UsersIcon size={34} color={c.brandPrimary} />
                </View>
                <AppText variant="headlineSm" color={c.textPrimary} align="center">
                  Kết nối bạn bè sống khỏe
                </AppText>
                <AppText variant="bodySm" color={c.textSecondary} align="center">
                  Cùng theo dõi tiến độ, duy trì chuỗi ngày và cổ vũ nhau rèn luyện thói quen dinh dưỡng mỗi ngày!
                </AppText>
              </View>
            )
          }
        />
      </View>
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
  backButtonPlaceholder: {
    width: 36,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  myCodeCard: {
    padding: 14,
    borderRadius: 18,
  },
  myCodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex: { flex: 1 },
  codeText: {
    letterSpacing: 2,
    fontWeight: '800',
    marginTop: 2,
  },
  shareCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bold: { fontWeight: '700' },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 18,
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
  actionWrap: {
    marginLeft: 8,
  },
  badgePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
});

