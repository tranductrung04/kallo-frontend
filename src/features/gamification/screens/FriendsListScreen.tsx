import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, useAlert } from '@/components/common';
import {
  BadgeCheckIcon,
  ChevronLeftIcon,
  MoreVerticalIcon,
  PartyPopperIcon,
  SearchIcon,
  UserMinusIcon,
  UserPlusIcon,
  UserSingleIcon,
  UsersIcon,
  MailInboxIcon
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme, type ThemeContextValue } from '@/theme';
import type { Friend } from '../types';
import { useGamification } from '../GamificationProvider';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, any>;
}

export function FriendsListScreen({ navigation }: Props) {
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { friends, incomingRequests, unfriend } = useGamification();
  const { showConfirm, showAlert } = useAlert();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeActionFriendId, setActiveActionFriendId] = useState<string | null>(null);

  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return friends;
    const q = searchQuery.toLowerCase().trim();
    return friends.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.username.toLowerCase().includes(q)
    );
  }, [friends, searchQuery]);

  const handleUnfriend = (friend: Friend) => {
    showConfirm({
      title: 'Hủy kết bạn',
      message: `Bạn có chắc chắn muốn hủy kết bạn với ${friend.name}?`,
      confirmText: 'Hủy kết bạn',
      cancelText: 'Giữ lại',
      destructive: true,
      onConfirm: () => {
        unfriend(friend.id);
        setActiveActionFriendId(null);
        showAlert({
          title: 'Đã hủy kết bạn',
          message: `Đã hủy kết bạn với ${friend.name}`,
          variant: 'info',
        });
      },
    });
  };

  const handleMoreOptions = (friend: Friend) => {
    if (activeActionFriendId === friend.id) {
      setActiveActionFriendId(null);
    } else {
      setActiveActionFriendId(friend.id);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: c.canvasBase }]}>
      {/* ── Top Bar (Header) ────────────────────────────────────────── */}
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
            Danh sách bạn bè
          </AppText>
        </View>

        <View style={styles.topBarRight}>
          {/* Friend Requests Shortcut */}
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: c.surfaceHigh }]}
            onPress={() => navigation.navigate('FriendRequests')}
            accessibilityRole="button"
            accessibilityLabel="Lời mời kết bạn"
          >
            <MailInboxIcon size={18} color={c.textSecondary} />
            {incomingRequests.length > 0 && (
              <View style={[styles.requestBadge, { backgroundColor: c.vipStreak }]}>
                <AppText variant="labelSm" color="#FFFFFF" style={styles.badgeCountText}>
                  {incomingRequests.length}
                </AppText>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── Top Stat Banner ─────────────────────────────────────────── */}
        <View style={styles.topStatBanner}>
          <View style={styles.statLeftRow}>
            <AppText variant="headlineMd" color={c.textPrimary} style={styles.boldText}>
              {friends.length} bạn bè
            </AppText>
            <View style={[styles.maxFriendsPill, { backgroundColor: c.surfaceHigh }]}>
              <AppText variant="labelSm" color={c.textSecondary}>
                Tối đa 200 bạn
              </AppText>
            </View>
          </View>

          <View style={styles.statRightRow}>
            <BadgeCheckIcon size={17} color={c.brandPrimary} />
            <AppText variant="labelMd" color={c.brandPrimary} style={styles.boldText}>
              Đang hoạt động
            </AppText>
          </View>
        </View>

        {/* ── Search Quick Filter ──────────────────────────────────────── */}
        <View style={[styles.searchBox, { backgroundColor: c.surfaceMid }]}>
          <SearchIcon size={18} color={c.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: c.textPrimary }]}
            placeholder="Tìm bạn theo tên..."
            placeholderTextColor={c.textDisabled}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* ── Friends List White Bento Container ───────────────────────── */}
        <View style={[styles.bentoContainer, { backgroundColor: c.surfaceMid }]}>
          {filteredFriends.length === 0 ? (
            <View style={styles.emptyContainer}>
              <UsersIcon size={32} color={c.textSecondary} />
              <AppText variant="headlineSm" color={c.textPrimary} style={styles.boldText}>
                {searchQuery ? 'Không tìm thấy bạn bè' : 'Chưa có bạn bè nào'}
              </AppText>
              <AppText variant="bodySm" color={c.textSecondary} align="center">
                {searchQuery
                  ? `Không có kết quả nào phù hợp với "${searchQuery}"`
                  : 'Hãy kết nối thêm bạn bè để cùng thi đua và nhận quà nhé!'}
              </AppText>
            </View>
          ) : (
            filteredFriends.map((friend, idx) => {
              const isActionOpen = activeActionFriendId === friend.id;
              const isLast = idx === filteredFriends.length - 1;

              return (
                <View key={friend.id}>
                  {/* Friend Item Row */}
                  <View style={styles.friendRow}>
                    <TouchableOpacity
                      style={styles.friendLeftWrap}
                      activeOpacity={0.8}
                      onPress={() =>
                        navigation.navigate('FriendProfile', { friendUserId: friend.id })
                      }
                    >
                      {/* Avatar with active indicator */}
                      <View style={styles.avatarWrap}>
                        {friend.avatarUrl ? (
                          <Image source={{ uri: friend.avatarUrl }} style={styles.friendAvatar} />
                        ) : (
                          <View style={[styles.friendAvatarFallback, { backgroundColor: c.brandSoftTint }]}>
                            <UserSingleIcon size={22} color={c.brandPrimary} />
                          </View>
                        )}
                        {/* Status online dot */}
                        {friend.online && (
                          <View style={[styles.onlineStatusDot, { backgroundColor: c.brandSecondary }]} />
                        )}
                      </View>

                      {/* Name & Since / Activity Date */}
                      <View style={styles.friendInfoCol}>
                        <View style={styles.nameRow}>
                          <AppText
                            variant="headlineSm"
                            color={c.textPrimary}
                            style={styles.boldText}
                            numberOfLines={1}
                          >
                            {friend.name}
                          </AppText>
                          {isActionOpen && (
                            <View style={[styles.selectedPill, { backgroundColor: c.brandSoftTint }]}>
                              <AppText variant="labelSm" color={c.brandPrimary} style={styles.boldText}>
                                Đang chọn
                              </AppText>
                            </View>
                          )}
                        </View>
                        <AppText variant="bodySm" color={c.textSecondary} numberOfLines={1}>
                          {friend.since ? `Bạn từ ${friend.since}` : (friend.activityStatus || 'Đang kết nối')}
                        </AppText>
                      </View>
                    </TouchableOpacity>

                    {/* Action button */}
                    <TouchableOpacity
                      style={[styles.moreBtn, isActionOpen && { backgroundColor: c.surfaceHigh }]}
                      onPress={() => handleMoreOptions(friend)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityRole="button"
                      accessibilityLabel={`Tùy chọn ${friend.name}`}
                    >
                      <MoreVerticalIcon size={20} color={isActionOpen ? c.brandPrimary : c.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  {/* Revealed Action Panel when options tapped */}
                  {isActionOpen && (
                    <View style={[styles.revealedActionPanel, { backgroundColor: c.surfaceHigh }]}>
                      <TouchableOpacity
                        style={styles.profileOptionBtn}
                        onPress={() => {
                          setActiveActionFriendId(null);
                          navigation.navigate('FriendProfile', { friendUserId: friend.id });
                        }}
                      >
                        <UserSingleIcon size={16} color={c.textPrimary} />
                        <AppText variant="labelMd" color={c.textPrimary} style={styles.boldText}>
                          Xem hồ sơ
                        </AppText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.unfriendBtn, { backgroundColor: '#FEE2E2' }]}
                        onPress={() => handleUnfriend(friend)}
                      >
                        <UserMinusIcon size={16} color="#DC2626" />
                        <AppText variant="labelMd" color="#DC2626" style={styles.boldText}>
                          Hủy kết bạn
                        </AppText>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Divider line between rows */}
                  {!isLast && <View style={[styles.rowDivider, { backgroundColor: c.surfaceBorder }]} />}
                </View>
              );
            })
          )}
        </View>

        {/* ── Micro-engagement Motivation Banner ───────────────────────── */}
        <View style={[styles.motivationBanner, { backgroundColor: c.surfaceMuted }]}>
          <View style={[styles.motivationIconBox, { backgroundColor: c.brandSoftTint }]}>
            <PartyPopperIcon size={22} color={c.brandPrimary} />
          </View>
          <View style={styles.motivationTextCol}>
            <AppText variant="labelLg" color={c.textPrimary} style={styles.boldText} numberOfLines={1}>
              Gắn kết lối sống lành mạnh
            </AppText>
            <AppText variant="bodySm" color={c.textSecondary} numberOfLines={2}>
              Mời thêm bạn bè để cùng nhau hoàn thành thử thách mỗi ngày!
            </AppText>
          </View>
        </View>
      </ScrollView>

      {/* ── Floating Action Button (FAB): "Thêm bạn" ─────────────────── */}
      <View style={styles.fabWrap}>
        <TouchableOpacity
          style={[styles.fabButton, { backgroundColor: c.brandAction }]}
          onPress={() => navigation.navigate('FriendSearch')}
          activeOpacity={0.88}
        >
          <UserPlusIcon size={20} color="#FFFFFF" />
          <AppText variant="labelLg" color="#FFFFFF" style={styles.boldText}>
            Thêm bạn
          </AppText>
        </TouchableOpacity>
      </View>
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
    topBarRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    backButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
    },
    iconButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    requestBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    badgeCountText: {
      fontSize: 10,
      fontWeight: '700',
    },
    avatarCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      padding: 16,
      gap: 16,
      paddingBottom: 90,
    },
    topStatBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    statLeftRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    maxFriendsPill: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
    },
    statRightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 14,
      height: 44,
      borderRadius: 22,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      paddingVertical: 0,
    },
    bentoContainer: {
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 1,
    },
    friendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    friendLeftWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    avatarWrap: {
      position: 'relative',
      width: 44,
      height: 44,
    },
    friendAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
    },
    friendAvatarFallback: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    onlineStatusDot: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    friendInfoCol: {
      flex: 1,
      gap: 2,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    selectedPill: {
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 6,
    },
    moreBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    revealedActionPanel: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 10,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    profileOptionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 10,
    },
    unfriendBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 10,
    },
    rowDivider: {
      height: 1,
      width: '100%',
    },
    emptyContainer: {
      padding: 32,
      alignItems: 'center',
      gap: 8,
    },
    motivationBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderRadius: 16,
    },
    motivationIconBox: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    motivationTextCol: {
      flex: 1,
      gap: 2,
    },
    fabWrap: {
      position: 'absolute',
      bottom: 24,
      right: 16,
      zIndex: 40,
    },
    fabButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      height: 48,
      paddingHorizontal: 20,
      borderRadius: 24,
      shadowColor: c.brandAction,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 6,
    },
    boldText: {
      fontWeight: '700',
    },
  });
}
