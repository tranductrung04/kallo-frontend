import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, useAlert } from '@/components/common';
import {
  BadgeCheckIcon,
  CheckCheckIcon,
  CheckIcon,
  ChevronLeftIcon,
  MailInboxIcon,
  ShieldSecurityIcon,
  UserPlusIcon,
  UserSingleIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme, type ThemeContextValue } from '@/theme';
import type { FriendRequest } from '../types';
import { useGamification } from '../GamificationProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'FriendRequests'>;

export function FriendRequestsScreen({ navigation }: Props) {
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {
    incomingRequests,
    outgoingRequests,
    respondFriendRequest,
    cancelFriendRequest,
  } = useGamification();
  const { showConfirm, showAlert } = useAlert();

  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [acceptedIds, setAcceptedIds] = useState<Record<string, string>>({});

  const handleAccept = (req: FriendRequest) => {
    respondFriendRequest(req.id, 'ACCEPT');
    setAcceptedIds((prev) => ({
      ...prev,
      [req.id]: req.user.displayName,
    }));
  };

  const handleDecline = (req: FriendRequest) => {
    showConfirm({
      title: 'Từ chối lời mời',
      message: `Bạn có chắc chắn muốn từ chối lời mời kết bạn từ ${req.user.displayName}?`,
      confirmText: 'Từ chối',
      cancelText: 'Hủy',
      destructive: true,
      onConfirm: () => respondFriendRequest(req.id, 'DECLINE'),
    });
  };

  const handleCancelOutgoing = (req: FriendRequest) => {
    showConfirm({
      title: 'Huỷ lời mời',
      message: `Huỷ lời mời kết bạn đã gửi tới ${req.user.displayName}?`,
      confirmText: 'Huỷ lời mời',
      cancelText: 'Quay lại',
      destructive: true,
      onConfirm: () => cancelFriendRequest(req.id),
    });
  };

  const unhandledIncoming = incomingRequests.filter((r) => !acceptedIds[r.id]);

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
            Lời Mời Kết Bạn
          </AppText>
        </View>

        <View style={styles.topBarRight}>
          <View style={[styles.avatarCircle, { backgroundColor: c.brandPrimary }]}>
            <UserSingleIcon size={16} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── Segmented Tab Control ───────────────────────────────────── */}
        <View style={[styles.segmentedTabBar, { backgroundColor: c.surfaceHigh }]}>
          <TouchableOpacity
            style={[
              styles.segmentedTabItem,
              activeTab === 'received' && [
                styles.segmentedTabItemActive,
                { backgroundColor: c.surfaceMid },
              ],
            ]}
            onPress={() => setActiveTab('received')}
            activeOpacity={0.85}
          >
            <AppText
              variant="labelMd"
              color={activeTab === 'received' ? c.brandPrimary : c.textSecondary}
              style={activeTab === 'received' ? styles.boldText : undefined}
            >
              Đã nhận
            </AppText>
            {unhandledIncoming.length > 0 && (
              <View
                style={[
                  styles.tabCountBadge,
                  {
                    backgroundColor:
                      activeTab === 'received' ? c.brandSoftTint : c.surfaceHigh,
                  },
                ]}
              >
                <AppText
                  variant="labelSm"
                  color={activeTab === 'received' ? c.brandPrimary : c.textSecondary}
                  style={styles.boldText}
                >
                  {unhandledIncoming.length}
                </AppText>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentedTabItem,
              activeTab === 'sent' && [
                styles.segmentedTabItemActive,
                { backgroundColor: c.surfaceMid },
              ],
            ]}
            onPress={() => setActiveTab('sent')}
            activeOpacity={0.85}
          >
            <AppText
              variant="labelMd"
              color={activeTab === 'sent' ? c.brandPrimary : c.textSecondary}
              style={activeTab === 'sent' ? styles.boldText : undefined}
            >
              Đã gửi
            </AppText>
            {outgoingRequests.length > 0 && (
              <View style={[styles.tabCountBadge, { backgroundColor: c.surfaceHigh }]}>
                <AppText variant="labelSm" color={c.textSecondary} style={styles.boldText}>
                  {outgoingRequests.length}
                </AppText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ── TAB 1: ĐÃ NHẬN (INCOMING REQUESTS) ───────────────────────── */}
        {activeTab === 'received' && (
          <View style={styles.tabSectionWrap}>
            {/* Stream of Incoming Requests */}
            {incomingRequests.length === 0 ? (
              <View style={[styles.emptyContainer, { backgroundColor: c.surfaceMid }]}>
                <View style={[styles.emptyIconCircle, { backgroundColor: c.brandSoftTint }]}>
                  <CheckCheckIcon size={26} color={c.brandPrimary} />
                </View>
                <AppText variant="headlineSm" color={c.textPrimary} style={styles.boldText}>
                  Đã xong tất cả!
                </AppText>
                <AppText variant="bodySm" color={c.textSecondary} align="center">
                  Bạn đã xử lý hết các lời mời kết bạn mới.
                </AppText>
              </View>
            ) : (
              <View style={styles.requestsStream}>
                {incomingRequests.map((req) => {
                  const isAccepted = Boolean(acceptedIds[req.id]);

                  if (isAccepted) {
                    return (
                      <View
                        key={req.id}
                        style={[
                          styles.requestCard,
                          styles.acceptedCard,
                          { backgroundColor: c.surfaceMid, borderColor: c.brandPrimary },
                        ]}
                      >
                        <View style={styles.acceptedRow}>
                          <View style={styles.acceptedLeft}>
                            <View style={[styles.checkRound, { backgroundColor: '#16A34A' }]}>
                              <CheckIcon size={12} color="#FFFFFF" />
                            </View>
                            <AppText variant="labelLg" color={c.textPrimary} style={styles.boldText}>
                              Đã kết bạn với {req.user.displayName}
                            </AppText>
                          </View>
                          <TouchableOpacity
                            style={[styles.msgBtn, { backgroundColor: c.brandSoftTint }]}
                            onPress={() =>
                              showAlert({
                                title: 'Nhắn tin',
                                message: `Tính năng chat với ${req.user.displayName} sẽ sớm ra mắt!`,
                                variant: 'info',
                              })
                            }
                          >
                            <AppText variant="labelSm" color={c.brandPrimary} style={styles.boldText}>
                              Nhắn tin
                            </AppText>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }

                  return (
                    <View
                      key={req.id}
                      style={[styles.requestCard, { backgroundColor: c.surfaceMid, borderColor: c.surfaceBorder }]}
                    >
                      {/* User Info Row */}
                      <View style={styles.userRow}>
                        <View style={styles.avatarWrap}>
                          {req.user.avatarUrl ? (
                            <Image source={{ uri: req.user.avatarUrl }} style={styles.avatarImg} />
                          ) : (
                            <View style={[styles.avatarFallback, { backgroundColor: c.brandSoftTint }]}>
                              <UserSingleIcon size={24} color={c.brandPrimary} />
                            </View>
                          )}
                          {/* Online status indicator ring */}
                          {req.user.online && (
                            <View style={styles.onlineDot} />
                          )}
                        </View>

                        <View style={styles.userInfoCol}>
                          <View style={styles.userNameRow}>
                            <AppText
                              variant="headlineSm"
                              color={c.textPrimary}
                              style={styles.boldText}
                              numberOfLines={1}
                            >
                              {req.user.displayName}
                            </AppText>
                            {req.user.verified && (
                              <BadgeCheckIcon size={16} color={c.brandPrimary} />
                            )}
                          </View>
                          <AppText variant="bodySm" color={c.textSecondary} numberOfLines={1}>
                            {req.createdAt || 'Có bạn chung'}
                          </AppText>
                        </View>
                      </View>

                      {/* Action Buttons Row */}
                      <View style={styles.btnRow}>
                        <TouchableOpacity
                          style={[styles.acceptBtn, { backgroundColor: c.brandAction }]}
                          onPress={() => handleAccept(req)}
                          activeOpacity={0.88}
                        >
                          <UserPlusIcon size={18} color="#FFFFFF" />
                          <AppText variant="labelLg" color="#FFFFFF" style={styles.boldText}>
                            Chấp nhận
                          </AppText>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.declineBtn, { backgroundColor: c.surfaceHigh }]}
                          onPress={() => handleDecline(req)}
                          activeOpacity={0.8}
                        >
                          <AppText variant="labelLg" color={c.textSecondary}>
                            Từ chối
                          </AppText>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Sent Requests Preview Container (Below incoming) */}
            {outgoingRequests.length > 0 && (
              <View style={[styles.sentPreviewBox, { backgroundColor: c.surfaceMuted }]}>
                <View style={styles.sentHeaderRow}>
                  <View style={styles.sentHeaderLeft}>
                    <MailInboxIcon size={18} color={c.textSecondary} />
                    <AppText variant="labelMd" color={c.textPrimary} style={styles.boldText}>
                      Lời mời bạn đã gửi
                    </AppText>
                  </View>
                  <View style={[styles.sentCountPill, { backgroundColor: c.surfaceHigh }]}>
                    <AppText variant="labelSm" color={c.textSecondary} style={styles.boldText}>
                      {outgoingRequests.length}
                    </AppText>
                  </View>
                </View>

                {outgoingRequests.map((outReq) => (
                  <View
                    key={outReq.id}
                    style={[styles.sentItemCard, { backgroundColor: c.surfaceMid }]}
                  >
                    <View style={styles.sentItemLeft}>
                      {outReq.user.avatarUrl ? (
                        <Image source={{ uri: outReq.user.avatarUrl }} style={styles.sentAvatar} />
                      ) : (
                        <View style={[styles.sentAvatarFallback, { backgroundColor: c.brandSoftTint }]}>
                          <UserSingleIcon size={18} color={c.brandPrimary} />
                        </View>
                      )}
                      <View style={styles.sentTextCol}>
                        <AppText variant="labelLg" color={c.textPrimary} style={styles.boldText}>
                          {outReq.user.displayName}
                        </AppText>
                        <View style={styles.waitingDotRow}>
                          <View style={[styles.waitingDot, { backgroundColor: c.brandSecondary }]} />
                          <AppText variant="bodySm" color={c.textSecondary}>
                            Đang chờ phản hồi
                          </AppText>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleCancelOutgoing(outReq)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <AppText variant="labelMd" color={c.danger} style={styles.boldText}>
                        Huỷ lời mời
                      </AppText>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ── TAB 2: ĐÃ GỬI (OUTGOING REQUESTS FULL VIEW) ──────────────── */}
        {activeTab === 'sent' && (
          <View style={styles.tabSectionWrap}>
            {outgoingRequests.length === 0 ? (
              <View style={[styles.emptyContainer, { backgroundColor: c.surfaceMid }]}>
                <MailInboxIcon size={32} color={c.textSecondary} />
                <AppText variant="headlineSm" color={c.textPrimary} style={styles.boldText}>
                  Chưa gửi lời mời nào
                </AppText>
                <AppText variant="bodySm" color={c.textSecondary} align="center">
                  Bạn có thể tìm kiếm bạn bè theo mã hoặc tên để kết nối!
                </AppText>
              </View>
            ) : (
              <View style={styles.requestsStream}>
                {outgoingRequests.map((outReq) => (
                  <View
                    key={outReq.id}
                    style={[styles.requestCard, { backgroundColor: c.surfaceMid, borderColor: c.surfaceBorder }]}
                  >
                    <View style={styles.userRow}>
                      <View style={styles.avatarWrap}>
                        {outReq.user.avatarUrl ? (
                          <Image source={{ uri: outReq.user.avatarUrl }} style={styles.avatarImg} />
                        ) : (
                          <View style={[styles.avatarFallback, { backgroundColor: c.brandSoftTint }]}>
                            <UserSingleIcon size={24} color={c.brandPrimary} />
                          </View>
                        )}
                      </View>

                      <View style={styles.userInfoCol}>
                        <AppText variant="headlineSm" color={c.textPrimary} style={styles.boldText}>
                          {outReq.user.displayName}
                        </AppText>
                        <View style={styles.waitingDotRow}>
                          <View style={[styles.waitingDot, { backgroundColor: c.brandSecondary }]} />
                          <AppText variant="bodySm" color={c.textSecondary}>
                            Đang chờ phản hồi
                          </AppText>
                        </View>
                      </View>
                    </View>

                    <View style={styles.btnRow}>
                      <TouchableOpacity
                        style={[styles.cancelBtn, { backgroundColor: c.surfaceHigh }]}
                        onPress={() => handleCancelOutgoing(outReq)}
                        activeOpacity={0.8}
                      >
                        <AppText variant="labelMd" color={c.danger} style={styles.boldText}>
                          Huỷ lời mời kết bạn
                        </AppText>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ── Security & Privacy Footer Note ──────────────────────────── */}
        <View style={styles.footerNoteWrap}>
          <ShieldSecurityIcon size={16} color={c.brandPrimary} />
          <AppText variant="bodySm" color={c.textSecondary} align="center" style={styles.footerNoteText}>
            Lời mời kết bạn sẽ tự động hết hạn sau 14 ngày nếu không được chấp nhận
          </AppText>
        </View>
      </ScrollView>
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
    },
    backButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
    },
    avatarCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      padding: 16,
      gap: 16,
      paddingBottom: 40,
    },
    segmentedTabBar: {
      flexDirection: 'row',
      borderRadius: 24,
      padding: 4,
    },
    segmentedTabItem: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: 9,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderRadius: 20,
    },
    segmentedTabItemActive: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    tabCountBadge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 5,
    },
    tabSectionWrap: {
      gap: 16,
    },
    requestsStream: {
      gap: 12,
    },
    requestCard: {
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      gap: 14,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    acceptedCard: {
      borderWidth: 1.5,
      paddingVertical: 12,
    },
    acceptedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    acceptedLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
    },
    checkRound: {
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
    },
    msgBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
    },
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    avatarWrap: {
      position: 'relative',
      width: 48,
      height: 48,
    },
    avatarImg: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    avatarFallback: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    onlineDot: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: '#10B981',
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    userInfoCol: {
      flex: 1,
      gap: 3,
    },
    userNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    btnRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    acceptBtn: {
      flex: 1,
      height: 44,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      shadowColor: c.brandAction,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 2,
    },
    declineBtn: {
      height: 44,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelBtn: {
      flex: 1,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sentPreviewBox: {
      borderRadius: 16,
      padding: 16,
      gap: 12,
    },
    sentHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sentHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    sentCountPill: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
    },
    sentItemCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      borderRadius: 12,
    },
    sentItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    sentAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    sentAvatarFallback: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sentTextCol: {
      flex: 1,
      gap: 2,
    },
    waitingDotRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    waitingDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    emptyContainer: {
      borderRadius: 16,
      padding: 32,
      alignItems: 'center',
      gap: 8,
    },
    emptyIconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    footerNoteWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    footerNoteText: {
      flex: 1,
    },
    boldText: {
      fontWeight: '700',
    },
  });
}
