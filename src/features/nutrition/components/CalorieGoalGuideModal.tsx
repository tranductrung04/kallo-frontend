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

export type CalorieGoalGuideModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function CalorieGoalGuideModal({ visible, onClose }: CalorieGoalGuideModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme.scheme === 'dark';

  // Cho phép kéo xuống ở khu vực thanh tiêu đề trên để đóng modal
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

  // Bảng màu tối ưu hóa hiển thị chuẩn theo hình thiết kế
  const cardBg = isDark ? '#1E1A2E' : '#FFFFFF';
  const titleColor = isDark ? '#FFFFFF' : '#13121B';
  const bodyColor = isDark ? '#DDD9E8' : '#3F3B4D';
  const boldColor = isDark ? '#FFFFFF' : '#13121B';
  const closeIconColor = isDark ? '#FFFFFF' : '#13121B';

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
          accessibilityLabel="Đóng hướng dẫn calo mục tiêu"
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

          {/* Nội dung chi tiết hướng dẫn Calo Mục Tiêu */}
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
              Calo Mục Tiêu - Hướng dẫn năng lượng cho cơ thể mỗi ngày
            </Text>

            {/* Đoạn 1: Định nghĩa Calo Mục Tiêu */}
            <Text style={[styles.paragraph, { color: bodyColor }]}>
              {'Calo Mục Tiêu là lượng '}
              <Text style={[styles.boldText, { color: boldColor }]}>
                calo bạn nên nạp mỗi ngày để đạt được mục tiêu
              </Text>
              {' cá nhân - giảm cân, duy trì hay tăng cân. Kallo tính toán dựa trên chiều cao, cân nặng, tuổi, giới tính, mức vận động và mục tiêu bạn chọn.'}
            </Text>

            {/* Đoạn 2: Tác dụng */}
            <Text style={[styles.paragraph, { color: bodyColor }]}>
              Mức calo này giúp bạn ăn đủ - không thừa, không thiếu - để cơ thể khoẻ mạnh và tiến đúng hướng.
            </Text>

            {/* Phần Lưu ý */}
            <Text style={[styles.sectionHeading, { color: titleColor }]}>
              Lưu ý
            </Text>

            {/* Gạch đầu dòng 1 */}
            <Text style={[styles.bulletItem, { color: bodyColor }]}>
              • Calo từ vận động hàng ngày đã được tính sẵn, không cần cộng thêm sau mỗi lần tập luyện.
            </Text>

            {/* Gạch đầu dòng 2 */}
            <Text style={[styles.bulletItem, { color: bodyColor }]}>
              {'• Con số này được tính từ TDEE - tổng năng lượng cần thiết trong một ngày. '}
              <Text style={[styles.boldText, { color: boldColor }]}>
                Giảm khoảng 500 calo so với TDEE
              </Text>
              {' là cách giảm cân an toàn phổ biến.'}
            </Text>

            {/* Thông điệp đồng hành của Kallo */}
            <Text style={[styles.calloutItem, { color: bodyColor }]}>
              👉 Kallo sẽ đồng hành cùng bạn mỗi ngày để giữ calo ở mức phù hợp với mục tiêu.
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
  sectionHeading: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    marginTop: 6,
    marginBottom: 16,
  },
  bulletItem: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15.5,
    lineHeight: 24,
    marginBottom: 18,
  },
  calloutItem: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15.5,
    lineHeight: 24,
    marginTop: 2,
    marginBottom: 24,
  },
  boldText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
  },
});
