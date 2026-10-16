import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppText, EmptyStateView } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import type { NotificationCategory } from '../types';
import { useSystem } from '../SystemProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationCenter'>;

const CATEGORIES: Array<{ key: NotificationCategory; label: string }> = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'NUTRITION', label: 'Dinh dưỡng' },
  { key: 'ACTIVITY', label: 'Vận động' },
  { key: 'COMMUNITY', label: 'Cộng đồng' },
];

export function NotificationCenterScreen({ navigation }: Props) {
  const theme = useTheme();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useSystem();

  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('ALL');

  const filteredNotifications = notifications.filter(
    (n) => selectedCategory === 'ALL' || n.category === selectedCategory
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
      {/* ── Top Bar Action Row ──────────────────────────────────────── */}
      <View style={styles.topActionsRow}>
        <View>
          <AppText variant="headlineSm">Thông báo</AppText>
          <AppText variant="caption" color={theme.colors.textSecondary}>
            {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả đã đọc'}
          </AppText>
        </View>

        <View style={styles.btnRow}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={[styles.smallBtn, { borderColor: theme.colors.brandPrimary }]}
              onPress={markAllAsRead}
            >
              <AppText variant="caption" color={theme.colors.brandPrimary}>
                Đọc tất cả
              </AppText>
            </TouchableOpacity>
          )}

          {notifications.length > 0 && (
            <TouchableOpacity
              style={[styles.smallBtn, { borderColor: theme.colors.border }]}
              onPress={clearAllNotifications}
            >
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Xóa hết
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Category Filter Pills ───────────────────────────────────── */}
      <View style={styles.categoriesWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === cat.key
                      ? theme.colors.brandPrimary
                      : theme.colors.surface,
                  borderColor:
                    selectedCategory === cat.key
                      ? theme.colors.brandPrimary
                      : theme.colors.border,
                },
              ]}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <AppText
                variant="caption"
                color={selectedCategory === cat.key ? '#FFFFFF' : theme.colors.textPrimary}
              >
                {cat.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Notifications List ──────────────────────────────────────── */}
      <ScrollView contentContainerStyle={styles.content}>
        {filteredNotifications.length === 0 ? (
          <EmptyStateView
            title="Hộp thư trống"
            message="Bạn chưa có thông báo mới nào. Hãy yên tâm tiếp tục duy trì thói quen sống khỏe!"
          />
        ) : (
          filteredNotifications.map((notif) => (
            <TouchableOpacity
              key={notif.id}
              activeOpacity={0.85}
              onPress={() => {
                markAsRead(notif.id);
                if (notif.actionRoute && notif.actionRoute !== 'MainTabs') {
                  navigation.navigate(notif.actionRoute as any);
                }
              }}
            >
              <AppCard
                style={[
                  styles.notifCard,
                  !notif.isRead && {
                    backgroundColor: theme.colors.surfaceMid,
                    borderLeftWidth: 4,
                    borderLeftColor: theme.colors.brandPrimary,
                  },
                ]}
              >
                <View style={styles.notifHeader}>
                  <View style={styles.titleRow}>
                    {!notif.isRead && <View style={[styles.redDot, { backgroundColor: theme.colors.calorieIn }]} />}
                    <AppText variant="headlineSm">{notif.title}</AppText>
                  </View>
                  <TouchableOpacity
                    onPress={() => deleteNotification(notif.id)}
                    style={styles.deleteBtn}
                  >
                    <AppText variant="caption" color={theme.colors.textSecondary}>✕</AppText>
                  </TouchableOpacity>
                </View>

                <AppText variant="bodySm" color={theme.colors.textSecondary} style={styles.messageText}>
                  {notif.message}
                </AppText>

                <View style={styles.notifFooter}>
                  <AppText variant="caption" color={theme.colors.textSecondary}>
                    {notif.timestamp}
                  </AppText>
                  {notif.actionRoute && (
                    <AppText variant="caption" color={theme.colors.brandPrimary}>
                      Xem ngay →
                    </AppText>
                  )}
                </View>
              </AppCard>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  smallBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoriesWrap: {
    paddingBottom: 8,
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 36,
  },
  notifCard: {
    gap: 8,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  deleteBtn: {
    padding: 4,
  },
  messageText: {
    lineHeight: 20,
  },
  notifFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
});
