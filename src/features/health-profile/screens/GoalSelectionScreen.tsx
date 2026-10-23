import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { images } from '@/assets/images';
import { AppText } from '@/components/common';
import { ChevronLeftIcon } from '@/components/icons';
import { AnimatedCard, AnimatedRadio } from '../components';
import { useHealthProfileDraft } from '../hooks/useHealthProfileDraft';
import { defaultMacroPercentages } from '../utils/calculations';
import type { GoalType } from '../types';

interface GoalSelectionScreenProps {
  navigation?: any;
  onNext?: (goal: GoalType) => void;
  onBack?: () => void;
  hideHeader?: boolean;
}

interface GoalOption {
  key: GoalType;
  title: string;
  subtitle: string;
  renderIcon: (color: string) => React.ReactNode;
}

const GOAL_ITEMS: GoalOption[] = [
  {
    key: 'lose',
    title: 'Giảm cân',
    subtitle: 'Tập trung vào giảm mỡ',
    renderIcon: (color) => (
      <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
        <Path
          d="M23 18l-9.5-9.5-5 5L1 6"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M17 18h6v-6"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
  },
  {
    key: 'gain',
    title: 'Tăng cân',
    subtitle: 'Xây dựng cơ bắp, khỏe mạnh từ bên trong',
    renderIcon: (color) => (
      <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
        <Path
          d="M23 6l-9.5 9.5-5-5L1 18"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M17 6h6v6"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
  },
  {
    key: 'maintain',
    title: 'Duy trì cân nặng',
    subtitle: 'Vừa đốt mỡ, vừa tăng cơ để có body săn chắc.',
    renderIcon: (color) => (
      <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
        <Path
          d="M5 12h14"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8 8l-4 4 4 4"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M16 8l4 4-4 4"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
  },
];

export function GoalSelectionScreen({
  navigation,
  onNext,
  onBack,
  hideHeader = false,
}: GoalSelectionScreenProps) {
  const insets = useSafeAreaInsets();
  const { draft, updateDraft } = useHealthProfileDraft();
  const [selectedGoal, setSelectedGoal] = useState<GoalType>(draft.goal || 'gain');

  const handleNext = () => {
    updateDraft('goal', selectedGoal);
    updateDraft('macros', defaultMacroPercentages(selectedGoal));

    if (onNext) {
      onNext(selectedGoal);
    } else if (navigation?.navigate) {
      navigation.navigate('TargetWeightSelection');
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
    <>
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
            Mục tiêu cân nặng của bạn
          </AppText>
        </View>
      </View>

      {/* ── Goal Option Cards ──────────────────────────────────── */}
      <View style={styles.cardsContainer}>
        {GOAL_ITEMS.map((item) => {
          const isSelected = selectedGoal === item.key;
          const iconColor = isSelected ? '#C084FC' : '#8E87AA';

          return (
            <AnimatedCard
              key={item.key}
              selected={isSelected}
              onPress={() => setSelectedGoal(item.key)}
              style={styles.goalCard}
              selectedBorderColor="#A78BFA"
              selectedBgColor="#231742"
              unselectedBorderColor="#2E2352"
              unselectedBgColor="#1A1433"
              activeScale={0.965}
              accessibilityLabel={`${item.title}, ${item.subtitle}`}
              accessibilityRole="radio"
            >
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.iconWrap,
                    isSelected ? styles.iconWrapSelected : styles.iconWrapUnselected,
                  ]}
                >
                  {item.renderIcon(iconColor)}
                </View>
                <View style={styles.textWrap}>
                  <AppText style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                    {item.title}
                  </AppText>
                  <AppText style={styles.cardSubtitle}>{item.subtitle}</AppText>
                </View>
                <View style={styles.radioWrap}>
                  <AnimatedRadio selected={isSelected} activeColor="#A78BFA" size={24} />
                </View>
              </View>
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
    </>
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

      {/* ── Progress Bar: 65% ────────────────────────────────── */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: '65%' }]} />
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
    marginBottom: 24,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9D6CFA',
    borderRadius: 3,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
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
    gap: 16,
  },
  goalCard: {
    padding: 18,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconWrapSelected: {
    backgroundColor: 'rgba(167, 139, 250, 0.18)',
  },
  iconWrapUnselected: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  textWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardTitleSelected: {
    color: '#E9D5FF',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#A098BD',
    lineHeight: 18,
  },
  radioWrap: {
    marginLeft: 12,
  },
  bottomArea: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingTop: 16,
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
