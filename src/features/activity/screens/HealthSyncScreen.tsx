import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import type { RootStackParamList } from '@/navigation/types';
import { ChevronLeftIcon } from '@/components/icons';
import { images } from '@/assets/images';
import { useActivity } from '../ActivityProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'HealthSync'>;


// Green checkmark icon
function GreenCheckIcon() {
  return (
    <View style={styles.greenCheckBadge}>
      <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M20 6L9 17l-5-5" />
      </Svg>
    </View>
  );
}

export function HealthSyncScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { requestHealthPermission, syncHealthData } = useActivity();
  const [connecting, setConnecting] = useState(false);

  const isAndroid = Platform.OS === 'android';
  const activeSource = isAndroid ? 'HEALTH_CONNECT' : 'APPLE_HEALTH';

  const handleAllowAccess = async () => {
    try {
      setConnecting(true);
      await requestHealthPermission(activeSource);
      await syncHealthData(activeSource);
      navigation.goBack();
    } catch {
      navigation.goBack();
    } finally {
      setConnecting(false);
    }
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(8, insets.top) }]}>
      <StatusBar barStyle="light-content" backgroundColor="#120E22" />

      {/* ── Header ────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ChevronLeftIcon size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── Graphic Header Section ────────────────────────── */}
      <View style={styles.graphicSection}>
        {/* App Logo */}
        <Image
          source={images.trackerLogo}
          style={styles.trackerLogoImg}
          resizeMode="contain"
          accessibilityLabel="Logo ứng dụng"
        />

        {/* Sync Cycle Icon */}
        <Image
          source={images.syncIcon}
          style={styles.syncIconImg}
          resizeMode="contain"
          accessibilityLabel="Đồng bộ"
        />

        {/* Google Health Connect App Icon */}
        <View style={styles.healthConnectIconContainer}>
          <Image
            source={images.healthConnectIcon}
            style={styles.healthConnectImg}
            resizeMode="contain"
            accessibilityLabel="Google Health Connect"
          />
        </View>
      </View>

      {/* ── Main Content Section ───────────────────────────── */}
      <View style={styles.contentSection}>
        <Text style={styles.headlineText}>
          Wao muốn giúp bạn theo dõi vận động chính xác hơn! 🚀
        </Text>

        {/* Benefit 1 */}
        <View style={styles.benefitRow}>
          <GreenCheckIcon />
          <Text style={styles.benefitText}>Tính toán calories đốt cháy</Text>
        </View>

        {/* Benefit 2 */}
        <View style={styles.benefitRow}>
          <GreenCheckIcon />
          <Text style={styles.benefitText}>
            Đồng bộ bước chân & quãng đường & cân nặng
          </Text>
        </View>

        {/* Privacy Note */}
        <Text style={styles.privacyNoteText}>
          Bạn hoàn toàn có thể kiểm soát dữ liệu chia sẻ! Wao chỉ sử dụng thông tin này cho chính bạn, không chia sẻ với bên thứ ba.
        </Text>
      </View>

      {/* ── Bottom Action Buttons ──────────────────────────── */}
      <View style={[styles.footer, { paddingBottom: Math.max(20, insets.bottom + 12) }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSkip}
          disabled={connecting}
          style={styles.skipButton}
          accessibilityRole="button"
          accessibilityLabel="Thiết lập sau"
        >
          <Text style={styles.skipButtonText}>Thiết lập sau</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleAllowAccess}
          disabled={connecting}
          style={styles.allowButton}
          accessibilityRole="button"
          accessibilityLabel="Cho phép truy cập"
        >
          {connecting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.allowButtonText}>Cho phép truy cập</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120E22',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  graphicSection: {
    backgroundColor: '#1E1834',
    paddingVertical: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 26,
  },
  trackerLogoImg: {
    width: 76,
    height: 76,
    borderRadius: 22,
  },
  syncIconImg: {
    width: 44,
    height: 44,
  },
  healthConnectIconContainer: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  healthConnectImg: {
    width: 48,
    height: 48,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  headlineText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 22,
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
    backgroundColor: '#34A853',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_500Medium',
    lineHeight: 24,
  },
  privacyNoteText: {
    color: '#BDB9CE',
    fontSize: 14.5,
    fontFamily: 'PlusJakartaSans_400Regular',
    lineHeight: 22,
    marginTop: 18,
  },
  footer: {
    paddingHorizontal: 20,
  },
  skipButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#27223C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
  },
  allowButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#9E64F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allowButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
  },
});
