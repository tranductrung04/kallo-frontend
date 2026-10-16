import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppText } from './AppText';
import { useOfflineSync } from '@/services/offline';
import { useTheme } from '@/theme';

export function OfflineBanner() {
  const theme = useTheme();
  const { isOnline, isSyncing, pendingCount, syncNow, toggleOnlineStatus } = useOfflineSync();

  // If online and no pending sync items, do not render
  if (isOnline && pendingCount === 0 && !isSyncing) {
    return null;
  }

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: !isOnline
            ? theme.colors.surfaceMid
            : theme.colors.brandSoftTint,
          borderBottomColor: !isOnline
            ? theme.colors.calorieIn
            : theme.colors.brandPrimary,
        },
      ]}
    >
      <View style={styles.contentRow}>
        <View style={styles.statusIndicator}>
          {!isOnline ? (
            <View style={[styles.dot, { backgroundColor: theme.colors.calorieIn }]} />
          ) : isSyncing ? (
            <ActivityIndicator size="small" color={theme.colors.brandPrimary} />
          ) : (
            <View style={[styles.dot, { backgroundColor: theme.colors.brandPrimary }]} />
          )}
        </View>

        <View style={styles.textWrap}>
          <AppText variant="caption" color={theme.colors.textPrimary} style={styles.bold}>
            {!isOnline
              ? 'Đang ở chế độ ngoại tuyến'
              : isSyncing
              ? 'Đang đồng bộ dữ liệu...'
              : 'Đã kết nối lại'}
          </AppText>
          <AppText variant="caption" color={theme.colors.textSecondary}>
            {pendingCount > 0
              ? `${pendingCount} mục chờ đồng bộ vào hệ thống`
              : 'Dữ liệu đã được cập nhật mới nhất'}
          </AppText>
        </View>

        <View style={styles.actionRow}>
          {pendingCount > 0 && isOnline && !isSyncing && (
            <TouchableOpacity
              style={[styles.syncBtn, { backgroundColor: theme.colors.brandPrimary }]}
              onPress={() => void syncNow()}
              accessibilityRole="button"
              accessibilityLabel="Đồng bộ ngay"
            >
              <AppText variant="caption" color="#FFFFFF">
                Đồng bộ
              </AppText>
            </TouchableOpacity>
          )}

          {/* Simulation toggle button for offline testing (AC1 mục 4.8) */}
          <TouchableOpacity
            style={[styles.testToggleBtn, { borderColor: theme.colors.border }]}
            onPress={toggleOnlineStatus}
            accessibilityRole="button"
            accessibilityLabel={isOnline ? 'Chuyển sang Ngoại tuyến' : 'Chuyển sang Trực tuyến'}
          >
            <AppText variant="caption" color={theme.colors.textSecondary}>
              {!isOnline ? 'Bật mạng' : 'Tắt mạng'}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1.5,
    zIndex: 99,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  statusIndicator: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  textWrap: {
    flex: 1,
    gap: 1,
  },
  bold: {
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  testToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
});
