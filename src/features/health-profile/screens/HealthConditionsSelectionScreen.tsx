import React, { useState } from 'react';
import {
  Image,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { images } from '@/assets/images';
import { AppText } from '@/components/common';
import { ChevronLeftIcon } from '@/components/icons';
import { AnimatedCard, AnimatedCheckbox } from '../components';
import { useHealthProfileDraft } from '../hooks/useHealthProfileDraft';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface HealthConditionsSelectionScreenProps {
  navigation?: any;
  onNext?: () => void;
  onBack?: () => void;
  hideHeader?: boolean;
}

interface ConditionItem {
  key: string;
  title: string;
  subtitle: string;
  dietAdvice: string[];
  renderIcon: (color: string) => React.ReactNode;
}

const CONDITION_ITEMS: ConditionItem[] = [
  {
    key: 'none',
    title: 'Không có bệnh lý nền',
    subtitle: 'Sức khỏe bình thường, không mắc bệnh lý mãn tính.',
    dietAdvice: [
      'Bạn có thể linh hoạt áp dụng đa dạng chế độ ăn uống và rèn luyện thể thao.',
      'Kallo sẽ tập trung tối ưu hóa lượng calo và đa lượng theo mục tiêu vóc dáng của bạn.',
    ],
    renderIcon: (color) => (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M9 12l2 2 4-4"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
  },
  {
    key: 'gerd',
    title: 'Đau dạ dày, Trào ngược (GERD)',
    subtitle: 'Ợ chua, nóng rát thượng vị, đau khi đói hoặc no.',
    dietAdvice: [
      'Hạn chế món có tính axit cao (chanh, giấm chua, ớt cay nồng).',
      'Chia nhỏ 4–5 bữa/ngày, tránh ăn quá no hoặc để bụng quá đói.',
      'Hạn chế cà phê, rượu bia, đồ uống có ga gây kích ứng niêm mạc.',
    ],
    renderIcon: (color) => (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 4v16m-4-8h8"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      </Svg>
    ),
  },
  {
    key: 'diabetes',
    title: 'Đái tháo đường / Tiền tiểu đường',
    subtitle: 'Chỉ số đường huyết (HbA1c) cần được theo dõi chặt chẽ.',
    dietAdvice: [
      'Ưu tiên tinh bột hấp thụ chậm (Low GI: yến mạch, gạo lứt, khoai lang luộc).',
      'Cắt giảm tối đa đường tinh luyện, nước ngọt có ga và bánh kẹo.',
      'Phân bổ lượng carbs đều đặn giữa các bữa ăn trong ngày.',
    ],
    renderIcon: (color) => (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 2.7l7.1 7.1a7.5 7.5 0 11-10.6 0L12 2.7z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
  },
  {
    key: 'hypertension',
    title: 'Huyết áp cao (Tăng huyết áp)',
    subtitle: 'Huyết áp tâm thu ≥ 130 mmHg hoặc tâm trương ≥ 80 mmHg.',
    dietAdvice: [
      'Hạn chế muối natri dưới 2.000 mg/ngày (giảm nước mắm đậm đà, đồ kho, đồ hộp).',
      'Tăng cường kali từ chuối, khoai lang, rau bina để điều hòa huyết áp.',
      'Hạn chế mỡ động vật và thức ăn chiên rán nhiều dầu mỡ.',
    ],
    renderIcon: (color) => (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M20.4 4.6a5.5 5.5 0 00-7.8 0L12 5.2l-.6-.6a5.5 5.5 0 00-7.8 7.8l.6.6L12 20.8l7.8-7.8.6-.6a5.5 5.5 0 000-7.8z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
  },
  {
    key: 'hyperlipidemia',
    title: 'Mỡ máu cao (Rối loạn lipid máu)',
    subtitle: 'Cholesterol toàn phần hoặc Triglyceride trong máu tăng cao.',
    dietAdvice: [
      'Hạn chế nội tạng động vật, mỡ lợn, da gia cầm và lòng đỏ trứng.',
      'Tăng cường chất béo tốt Omega-3 từ cá béo, dầu ô liu và các loại hạt.',
      'Bổ sung nhiều chất xơ hòa tan từ rau củ để giảm hấp thụ cholesterol.',
    ],
    renderIcon: (color) => (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
        <Path
          d="M12 7v5l3 3"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    ),
  },
  {
    key: 'gout',
    title: 'Bệnh Gút (Gout) / Axit Uric cao',
    subtitle: 'Lắng đọng tinh thể urat ở các khớp ngón chân, cổ chân.',
    dietAdvice: [
      'Tránh thực phẩm giàu purin: thịt đỏ (bò, dê), hải sản vỏ cứng, nước hầm xương.',
      'Kiêng tuyệt đối rượu bia (đặc biệt là bia) và nước ngọt giàu fructose.',
      'Uống đủ 2.5 – 3 lít nước lọc/ngày để thận đào thải axit uric hiệu quả.',
    ],
    renderIcon: (color) => (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="4" width="16" height="16" rx="4" stroke={color} strokeWidth="2" />
        <Path d="M9 9h6v6H9z" fill={color} />
      </Svg>
    ),
  },
  {
    key: 'fatty_liver',
    title: 'Gan nhiễm mỡ',
    subtitle: 'Tích tụ mỡ thừa trong tế bào gan, gây mệt mỏi, khó tiêu.',
    dietAdvice: [
      'Cắt giảm tối đa bia rượu và đường siro ngô giàu fructose.',
      'Bổ sung rau xanh họ cải (súp lơ, cải xoăn) chứa hợp chất hỗ trợ giải độc gan.',
      'Duy trì vận động thể chất đều đặn tối thiểu 30 phút mỗi ngày.',
    ],
    renderIcon: (color) => (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 12c0-4.4 3.6-8 8-8 3 0 5.6 1.7 7 4.2 1.8.8 3 2.6 3 4.8 0 2.8-2.2 5-5 5H6c-2.2 0-4-1.8-4-4 0-1.1.5-2.2 1.3-3"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
  },
];

export function HealthConditionsSelectionScreen({
  navigation,
  onNext,
  onBack,
  hideHeader = false,
}: HealthConditionsSelectionScreenProps) {
  const insets = useSafeAreaInsets();
  const { draft, toggleHealthCondition } = useHealthProfileDraft();

  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    draft.healthConditions && draft.healthConditions.length > 0
      ? draft.healthConditions
      : ['none']
  );

  const handleToggle = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleHealthCondition(key);

    setSelectedConditions((prev) => {
      if (key === 'none') {
        return prev.includes('none') ? [] : ['none'];
      }
      const withoutNone = prev.filter((k) => k !== 'none');
      if (withoutNone.includes(key)) {
        return withoutNone.filter((k) => k !== key);
      }
      return [...withoutNone, key];
    });
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (navigation?.navigate) {
      navigation.navigate('ProfileSummary');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.() && navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const content = (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Avatar & Speech Bubble Row ─────────────────────────── */}
      <View style={styles.bubbleRow}>
        <View style={styles.avatarWrap}>
          <Image
            source={images.mascotAvatar}
            style={styles.avatarImage}
            resizeMode="cover"
            accessibilityLabel="Mascot Kallo"
          />
        </View>
        <View style={styles.bubble}>
          <View style={styles.bubbleTail} />
          <AppText style={styles.bubbleText}>
            Tiền sử bệnh lý của bạn là...
          </AppText>
        </View>
      </View>

      <AppText style={styles.hintNotice}>
        Kallo sẽ tự động tinh chỉnh khẩu phần dinh dưỡng và cảnh báo món ăn không an toàn cho bạn.
      </AppText>

      {/* ── Condition Cards with Interactive Animation ──────────── */}
      <View style={styles.cardsContainer}>
        {CONDITION_ITEMS.map((item) => {
          const isSelected = selectedConditions.includes(item.key);
          const iconColor = isSelected ? '#C084FC' : '#8E87AA';

          return (
            <AnimatedCard
              key={item.key}
              selected={isSelected}
              onPress={() => handleToggle(item.key)}
              style={styles.conditionCard}
              selectedBorderColor="#9D6CFA"
              selectedBgColor="#231742"
              unselectedBorderColor="#2E2352"
              unselectedBgColor="#1A1433"
              activeScale={0.97}
              accessibilityLabel={item.title}
              accessibilityRole="checkbox"
            >
              {/* Header row: Icon + Title + Animated Checkbox */}
              <View style={styles.cardHeaderRow}>
                <View
                  style={[
                    styles.iconWrap,
                    isSelected ? styles.iconWrapSelected : styles.iconWrapUnselected,
                  ]}
                >
                  {item.renderIcon(iconColor)}
                </View>
                <View style={styles.titleWrap}>
                  <AppText style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                    {item.title}
                  </AppText>
                  <AppText style={styles.cardSubtitle}>{item.subtitle}</AppText>
                </View>
                <View style={styles.checkWrap}>
                  <AnimatedCheckbox selected={isSelected} activeColor="#9D6CFA" size={24} />
                </View>
              </View>

              {/* Smooth Animated Nutrition Advice */}
              {isSelected && (
                <View style={styles.adviceContainer}>
                  <AppText style={styles.adviceHeading}>
                    💡 Lưu ý dinh dưỡng từ Kallo:
                  </AppText>
                  {item.dietAdvice.map((advice, idx) => (
                    <View key={idx} style={styles.adviceRow}>
                      <AppText style={styles.bulletDot}>•</AppText>
                      <AppText style={styles.adviceText}>{advice}</AppText>
                    </View>
                  ))}
                </View>
              )}
            </AnimatedCard>
          );
        })}
      </View>

      {/* ── Footnote Hint ──────────────────────────────────────── */}
      <AppText style={styles.footnote}>
        *** Bạn có thể chọn nhiều bệnh lý cùng lúc nếu có. Dữ liệu này được mã hóa bảo mật để chăm sóc sức khỏe của bạn.
      </AppText>

      {/* ── Bottom Action Button ───────────────────────────────── */}
      <View style={[styles.bottomArea, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleNext}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Tiếp tục"
        >
          <AppText style={styles.buttonText}>Tiếp tục</AppText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  if (hideHeader) {
    return <View style={styles.innerContainer}>{content}</View>;
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Top Bar ────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ChevronLeftIcon size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── Progress Bar: 97% ────────────────────────────────── */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: '97%' }]} />
      </View>

      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120E29',
  },
  innerContainer: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#261F45',
    marginHorizontal: 20,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9D6CFA',
    borderRadius: 3,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#302657',
    borderWidth: 2,
    borderColor: '#9D6CFA',
    overflow: 'hidden',
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  bubble: {
    flex: 1,
    backgroundColor: '#241B42',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#382D61',
  },
  bubbleTail: {
    position: 'absolute',
    left: -8,
    top: 18,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#241B42',
  },
  bubbleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  hintNotice: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 14,
  },
  conditionCard: {
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconWrapSelected: {
    backgroundColor: 'rgba(167, 139, 250, 0.22)',
  },
  iconWrapUnselected: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  titleWrap: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  cardTitleSelected: {
    color: '#E9D5FF',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#A098BD',
    lineHeight: 17,
  },
  checkWrap: {
    marginLeft: 4,
  },
  adviceContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(167, 139, 250, 0.25)',
  },
  adviceHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FDE047',
    marginBottom: 8,
  },
  adviceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bulletDot: {
    fontSize: 14,
    color: '#C084FC',
    marginRight: 8,
    lineHeight: 18,
  },
  adviceText: {
    flex: 1,
    fontSize: 12.5,
    color: '#E2E8F0',
    lineHeight: 18,
  },
  footnote: {
    fontSize: 12,
    color: '#8E87AA',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    lineHeight: 17,
    fontStyle: 'italic',
  },
  bottomArea: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  actionButton: {
    backgroundColor: '#9D6CFA',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9D6CFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
