import React from 'react';
import { StyleSheet, View } from 'react-native';
import { images } from '@/assets/images';
import { IntroStep } from './IntroStep';

export function NotificationPermissionStep() {
  return (
    <View style={styles.section}>
      <IntroStep
        image={images.notificationBackground}
        title="Bật nhắc nhở hữu ích"
        text="Cho phép thông báo và dữ liệu sức khỏe để Kallo hỗ trợ tốt hơn. Bạn có thể bật sau trong Cài đặt."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 14,
  },
});
