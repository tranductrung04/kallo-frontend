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

export type WorkoutGuideModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function WorkoutGuideModal({ visible, onClose }: WorkoutGuideModalProps) {
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

  // Bảng màu tối ưu hóa hiển thị chuẩn theo hình thiết kế
  const cardBg = isDark ? '#1E1A2E' : '#FFFFFF';
  const titleColor = isDark ? '#FFFFFF' : '#13121B';
  const bodyColor = isDark ? '#DDD9E8' : '#3F3B4D';
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
          accessibilityLabel="Đóng hướng dẫn tập luyện"
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

          {/* Nội dung chi tiết hướng dẫn Tập Luyện */}
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
              Tập Luyện - Theo dõi calo bạn đốt qua vận động thể thao
            </Text>

            {/* Đoạn 1: Khái niệm tập luyện */}
            <Text style={[styles.paragraph, { color: bodyColor }]}>
              Tập luyện là lượng calo bạn đốt thông qua hoạt động thể chất như đi bộ, chạy bộ, tập gym...
            </Text>

            {/* Đoạn 2: Cách ghi nhận */}
            <Text style={[styles.paragraph, { color: bodyColor }]}>
              Bạn có thể ghi nhận thủ công hoặc đồng bộ từ thiết bị đeo.
            </Text>

            {/* Câu hỏi 1: Vòng tròn calo */}
            <Text style={[styles.sectionHeading, { color: titleColor }]}>
              Tập luyện có làm thay đổi vòng tròn calo không?
            </Text>

            <Text style={[styles.paragraph, { color: bodyColor }]}>
              Không. Vòng tròn calo chỉ phản ánh lượng calo nạp vào so với mục tiêu ăn uống.
            </Text>

            <Text style={[styles.paragraph, { color: bodyColor }]}>
              Calo tiêu hao từ tập luyện được hiển thị riêng để bạn theo dõi, nhưng không cộng thêm vào mục tiêu.
            </Text>

            {/* Câu hỏi 2: Nhu cầu ăn thêm khi tập */}
            <Text style={[styles.sectionHeading, { color: titleColor }]}>
              Tôi có cần ăn thêm nếu tập nhiều?
            </Text>

            {/* Gạch đầu dòng 1 */}
            <Text style={[styles.bulletItem, { color: bodyColor }]}>
              • Nếu mức tập luyện đúng với mức vận động bạn đã chọn ban đầu → không cần ăn thêm, app đã tính sẵn.
            </Text>

            {/* Gạch đầu dòng 2 */}
            <Text style={[styles.bulletItem, { color: bodyColor }]}>
              • Nếu tập nhiều hơn thường lệ → có thể ăn thêm để duy trì hiệu suất.
            </Text>

            {/* Gạch đầu dòng 3 */}
            <Text style={[styles.bulletItem, { color: bodyColor }]}>
              • Nếu tập ít hơn → nên điều chỉnh khẩu phần để giữ cân bằng calo.
            </Text>

            {/* Lời khuyên đồng hành của Kallo */}
            <Text style={[styles.calloutItem, { color: bodyColor }]}>
              👉 Kallo giúp bạn theo dõi cả calo nạp và tiêu hao - để chủ động điều chỉnh phù hợp với nhịp sống thực tế.
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
  sectionHeading: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    marginTop: 10,
    marginBottom: 16,
  },
  paragraph: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15.5,
    lineHeight: 24,
    marginBottom: 16,
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
    marginTop: 10,
    marginBottom: 24,
  },
});
