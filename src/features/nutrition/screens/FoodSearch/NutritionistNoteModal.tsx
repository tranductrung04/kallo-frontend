import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { useTheme } from '@/theme';

export type NutritionistNoteModalProps = {
  visible: boolean;
  onClose: () => void;
};

const EDIBLE_PORTION_RULES = [
  'Thịt, cá (sống/chín): chỉ tính phần thịt, bỏ xương.',
  'Hải sản: chỉ tính phần thịt, bỏ vỏ, càng, hoặc đầu.',
  'Ngũ cốc / bắp: bỏ lõi, râu, lá, vỏ cứng',
  'Các loại hạt: bỏ vỏ cứng, vỏ lụa',
  'Củ quả: bỏ vỏ, lõi cứng, hạt cứng',
];

const ACCURACY_TIPS = [
  'Điều chỉnh khẩu phần linh hoạt theo ml, gram, phần tư, nửa phần, cái, quả,...',
  'Tạo công thức riêng và tính calo tự động theo cách nấu của gia đình và vùng miền',
  'Thêm/xóa/điều chỉnh định lượng nguyên liệu thực tế bạn ăn (không hành, ít muối,...)',
];

/**
 * Illustration of a kitchen scale weighing only edible food,
 * with bones and peel discarded underneath.
 */
function PortionScaleIllustration({ size = 135 }: { size?: number }) {
  const width = size;
  const height = size * (116 / 150);

  return (
    <Svg width={width} height={height} viewBox="0 0 150 116" fill="none">
      {/* ── 1. Foods on scale platform ── */}
      {/* Green vegetable (leafy green / broccoli) */}
      <Circle cx="76" cy="24" r="12" fill="#4ADE80" />
      <Circle cx="66" cy="29" r="9" fill="#22C55E" />
      <Circle cx="84" cy="28" r="9" fill="#16A34A" />

      {/* Yellow fruit (citrus / banana) */}
      <Path
        d="M84 40 C88 24 98 22 108 30 C110 34 105 38 98 40 Z"
        fill="#FACC15"
      />

      {/* Salmon steak with fat marbling */}
      <Path
        d="M44 40 C39 28 50 16 63 20 C68 22 71 30 71 40 C67 36 63 36 59 40 C55 36 49 36 44 40 Z"
        fill="#FB7185"
      />
      <Path
        d="M47 32 C52 26 59 26 65 32"
        stroke="#FFF1F2"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M51 26 C56 21 61 21 64 26"
        stroke="#FFF1F2"
        strokeWidth={1.8}
        strokeLinecap="round"
      />

      {/* Orange slice (half cut with segments) */}
      <Circle cx="74" cy="33" r="11" fill="#FB923C" />
      <Circle cx="74" cy="33" r="9" fill="#FFF7ED" />
      <Circle cx="74" cy="33" r="7.8" fill="#EA580C" />
      <Line x1="74" y1="25.5" x2="74" y2="40.5" stroke="#FFF7ED" strokeWidth={1} />
      <Line x1="66.5" y1="33" x2="81.5" y2="33" stroke="#FFF7ED" strokeWidth={1} />
      <Line x1="69" y1="28" x2="79" y2="38" stroke="#FFF7ED" strokeWidth={1} />
      <Line x1="69" y1="38" x2="79" y2="28" stroke="#FFF7ED" strokeWidth={1} />
      <Circle cx="74" cy="33" r="1.5" fill="#FFF7ED" />

      {/* ── 2. Kitchen Scale ── */}
      {/* Weighing platform plate */}
      <Rect x="38" y="40" width="74" height="6" rx="3" fill="#A78BFA" />

      {/* Scale body */}
      <Path
        d="M48 46 C47 46 45 47 46 49 L52 79 C53 81 55 82 57 82 L93 82 C95 82 97 81 98 79 L104 49 C105 47 103 46 102 46 Z"
        fill="#8B5CF6"
      />

      {/* Base foot */}
      <Rect x="44" y="82" width="62" height="4" rx="2" fill="#7C3AED" />

      {/* Dial with needle */}
      <Circle cx="75" cy="64" r="12" fill="#FFFFFF" />
      <Line
        x1="75"
        y1="64"
        x2="68"
        y2="57"
        stroke="#7C3AED"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Circle cx="75" cy="64" r="2.2" fill="#6D28D9" />

      {/* ── 3. Inedible items discarded below scale ── */}
      {/* Fish skeleton (left) */}
      <Line
        x1="36"
        y1="96"
        x2="59"
        y2="96"
        stroke="#CBD5E1"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path d="M36 96 L30 90 L30 102 Z" fill="#CBD5E1" />
      <Path d="M59 96 L67 91 L64 96 L67 101 Z" fill="#CBD5E1" />
      <Line
        x1="43"
        y1="90"
        x2="47"
        y2="102"
        stroke="#CBD5E1"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Line
        x1="49"
        y1="90"
        x2="53"
        y2="102"
        stroke="#CBD5E1"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Line
        x1="55"
        y1="90"
        x2="58"
        y2="101"
        stroke="#CBD5E1"
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Banana peel (right) */}
      <Line
        x1="98"
        y1="90"
        x2="99"
        y2="87"
        stroke="#94A3B8"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M98 90 C92 94 83 99 87 103 C92 103 96 98 98 93 Z"
        fill="#CBD5E1"
      />
      <Path
        d="M98 90 C98 97 100 105 104 107 C106 105 104 97 99 92 Z"
        fill="#E2E8F0"
      />
      <Path
        d="M98 90 C103 94 111 98 116 100 C118 98 113 93 100 90 Z"
        fill="#94A3B8"
      />
    </Svg>
  );
}

export function NutritionistNoteModal({
  visible,
  onClose,
}: NutritionistNoteModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { colors: c } = theme;

  const isDark = theme.scheme === 'dark';
  const sheetBg = isDark ? '#1D192B' : c.surfaceMid;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={[
            styles.sheetContainer,
            {
              backgroundColor: sheetBg,
              borderColor: isDark ? '#2D2840' : c.surfaceBorder,
              paddingBottom: Math.max(insets.bottom, 16) + 8,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header Title */}
          <Text style={[styles.title, { color: c.textPrimary }]}>
            Lưu ý từ chuyên gia dinh dưỡng Kallo
          </Text>

          {/* Body Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Center Illustration */}
            <View style={styles.illustrationWrapper}>
              <PortionScaleIllustration size={135} />
            </View>

            {/* Section 1: Quy tắc phần ăn được */}
            <View style={styles.listSection}>
              {EDIBLE_PORTION_RULES.map((rule, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={[styles.bulletDot, { color: c.textPrimary }]}>
                    •
                  </Text>
                  <Text style={[styles.bulletText, { color: c.textPrimary }]}>
                    {rule}
                  </Text>
                </View>
              ))}
            </View>

            {/* Section 2: Heading */}
            <Text style={[styles.subHeading, { color: c.textPrimary }]}>
              Để calo sát với khẩu phần thực tế của bạn
            </Text>

            {/* Section 2: Lời khuyên định lượng */}
            <View style={styles.listSection}>
              {ACCURACY_TIPS.map((tip, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={[styles.bulletDot, { color: c.textPrimary }]}>
                    •
                  </Text>
                  <Text style={[styles.bulletText, { color: c.textPrimary }]}>
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Bottom "Đã hiểu" Button */}
          <TouchableOpacity
            style={[styles.understandBtn, { backgroundColor: c.brandPrimary }]}
            activeOpacity={0.85}
            onPress={onClose}
            accessibilityLabel="Đã hiểu"
          >
            <Text style={styles.understandBtnText}>Đã hiểu</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 7, 15, 0.72)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: 22,
    maxHeight: '88%',
  },
  title: {
    fontSize: 19.5,
    fontWeight: '700',
    letterSpacing: -0.2,
    paddingHorizontal: 22,
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 12,
  },
  illustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  listSection: {
    marginTop: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletDot: {
    fontSize: 16,
    lineHeight: 23,
    marginRight: 8,
    width: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.1,
    marginTop: 22,
    marginBottom: 14,
  },
  understandBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 22,
    marginTop: 14,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  understandBtnText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

