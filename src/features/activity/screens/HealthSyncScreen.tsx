import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { CheckIcon, ChevronLeftIcon, FlameIcon, FootprintsIcon, HeartIcon, RefreshCwIcon } from '@/components/icons';
import { images } from '@/assets/images';
import { useTheme } from '@/theme';
import { useAlert } from '@/components/common';
import { formatNumber, todayKey } from '@/features/nutrition/utils';
import { useActivity } from '../ActivityProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'HealthSync'>;

function GreenCheckIcon({ color }: { color: string }) {
  return (
    <View style={[styles.greenCheckBadge, { backgroundColor: color }]}>
      <CheckIcon size={12} color="#FFFFFF" strokeWidth={3.5} />
    </View>
  );
}

export function HealthSyncScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors: c } = theme;
  const { showAlert } = useAlert();
  const {
    state,
    requestHealthPermission,
    disconnectHealth,
    syncHealthData,
    refreshHealthSyncStatus,
  } = useActivity();

  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const isIos = Platform.OS === 'ios';
  const activeSource: 'HEALTH_CONNECT' | 'APPLE_HEALTH' = isIos ? 'APPLE_HEALTH' : 'HEALTH_CONNECT';
  const providerKey = isIos ? 'appleHealth' : 'healthConnect';
  const providerName = isIos ? 'Apple Health' : 'Google Health Connect';
  const providerLogo = isIos ? images.appleHealthIcon : images.healthConnectIcon;

  const isConnected = state.syncStatus[providerKey] === 'CONNECTED';
  const lastSyncIso = state.lastSyncedAt?.[providerKey];

  const formattedLastSync = React.useMemo(() => {
    if (!lastSyncIso) return 'Chưa đồng bộ';
    try {
      const d = new Date(lastSyncIso);
      const hours = d.getHours().toString().padStart(2, '0');
      const mins = d.getMinutes().toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      return `${hours}:${mins} • ${day}/${month}`;
    } catch {
      return 'Vừa xong';
    }
  }, [lastSyncIso]);

  // Today's synced data
  const today = todayKey();
  const todaySyncLog = state.syncLogs.find((l) => l.date === today && l.source === activeSource);
  const todaySteps = state.dailySummary[today]?.totalSteps ?? todaySyncLog?.steps ?? 0;
  const todayCalories = state.dailySummary[today]?.stepCalories ?? todaySyncLog?.caloriesBurned ?? 0;
  const todayHeartRate = state.dailySummary[today]?.averageHeartRate ?? todaySyncLog?.heartRateAvg ?? 72;

  const handleAllowAccess = async () => {
    try {
      setConnecting(true);
      await requestHealthPermission(activeSource);
      const res = await syncHealthData(activeSource);
      await refreshHealthSyncStatus();
      if (res.success) {
        showAlert({
          title: 'Kết nối thành công',
          message: `Đã kết nối với ${providerName} và đồng bộ dữ liệu hôm nay.`,
          buttons: [{ text: 'Tuyệt vời', variant: 'primary', onPress: () => navigation.goBack() }],
        });
      } else {
        navigation.goBack();
      }
    } catch {
      navigation.goBack();
    } finally {
      setConnecting(false);
    }
  };

  const handleManualSync = async () => {
    if (syncing) return;
    try {
      setSyncing(true);
      const res = await syncHealthData(activeSource);
      if (res.success) {
        showAlert({
          title: 'Đồng bộ hoàn tất',
          message: res.duplicate
            ? `Dữ liệu từ ${providerName} đã được cập nhật mới nhất.`
            : `Đã đồng bộ thêm ${formatNumber(res.newSteps)} bước chân và ${formatNumber(res.newCalories)} calo.`,
        });
      } else {
        showAlert({
          title: 'Đồng bộ không thành công',
          message: 'Không thể kết nối với máy chủ, vui lòng thử lại sau.',
        });
      }
    } catch {
      showAlert({
        title: 'Có lỗi xảy ra',
        message: 'Vui lòng kiểm tra kết nối mạng và thử lại.',
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = () => {
    showAlert({
      title: `Ngắt kết nối ${providerName}?`,
      message: 'Ứng dụng sẽ dừng tự động đồng bộ bước chân và nhịp tim từ nguồn này. Bạn có thể kết nối lại bất cứ lúc nào.',
      buttons: [
        { text: 'Hủy', variant: 'outline' },
        {
          text: 'Ngắt kết nối',
          variant: 'danger',
          onPress: async () => {
            await disconnectHealth(activeSource);
            showAlert({
              title: 'Đã ngắt kết nối',
              message: `Đã ngừng đồng bộ dữ liệu với ${providerName}.`,
            });
          },
        },
      ],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: c.canvasBase, paddingTop: Math.max(8, insets.top) }]}>
      <StatusBar
        barStyle={theme.scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={c.canvasBase}
      />

      {/* ── Header ────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ChevronLeftIcon size={22} color={c.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: c.textPrimary }]}>
          {isConnected ? 'Quản lý đồng bộ' : 'Kết nối dữ liệu sức khỏe'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── Graphic Header Section ────────────────────────── */}
        <View style={[styles.graphicSection, { backgroundColor: c.surfaceMid }]}>
          <Image
            source={images.trackerLogo}
            style={styles.trackerLogoImg}
            resizeMode="contain"
            accessibilityLabel="Logo ứng dụng"
          />

          <Image
            source={images.syncIcon}
            style={[styles.syncIconImg, { tintColor: isConnected ? c.quickScanner : c.textSecondary }]}
            resizeMode="contain"
            accessibilityLabel="Đồng bộ"
          />

          <View style={[styles.healthConnectIconContainer, { backgroundColor: c.surfaceHigh }]}>
            <Image
              source={providerLogo}
              style={styles.healthConnectImg}
              resizeMode="contain"
              accessibilityLabel={providerName}
            />
          </View>
        </View>

        {/* ── Content Section ───────────────────────────────── */}
        <View style={styles.contentSection}>
          {isConnected ? (
            /* Connected State */
            <View>
              {/* Status Badge */}
              <View style={[styles.connectedBadge, { backgroundColor: c.surfaceHigh, borderColor: c.surfaceBorder }]}>
                <View style={[styles.statusDot, { backgroundColor: c.quickScanner }]} />
                <View style={styles.statusInfoCol}>
                  <Text style={[styles.statusTitle, { color: c.textPrimary }]}>
                    Đã kết nối với {providerName}
                  </Text>
                  <Text style={[styles.statusSubtext, { color: c.textSecondary }]}>
                    Lần đồng bộ gần nhất: {formattedLastSync}
                  </Text>
                </View>
              </View>

              {/* Today's Synced Stats Card */}
              <Text style={[styles.sectionHeading, { color: c.textSecondary }]}>DỮ LIỆU ĐỒNG BỘ HÔM NAY</Text>
              <View style={[styles.statsCard, { backgroundColor: c.surfaceHigh, borderColor: c.surfaceBorder }]}>
                {/* Steps */}
                <View style={styles.statRow}>
                  <View style={[styles.statIconBadge, { backgroundColor: c.brandPrimary }]}>
                    <FootprintsIcon size={18} color={c.onBrand} />
                  </View>
                  <View style={styles.statTextCol}>
                    <Text style={[styles.statLabel, { color: c.textSecondary }]}>Bước chân</Text>
                    <Text style={[styles.statValue, { color: c.textPrimary }]}>
                      {formatNumber(Number(todaySteps))} <Text style={styles.statUnit}>bước</Text>
                    </Text>
                  </View>
                </View>

                <View style={[styles.statDivider, { backgroundColor: c.surfaceBorder }]} />

                {/* Calories */}
                <View style={styles.statRow}>
                  <View style={[styles.statIconBadge, { backgroundColor: c.statusWarning }]}>
                    <FlameIcon size={18} color="#FFFFFF" />
                  </View>
                  <View style={styles.statTextCol}>
                    <Text style={[styles.statLabel, { color: c.textSecondary }]}>Calo tiêu hao</Text>
                    <Text style={[styles.statValue, { color: c.textPrimary }]}>
                      {formatNumber(Math.round(Number(todayCalories)))} <Text style={styles.statUnit}>kcal</Text>
                    </Text>
                  </View>
                </View>

                <View style={[styles.statDivider, { backgroundColor: c.surfaceBorder }]} />

                {/* Heart Rate */}
                <View style={styles.statRow}>
                  <View style={[styles.statIconBadge, { backgroundColor: c.statusDanger }]}>
                    <HeartIcon size={18} color="#FFFFFF" />
                  </View>
                  <View style={styles.statTextCol}>
                    <Text style={[styles.statLabel, { color: c.textSecondary }]}>Nhịp tim trung bình</Text>
                    <Text style={[styles.statValue, { color: c.textPrimary }]}>
                      {todayHeartRate ? Math.round(Number(todayHeartRate)) : '--'} <Text style={styles.statUnit}>bpm</Text>
                    </Text>
                  </View>
                </View>
              </View>

              {/* Sync Actions */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleManualSync}
                disabled={syncing}
                style={[styles.syncNowBtn, { backgroundColor: c.brandPrimary }]}
                accessibilityRole="button"
                accessibilityLabel="Đồng bộ ngay"
              >
                {syncing ? (
                  <ActivityIndicator size="small" color={c.onBrand} />
                ) : (
                  <View style={styles.syncBtnRow}>
                    <RefreshCwIcon size={18} color={c.onBrand} />
                    <Text style={[styles.syncNowBtnText, { color: c.onBrand }]}>Đồng bộ ngay</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleDisconnect}
                style={[styles.disconnectBtn, { backgroundColor: c.surfaceHigh, borderColor: c.surfaceBorder }]}
                accessibilityRole="button"
                accessibilityLabel="Ngắt kết nối"
              >
                <Text style={[styles.disconnectBtnText, { color: c.statusDanger }]}>
                  Ngắt kết nối {providerName}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Disconnected State */
            <View>
              <Text style={[styles.headlineText, { color: c.textPrimary }]}>
                Kallo muốn giúp bạn theo dõi vận động chính xác hơn!
              </Text>

              {/* Benefit 1 */}
              <View style={styles.benefitRow}>
                <GreenCheckIcon color={c.quickScanner} />
                <Text style={[styles.benefitText, { color: c.textPrimary }]}>
                  Tự động ghi nhận số bước chân từ {providerName}
                </Text>
              </View>

              {/* Benefit 2 */}
              <View style={styles.benefitRow}>
                <GreenCheckIcon color={c.quickScanner} />
                <Text style={[styles.benefitText, { color: c.textPrimary }]}>
                  Tính toán calories đốt cháy chính xác theo cân nặng và chiều cao
                </Text>
              </View>

              {/* Benefit 3 */}
              <View style={styles.benefitRow}>
                <GreenCheckIcon color={c.quickScanner} />
                <Text style={[styles.benefitText, { color: c.textPrimary }]}>
                  Khử trùng lặp thông minh với bài tập bạn ghi thủ công
                </Text>
              </View>

              {/* Privacy Note */}
              <Text style={[styles.privacyNoteText, { color: c.textSecondary }]}>
                Bạn hoàn toàn có thể kiểm soát dữ liệu chia sẻ! Kallo chỉ sử dụng thông tin này để tính toán calo tiêu hao cá nhân và không bao giờ chia sẻ với bên thứ ba.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Footer when not connected ──────────────────────── */}
      {!isConnected && (
        <View style={[styles.footer, { paddingBottom: Math.max(20, insets.bottom + 12) }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            disabled={connecting}
            style={[styles.skipButton, { backgroundColor: c.surfaceHigh }]}
            accessibilityRole="button"
            accessibilityLabel="Thiết lập sau"
          >
            <Text style={[styles.skipButtonText, { color: c.textPrimary }]}>Thiết lập sau</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAllowAccess}
            disabled={connecting}
            style={[styles.allowButton, { backgroundColor: c.brandPrimary }]}
            accessibilityRole="button"
            accessibilityLabel="Cho phép truy cập"
          >
            {connecting ? (
              <ActivityIndicator size="small" color={c.onBrand} />
            ) : (
              <Text style={[styles.allowButtonText, { color: c.onBrand }]}>Cho phép truy cập</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
  },
  headerSpacer: {
    width: 44,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  graphicSection: {
    paddingVertical: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 26,
  },
  trackerLogoImg: {
    width: 72,
    height: 72,
    borderRadius: 20,
  },
  syncIconImg: {
    width: 40,
    height: 40,
  },
  healthConnectIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  healthConnectImg: {
    width: 46,
    height: 46,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  headlineText: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 20,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  greenCheckBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
    fontSize: 15.5,
    fontFamily: 'PlusJakartaSans_500Medium',
    lineHeight: 23,
  },
  privacyNoteText: {
    fontSize: 13.5,
    fontFamily: 'PlusJakartaSans_400Regular',
    lineHeight: 21,
    marginTop: 16,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 14,
  },
  statusInfoCol: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
    marginBottom: 2,
  },
  statusSubtext: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  sectionHeading: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  statsCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  statIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  statTextCol: {
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
  },
  statUnit: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    fontWeight: '500',
  },
  statDivider: {
    height: 1,
    width: '100%',
  },
  syncNowBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  syncBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncNowBtnText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
  },
  disconnectBtn: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disconnectBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  skipButton: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
  },
  allowButton: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allowButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
  },
});
