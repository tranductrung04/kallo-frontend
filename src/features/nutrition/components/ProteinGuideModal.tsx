import React, { useRef } from 'react';
import {
  Alert,
  Image,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookIcon, CloseXIcon } from '@/components/icons';
import { images } from '@/assets/images';
import { useTheme } from '@/theme';

export type ProteinGuideModalProps = {
  visible: boolean;
  onClose: () => void;
  onOpenArticle?: () => void;
};

export function ProteinGuideModal({ visible, onClose, onOpenArticle }: ProteinGuideModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme.scheme === 'dark';

  // Cho phép vuốt kéo xuống ở thanh tiêu đề trên để đóng modal
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
  const closeIconColor = theme.colors.textPrimary;
  const dividerColor = theme.colors.surfaceBorder;

  const handleArticlePress = () => {
    if (onOpenArticle) {
      onOpenArticle();
    } else {
      Alert.alert(
        'Cẩm nang protein',
        'Ăn đúng đủ và hiệu quả mỗi ngày: Tìm hiểu các nguồn đạm dồi dào dinh dưỡng, thời điểm nạp đạm tốt nhất và cách kết hợp tối ưu cho cơ thể.',
        [{ text: 'Đóng', style: 'cancel' }]
      );
    }
  };

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
          accessibilityLabel="Đóng hướng dẫn chất đạm"
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

          {/* Nội dung chi tiết hướng dẫn Chất đạm (Protein) */}
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
              Chất đạm (Protein) - Dưỡng chất quan trọng cho sức khoẻ mỗi ngày
            </Text>

            {/* Đoạn 1: Công dụng của chất đạm */}
            <Text style={[styles.paragraph, { color: bodyColor }]}>
              Chất đạm giúp xây cơ, tái tạo mô, tăng miễn dịch và tạo cảm giác no lâu hơn - đặc biệt hữu ích khi bạn muốn giảm cân hoặc tăng cơ.
            </Text>

            {/* Đoạn 2: Nguồn đạm tốt */}
            <Text style={[styles.paragraph, { color: bodyColor }]}>
              Nguồn đạm tốt bao gồm: trứng, cá, thịt nạc, sữa chua Hy Lạp, đậu phụ, đậu đen, yến mạch...
            </Text>

            {/* Câu hỏi: Nên ăn bao nhiêu mỗi ngày? */}
            <Text style={[styles.sectionHeading, { color: titleColor }]}>
              Nên ăn bao nhiêu mỗi ngày?
            </Text>

            {/* Gạch đầu dòng 1 */}
            <Text style={[styles.bulletItem, { color: bodyColor }]}>
              • Người bình thường: 0.8-1g/kg
            </Text>

            {/* Gạch đầu dòng 2 */}
            <Text style={[styles.bulletItem, { color: bodyColor }]}>
              • Người giảm cân, tập luyện: 1.2-2g/kg
            </Text>

            {/* Đường phân cách trên thẻ bài viết */}
            <View style={[styles.divider, { backgroundColor: dividerColor }]} />

            {/* Thẻ bài viết kiến thức Protein */}
            <TouchableOpacity
              onPress={handleArticlePress}
              activeOpacity={0.75}
              style={styles.articleCard}
              accessibilityRole="button"
              accessibilityLabel="Cẩm nang protein: Ăn đúng đủ và hiệu quả mỗi ngày"
            >
              {/* Ảnh thu nhỏ món ăn giàu đạm */}
              <View style={styles.thumbWrapper}>
                <Image
                  source={images.proteinGuideThumb}
                  style={styles.articleThumb}
                  resizeMode="cover"
                />
              </View>

              {/* Thông tin bài viết */}
              <View style={styles.articleInfo}>
                <View style={styles.categoryRow}>
                  <BookIcon size={14} color={theme.colors.textSecondary} />
                  <Text style={[styles.categoryText, { color: theme.colors.textSecondary }]}>kiến thức</Text>
                </View>
                <Text style={[styles.articleTitle, { color: titleColor }]} numberOfLines={2}>
                  Cẩm nang protein: Ăn đúng đủ và hiệu quả mỗi ngày
                </Text>
              </View>
            </TouchableOpacity>

            {/* Đường phân cách dưới thẻ bài viết */}
            <View style={[styles.divider, { backgroundColor: dividerColor }]} />
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
    marginBottom: 18,
  },
  bulletItem: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15.5,
    lineHeight: 24,
    marginBottom: 14,
  },
  divider: {
    height: 1,
    marginTop: 18,
    marginBottom: 18,
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 4,
  },
  thumbWrapper: {
    width: 66,
    height: 66,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#7C3AED',
    overflow: 'hidden',
  },
  articleThumb: {
    width: '100%',
    height: '100%',
  },
  articleInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  categoryText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 13,
    color: '#A59EBD',
  },
  articleTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15.5,
    fontWeight: '700',
    lineHeight: 22,
  },
});
