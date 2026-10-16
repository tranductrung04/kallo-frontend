import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  View,
} from 'react-native';
import { images } from '@/assets/images';
import { AppButton, AppText } from '@/components/common';
import { useTheme } from '@/theme';

export type MaintenanceModalProps = {
  visible: boolean;
  onRetry: () => void;
};

export function MaintenanceModal({ visible, onRetry }: MaintenanceModalProps) {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Image
            source={images.maintenanceArtwork}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel="Hệ thống bảo trì"
          />

          <AppText variant="headlineMd" align="center">
            Hệ thống đang bảo trì
          </AppText>

          <AppText variant="bodyMd" color={theme.colors.textSecondary} align="center">
            Kallo đang nâng cấp máy chủ và cải thiện độ ổn định. Vui lòng thử lại sau ít phút hoặc sử dụng chế độ ngoại tuyến.
          </AppText>

          <View style={styles.etaBox}>
            <AppText variant="caption" color={theme.colors.brandPrimary} align="center">
              Dự kiến hoàn thành: 30 phút nữa
            </AppText>
          </View>

          <AppButton
            label="Thử kết nối lại"
            variant="primary"
            onPress={onRetry}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 14,
  },
  image: {
    width: 180,
    height: 140,
  },
  etaBox: {
    backgroundColor: 'rgba(108, 86, 245, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
