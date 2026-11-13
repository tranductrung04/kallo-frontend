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
import Svg, { Circle, Path } from 'react-native-svg';
import { images } from '@/assets/images';
import { AppText } from '@/components/common';
import { ChevronLeftIcon } from '@/components/icons';
import { AnimatedCard, AnimatedRadio } from '../components';
import { useHealthProfileDraft } from '../hooks/useHealthProfileDraft';
import type { ActivityLevel } from '../types';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ActivityLevelSelectionScreenProps {
  navigation?: any;
  onNext?: (activity: ActivityLevel) => void;
  onBack?: () => void;
  hideHeader?: boolean;
}

interface ActivityOption {
  key: ActivityLevel;
  title: string;
  bullets: string[];
  renderIcon: (color: string) => React.ReactNode;
}

const ACTIVITY_ITEMS: ActivityOption[] = [
  {
    key: 'sedentary',
    title: 'Không tập luyện, ít vận động',
    bullets: [
      'Đi bộ dưới 3.000 bước/ngày.',
      'Công việc văn phòng, ngồi hầu hết thời gian.',
      'Hầu như không tham gia thể dục thể thao.',
    ],
    renderIcon: (color) => (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="4.5" r="2.5" fill={color} />
        <Path
          d="M7 11c0-1.7 1.3-3 3-3h4c1.7 0 3 1.3 3 3v4c0 .6-.4 1-1 1h-2v5c0 .6-.4 1-1 1s-1-.4-1-1v-5h-1v5c0 .6-.4 1-1 1s-1-.4-1-1v-5H8c-.6 0-1-.4-1-1v-4z"
          fill={color}
        />
      </Svg>
    ),
  },
  {
    key: 'light',
    title: 'Vận động nhẹ nhàng',
    bullets: [
      'Đi bộ 3.000 – 6.499 bước/ngày.',
      'Công việc cần đi lại hoặc đứng nhiều hơn (giáo viên, nhân viên bán hàng, phục vụ, nội trợ, công nhân may,...).',
      'Tập nhẹ 2–3 buổi/tuần, 30–45 phút/buổi.',
      'Thường xuyên leo cầu thang, làm việc nhà cơ bản.',
    ],
    renderIcon: (color) => (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="4.5" r="2.5" fill={color} />
        <Path
          d="M13.5 8.5l-3 4.5 2 2.5v5.5c0 .6-.4 1-1 1s-1-.4-1-1v-4.5l-2.5-3 2.5-3.5H8c-.6 0-1-.4-1-1s.4-1 1-1h5.5c.6 0 1 .4 1 1v.5z"
          fill={color}
        />
      </Svg>
    ),
  },
  {
    key: 'moderate',
    title: 'Vận động vừa phải',
    bullets: [
      'Đi bộ 6.500 – 9.999 bước/ngày.',
      'Tập luyện đều đặn 3–5 buổi/tuần, 45–60 phút/buổi.',
      'Các bộ môn: Gym, chạy bộ, bơi lội, đạp xe, yoga, cầu lông, bóng đá,...',
    ],
    renderIcon: (color) => (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={color}
        />
      </Svg>
    ),
  },
  {
    key: 'high',
    title: 'Vận động nhiều / Cường độ cao',
    bullets: [
      'Đi bộ trên 10.000 bước/ngày.',
      'Tập thể thao 6–7 buổi/tuần hoặc 2 buổi/ngày.',
      'Công việc lao động chân tay nặng nhọc (xây dựng, bốc vác, vận động viên).',
    ],
    renderIcon: (color) => (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"
          fill={color}
        />
      </Svg>
    ),
  },
];

export function ActivityLevelSelectionScreen({
  navigation,
  onNext,
  onBack,
  hideHeader = false,
}: ActivityLevelSelectionScreenProps) {
  const insets = useSafeAreaInsets();
  const { draft, updateDraft } = useHealthProfileDraft();
  const [selectedActivity, setSelectedActivity] = useState<ActivityLevel>(
    draft.activity || 'light'
  );

  const handleSelect = (key: ActivityLevel) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedActivity(key);
  };

  const handleNext = () => {
    updateDraft('activity', selectedActivity);

    if (onNext) {
      onNext(selectedActivity);
    } else if (navigation?.navigate) {
      navigation.navigate('DietAndAllergiesSelection');
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
            Cường độ tập luyện của bạn?
          </AppText>
        </View>
      </View>

      {/* ── Activity Cards with Interactive Tactile Animation ──── */}
      <View style={styles.cardsContainer}>
        {ACTIVITY_ITEMS.map((item) => {
          const isSelected = selectedActivity === item.key;
          const iconColor = isSelected ? '#C084FC' : '#8E87AA';

          return (
            <AnimatedCard
              key={item.key}
              selected={isSelected}
              onPress={() => handleSelect(item.key)}
              style={styles.activityCard}
              selectedBorderColor="#A78BFA"
              selectedBgColor="#231742"
              unselectedBorderColor="#2E2352"
              unselectedBgColor="#1A1433"
              activeScale={0.97}
              accessibilityLabel={item.title}
              accessibilityRole="radio"
            >
              <View style={styles.cardHeader}>
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
                </View>
                <AnimatedRadio selected={isSelected} activeColor="#A78BFA" size={24} />
              </View>

              {/* Expandable Bullets with Smooth LayoutAnimation */}
              {isSelected && (
                <View style={styles.bulletsWrap}>
                  {item.bullets.map((bullet, idx) => (
                    <View key={idx} style={styles.bulletRow}>
                      <AppText style={styles.bulletDot}>•</AppText>
                      <AppText style={styles.bulletText}>{bullet}</AppText>
                    </View>
                  ))}
                </View>
              )}
            </AnimatedCard>
          );
        })}
      </View>

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

      {/* ── Progress Bar: 85% ────────────────────────────────── */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: '85%' }]} />
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
    marginBottom: 20,
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
    marginBottom: 20,
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
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 14,
  },
  activityCard: {
    padding: 16,
  },
  cardHeader: {
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
  },
  cardTitleSelected: {
    color: '#E9D5FF',
  },
  bulletsWrap: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(167, 139, 250, 0.2)',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  bulletDot: {
    fontSize: 14,
    color: '#C084FC',
    marginRight: 8,
    lineHeight: 18,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  bottomArea: {
    paddingHorizontal: 20,
    paddingTop: 18,
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
