import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseXIcon } from '@/components/icons';
import { images } from '@/assets/images';
import { useTheme } from '@/theme';
import { useActivity } from '../ActivityProvider';

export type StepConnectModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  type?: 'step' | 'workout';
  title?: string;
  description?: string;
};

export function StepConnectModal({
  visible,
  onClose,
  onSuccess,
  type = 'step',
  title,
  description,
}: StepConnectModalProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors: c } = theme;
  const { requestHealthPermission, syncHealthData } = useActivity();
  const [connecting, setConnecting] = useState(false);

  const defaultTitle =
    type === 'workout'
      ? 'Wao cần quyền truy cập dữ liệu tập luyện'
      : 'Wao cần quyền truy cập dữ liệu bước chân';

  const defaultDesc =
    type === 'workout'
      ? 'Wao cần quyền truy cập Health Connect để ghi nhận dữ liệu tập luyện như số bước chân, calo tiêu hao, thời gian vận động...'
      : 'Kết nối với Health Connect để Wao có thể đọc bước chân và hỗ trợ bạn theo dõi mức độ hoạt động mỗi ngày.';

  const finalTitle = title || defaultTitle;
  const finalDesc = description || defaultDesc;

  const activeSource = Platform.OS === 'ios' ? 'APPLE_HEALTH' : 'HEALTH_CONNECT';

  const handleConnect = async () => {
    if (connecting) return;
    try {
      setConnecting(true);
      await requestHealthPermission(activeSource);
      await syncHealthData(activeSource);
      onClose();
      onSuccess?.();
    } catch {
      onClose();
    } finally {
      setConnecting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Đóng modal"
        />

        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: c.surfaceMid,
              paddingBottom: Math.max(28, insets.bottom + 16),
            },
          ]}
        >
          {/* Close button at top right */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
            accessibilityLabel="Đóng"
            accessibilityRole="button"
          >
            <CloseXIcon size={20} color={c.textPrimary} strokeWidth={2.2} />
          </TouchableOpacity>

          {/* Graphic Icon Row: App Logo <---> Sync <---> Health Connect */}
          <View style={styles.graphicRow}>
            <Image
              source={images.trackerLogo}
              style={styles.appLogo}
              resizeMode="contain"
              accessibilityLabel="Wao App"
            />

            <Image
              source={images.syncIcon}
              style={[styles.syncIcon, { tintColor: c.textSecondary }]}
              resizeMode="contain"
              accessibilityLabel="Đồng bộ"
            />

            <View style={[styles.healthConnectContainer, { backgroundColor: c.surfaceMid }]}>
              <Image
                source={images.healthConnectIcon}
                style={styles.healthConnectLogo}
                resizeMode="contain"
                accessibilityLabel="Health Connect"
              />
            </View>
          </View>

          {/* Title */}
          <Text style={[styles.titleText, { color: c.textPrimary }]}>
            {finalTitle}
          </Text>

          {/* Description */}
          <Text style={[styles.descText, { color: c.textSecondary }]}>
            {finalDesc}
          </Text>

          {/* Connect Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.connectBtn,
              {
                backgroundColor: c.brandPrimary,
                shadowColor: c.brandPrimary,
              },
            ]}
            onPress={handleConnect}
            disabled={connecting}
            accessibilityRole="button"
            accessibilityLabel="Kết nối ngay"
          >
            {connecting ? (
              <ActivityIndicator size="small" color={c.onBrand} />
            ) : (
              <Text style={[styles.connectBtnText, { color: c.onBrand }]}>Kết nối ngay</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 20,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  graphicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    marginTop: 6,
    marginBottom: 24,
  },
  appLogo: {
    width: 70,
    height: 70,
    borderRadius: 20,
  },
  syncIcon: {
    width: 34,
    height: 34,
  },
  healthConnectContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  healthConnectLogo: {
    width: 44,
    height: 44,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  descText: {
    fontSize: 14.5,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 28,
  },
  connectBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  connectBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
