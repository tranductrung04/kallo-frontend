import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppText } from '@/components/common';
import { useTheme } from '@/theme';
import { formatNumber } from '@/features/nutrition/utils';
import { useActivity } from '../ActivityProvider';

export function HealthSyncScreen() {
  const theme = useTheme();
  const { state, syncHealthData, requestHealthPermission } = useActivity();
  const [syncing, setSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const isAndroid = Platform.OS === 'android';
  const activeSource = isAndroid ? 'HEALTH_CONNECT' : 'APPLE_HEALTH';
  const permissionStatus = isAndroid
    ? state.syncStatus.healthConnect
    : state.syncStatus.appleHealth;

  const handleConnect = async () => {
    await requestHealthPermission(activeSource);
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await syncHealthData(activeSource);
      if (res.duplicate) {
        setSyncFeedback('✓ Dữ liệu hôm nay đã đồng bộ mới nhất (không có bước chân mới).');
      } else {
        setSyncFeedback(
          `✓ Đồng bộ thành công: +${formatNumber(res.newSteps)} bước chân, +${formatNumber(res.newCalories)} kcal.`
        );
      }
    } catch {
      setSyncFeedback('✕ Đồng bộ thất bại. Vui lòng kiểm tra quyền truy cập.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <AppText variant="title">Đồng bộ Dữ liệu Sức khỏe</AppText>
          <AppText color={theme.colors.textMuted}>
            Tự động lấy dữ liệu bước chân và calo tiêu hao từ hệ điều hành
          </AppText>
        </View>

        {/* Health Connect Card */}
        <AppCard style={styles.providerCard}>
          <View style={styles.providerHeader}>
            <Image
              source={images.healthConnectArtwork}
              style={styles.artwork}
              resizeMode="contain"
              accessibilityLabel="Google Health Connect"
            />
            <View style={styles.providerInfo}>
              <View style={styles.nameRow}>
                <Image
                  source={images.healthConnectIcon}
                  style={styles.providerIcon}
                  resizeMode="contain"
                  accessibilityLabel="Biểu tượng Health Connect"
                />
                <AppText variant="heading">Health Connect</AppText>
              </View>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Nền tảng Google cho thiết bị Android
              </AppText>
            </View>
          </View>

          <View style={styles.statusRow}>
            <AppText variant="caption">Trạng thái:</AppText>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    state.syncStatus.healthConnect === 'CONNECTED'
                      ? theme.colors.primarySurface
                      : theme.colors.surfaceMuted,
                },
              ]}
            >
              <AppText
                variant="caption"
                color={
                  state.syncStatus.healthConnect === 'CONNECTED'
                    ? theme.colors.primary
                    : theme.colors.textMuted
                }
              >
                {state.syncStatus.healthConnect === 'CONNECTED'
                  ? '● Đã kết nối'
                  : '○ Chưa cấp quyền'}
              </AppText>
            </View>
          </View>

          {state.syncStatus.healthConnect !== 'CONNECTED' ? (
            <AppButton
              label="Cấp quyền Health Connect"
              variant="outline"
              onPress={() => requestHealthPermission('HEALTH_CONNECT')}
            />
          ) : null}
        </AppCard>

        {/* Apple HealthKit Card */}
        <AppCard style={styles.providerCard}>
          <View style={styles.providerHeader}>
            <Image
              source={images.appleHealthArtwork}
              style={styles.artwork}
              resizeMode="contain"
              accessibilityLabel="Apple Health"
            />
            <View style={styles.providerInfo}>
              <View style={styles.nameRow}>
                <Image
                  source={images.appleHealthIcon}
                  style={styles.providerIcon}
                  resizeMode="contain"
                  accessibilityLabel="Biểu tượng Apple Health"
                />
                <AppText variant="heading">Apple HealthKit</AppText>
              </View>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Đồng bộ bước chân và nhịp tim từ iPhone / Apple Watch
              </AppText>
            </View>
          </View>

          <View style={styles.statusRow}>
            <AppText variant="caption">Trạng thái:</AppText>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    state.syncStatus.appleHealth === 'CONNECTED'
                      ? theme.colors.primarySurface
                      : theme.colors.surfaceMuted,
                },
              ]}
            >
              <AppText
                variant="caption"
                color={
                  state.syncStatus.appleHealth === 'CONNECTED'
                    ? theme.colors.primary
                    : theme.colors.textMuted
                }
              >
                {state.syncStatus.appleHealth === 'CONNECTED'
                  ? '● Đã kết nối'
                  : '○ Chưa cấp quyền'}
              </AppText>
            </View>
          </View>

          {state.syncStatus.appleHealth !== 'CONNECTED' ? (
            <AppButton
              label="Cấp quyền Apple Health"
              variant="outline"
              onPress={() => requestHealthPermission('APPLE_HEALTH')}
            />
          ) : null}
        </AppCard>

        {/* Sync Action Area */}
        <AppCard style={styles.syncActionCard}>
          <View style={styles.syncActionHeader}>
            <Image
              source={images.trackerSyncIcon}
              style={[styles.syncIcon, syncing && styles.spin]}
              accessibilityLabel="Biểu tượng đồng bộ"
            />
            <View style={styles.syncTextCol}>
              <AppText variant="heading">Đồng bộ tức thì</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Kiểm tra dữ liệu mới nhất. Khử trùng lặp tự động (AC2 mục 4.5).
              </AppText>
            </View>
          </View>

          {syncFeedback ? (
            <View
              style={[
                styles.feedbackBox,
                {
                  backgroundColor: syncFeedback.startsWith('✓')
                    ? theme.colors.primarySurface
                    : '#FDEDED',
                },
              ]}
            >
              <AppText
                variant="caption"
                color={syncFeedback.startsWith('✓') ? theme.colors.primary : theme.colors.danger}
              >
                {syncFeedback}
              </AppText>
            </View>
          ) : null}

          <AppButton
            label={syncing ? 'Đang đồng bộ...' : 'Đồng bộ ngay bây giờ'}
            onPress={handleSyncNow}
            disabled={syncing}
          />
        </AppCard>

        {/* Sync History Logs */}
        <View style={styles.historySection}>
          <AppText variant="heading">Lịch sử đồng bộ ({state.syncLogs.length})</AppText>
          {state.syncLogs.length === 0 ? (
            <AppCard style={styles.emptyCard}>
              <AppText color={theme.colors.textMuted} align="center">
                Chưa có lượt đồng bộ nào. Nhấn "Đồng bộ ngay" để tải bước chân!
              </AppText>
            </AppCard>
          ) : (
            state.syncLogs.map((log) => (
              <AppCard key={log.id} style={styles.logCard}>
                <View style={styles.logRow}>
                  <View>
                    <AppText variant="heading">
                      {log.source === 'APPLE_HEALTH' ? 'Apple Health' : 'Health Connect'}
                    </AppText>
                    <AppText variant="caption" color={theme.colors.textMuted}>
                      {new Date(log.syncedAt).toLocaleTimeString('vi-VN')} • Ngày {log.date}
                    </AppText>
                  </View>
                  <View style={styles.logStats}>
                    <AppText variant="heading" color={theme.colors.primary}>
                      {formatNumber(log.steps)} bước
                    </AppText>
                    <AppText variant="caption" color={theme.colors.calorieBurned}>
                      {formatNumber(log.caloriesBurned)} kcal
                    </AppText>
                  </View>
                </View>
              </AppCard>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  header: { gap: 4 },
  providerCard: { gap: 12 },
  providerHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  artwork: { width: 54, height: 54 },
  providerInfo: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  providerIcon: { width: 20, height: 20 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  syncActionCard: { gap: 12 },
  syncActionHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  syncIcon: { width: 36, height: 36 },
  spin: { opacity: 0.6 },
  syncTextCol: { flex: 1 },
  feedbackBox: { padding: 10, borderRadius: 8 },
  historySection: { gap: 10, marginTop: 8 },
  emptyCard: { padding: 20, alignItems: 'center' },
  logCard: { paddingVertical: 10, paddingHorizontal: 14 },
  logRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logStats: { alignItems: 'flex-end' },
});
