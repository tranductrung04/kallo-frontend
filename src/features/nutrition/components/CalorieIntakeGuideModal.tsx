import React, { useRef } from 'react';
import {
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseXIcon } from '@/components/icons';
import { useTheme } from '@/theme';

export type CalorieIntakeGuideModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function CalorieIntakeGuideModal({ visible, onClose }: CalorieIntakeGuideModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme.scheme === 'dark';

  // Cho phép kéo vuốt xuống ở thanh tiêu đề trên để đóng modal
  const headerPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        gestureState.dy > 10 && Math.abs(gestureState.dx) < 15,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 45) {
          onClose();
        }
      },
    })
  ).current;

  const cardBg = theme.colors.surfaceMid;
  const titleColor = theme.colors.textPrimary;
  const bodyColor = theme.colors.textSecondary;
  const boldColor = theme.colors.textPrimary;
  const closeIconColor = theme.colors.textPrimary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        {/* Vùng mờ phía trên: click ra ngoài để đóng */}
        <Pressable
          style={[styles.topBackdrop, { height: Math.max(54, insets.top + 16) }]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Đóng hướng dẫn calo nạp vào"
        />

        {/* Khung nội dung sheet trượt từ dưới lên */}
        <View style={[styles.sheetContainer, { backgroundColor: cardBg }]}>
          {/* Header bar chứa nút đóng và vùng kéo xuống */}
          <View
            {...headerPanResponder.panHandlers}
            style={styles.topBar}
          >
            <View style={styles.topDragIndicator} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Đóng"
              hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.pressedOpacity]}
            >
              <CloseXIcon size={22} color={closeIconColor} strokeWidth={2.4} />
            </Pressable>
          </View>

          {/* Nội dung chi tiết hướng dẫn Calo Nạp Vào */}
          <ScrollView
            style={styles.scrollList}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(34, insets.bottom + 24) },
            ]}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Tiêu đề chính */}
            <Text style={[styles.title, { color: titleColor }]}>
              Calo Nạp Vào - Lượng năng lượng bạn đã hấp thụ trong ngày
            </Text>

            {/* Đoạn 1: Định nghĩa Calo Nạp Vào */}
            <Text style={[styles.paragraph, { color: bodyColor }]}>
              Đây là tổng lượng calo bạn đã tiêu thụ từ thức ăn và đồ uống trong ngày. Mỗi khi bạn ghi lại một món ăn, chỉ số này sẽ được cập nhật tự động.
            </Text>

            {/* Đoạn 2: Giới thiệu căn cứ ước tính */}
            <Text style={[styles.paragraphLead, { color: bodyColor }]}>
              Kallo ước tính nhu cầu calo dựa trên:
            </Text>

            {/* Gạch đầu dòng BMR */}
            <Text style={[styles.bulletItem, { color: bodyColor }]}>
              {'• '}
              <Text style={[styles.boldText, { color: boldColor }]}>BMR</Text>
              {' - năng lượng cơ bản cơ thể cần để duy trì sự sống.'}
            </Text>

            {/* Gạch đầu dòng PAL */}
            <Text style={[styles.bulletItem, { color: bodyColor }]}>
              {'• '}
              <Text style={[styles.boldText, { color: boldColor }]}>PAL</Text>
              {' - mức độ vận động hàng ngày của bạn.'}
            </Text>

            {/* Đoạn 3: Mục tiêu giảm cân và thâm hụt calo */}
            <Text style={[styles.paragraph, { color: bodyColor, marginTop: 8 }]}>
              Nếu bạn chọn mục tiêu giảm cân, Kallo sẽ tự động điều chỉnh mức calo mục tiêu bằng cách giảm 300-500 kcal để tạo thâm hụt năng lượng hợp lý.
            </Text>

            {/* Lời kêu gọi hành động / Đồng hành */}
            <Text style={[styles.calloutItem, { color: bodyColor }]}>
              👉 Ghi lại món ăn mỗi ngày để theo dõi chính xác lượng calo nạp vào cùng Kallo
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'flex-end',
  },
  topBackdrop: {
    width: '100%',
  },
  sheetContainer: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 20,
  },
  topBar: {
    paddingTop: 14,
    paddingBottom: 6,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  topDragIndicator: {
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  pressedOpacity: {
    opacity: 0.65,
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: -0.2,
    marginBottom: 20,
  },
  paragraph: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15.5,
    lineHeight: 24,
    marginBottom: 18,
  },
  paragraphLead: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15.5,
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletItem: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15.5,
    lineHeight: 24,
    marginBottom: 14,
  },
  calloutItem: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15.5,
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 24,
  },
  boldText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
  },
});
