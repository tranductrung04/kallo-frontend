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

export type ForceUpdateModalProps = {
  visible: boolean;
  isMandatory?: boolean;
  latestVersion?: string;
  onUpdate: () => void;
  onDismiss?: () => void;
};

export function ForceUpdateModal({
  visible,
  isMandatory = true,
  latestVersion = '2.0.0',
  onUpdate,
  onDismiss,
}: ForceUpdateModalProps) {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Image
            source={isMandatory ? images.forceUpdateApp : images.informUpdateApp}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel="Cập nhật ứng dụng"
          />

          <AppText variant="headlineMd" align="center">
            {isMandatory ? 'Bắt buộc cập nhật phiên bản mới' : 'Đã có bản cập nhật mới!'}
          </AppText>

          <AppText variant="bodySm" color={theme.colors.textSecondary} align="center">
            Phiên bản {latestVersion} mang đến nhiều cải tiến về độ chính xác nhận diện món ăn AI, đồng bộ ngoại tuyến và sửa lỗi.
          </AppText>

          <View style={styles.btnCol}>
            <AppButton
              label="Cập nhật ngay"
              variant="primary"
              onPress={onUpdate}
            />

            {!isMandatory && onDismiss && (
              <AppButton
                label="Để sau"
                variant="outline"
                onPress={onDismiss}
              />
            )}
          </View>
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
    width: 200,
    height: 140,
  },
  btnCol: {
    width: '100%',
    gap: 10,
    marginTop: 6,
  },
});
