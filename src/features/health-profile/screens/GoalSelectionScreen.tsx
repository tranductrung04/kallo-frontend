import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MoveHorizontal, TrendingDown, TrendingUp } from 'lucide-react-native';
import { images } from '@/assets/images';
import { AppText } from '@/components/common';
import { ChevronLeftIcon } from '@/components/icons';
import { useTheme } from '@/theme';
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
    renderIcon: (color) => <TrendingDown size={26} color={color} strokeWidth={2.5} />,
  },
  {
    key: 'gain',
    title: 'Tăng cân',
    subtitle: 'Xây dựng cơ bắp, khỏe mạnh từ bên trong',
    renderIcon: (color) => <TrendingUp size={26} color={color} strokeWidth={2.5} />,
  },
  {
    key: 'maintain',
    title: 'Duy trì cân nặng',
    subtitle: 'Vừa đốt mỡ, vừa tăng cơ để có body săn chắc.',
    renderIcon: (color) => <MoveHorizontal size={26} color={color} strokeWidth={2.5} />,
  },
];

export function GoalSelectionScreen({
  navigation,
  onNext,
  onBack,
  hideHeader = false,
}: GoalSelectionScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const { draft, updateDraft } = useHealthProfileDraft();

  const parsedAge = parseInt(draft.age, 10);
  const isUnderage = !isNaN(parsedAge) && parsedAge > 0 && parsedAge < 18;

  const [selectedGoal, setSelectedGoal] = useState<GoalType>(
    isUnderage ? 'maintain' : draft.goal || 'gain'
  );

  React.useEffect(() => {
    if (isUnderage && selectedGoal !== 'maintain') {
      setSelectedGoal('maintain');
    }
  }, [isUnderage]);

  const handleNext = () => {
    const finalGoal = isUnderage ? 'maintain' : selectedGoal;
    const currentWeightNum = parseFloat(draft.weight);
    const validCurrentWeight =
      !isNaN(currentWeightNum) && currentWeightNum > 0 ? currentWeightNum : 53;
    const currentTargetNum = parseFloat(draft.targetWeight);
    const hasValidTarget = !isNaN(currentTargetNum) && currentTargetNum >= 20 && currentTargetNum <= 300;

    updateDraft('goal', finalGoal);
    updateDraft('macros', defaultMacroPercentages(finalGoal));
    if (finalGoal === 'maintain') {
      updateDraft('targetWeight', validCurrentWeight.toFixed(1));
      updateDraft('weeklyRate', '0');
    } else {
      if (finalGoal === 'lose' && (!hasValidTarget || currentTargetNum >= validCurrentWeight)) {
        updateDraft('targetWeight', Math.max(20, validCurrentWeight - 5).toFixed(1));
      } else if (finalGoal === 'gain' && (!hasValidTarget || currentTargetNum <= validCurrentWeight)) {
        updateDraft('targetWeight', Math.min(300, validCurrentWeight + 5).toFixed(1));
      }
      if (!draft.weeklyRate || draft.weeklyRate === '0') {
        updateDraft('weeklyRate', '0.5');
      }
    }

    if (onNext) {
      onNext(finalGoal);
    } else if (navigation?.navigate) {
      navigation.navigate(
        finalGoal === 'maintain' ? 'ActivityLevelSelection' : 'TargetWeightSelection'
      );
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
        <View
          style={[
            styles.avatarWrap,
            {
              backgroundColor: isDark ? '#302657' : '#EDE5FF',
              borderColor: isDark ? '#9D6CFA' : '#D4C7F8',
            },
          ]}
        >
          <Image
            source={images.mascotAvatar}
            style={styles.avatarImage}
            resizeMode="cover"
            accessibilityLabel="Mascot Kallo"
          />
        </View>
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: '#FFFFFF',
              borderColor: isDark ? '#382D61' : theme.colors.surfaceBorder,
              borderWidth: 1,
            },
          ]}
        >
          <View
            style={[
              styles.bubbleTail,
              {
                borderRightColor: '#FFFFFF',
              },
            ]}
          />
          <AppText
            style={[
              styles.bubbleText,
              { color: '#111827' },
            ]}
          >
            Mục tiêu cân nặng của bạn
          </AppText>
        </View>
      </View>

      {/* ── Underage Safety Notice (Nếu < 18 tuổi) ─────────────── */}
      {isUnderage && (
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 12,
            padding: 12,
            borderRadius: 12,
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
            borderWidth: 1,
            borderColor: isDark ? '#B91C1C' : '#FECACA',
          }}
        >
          <AppText
            variant="caption"
            style={{ color: isDark ? '#FCA5A5' : '#B91C1C', lineHeight: 18 }}
          >
            ⚠️ Theo quy tắc an toàn y sinh Kallo: Bạn chưa đủ 18 tuổi ({parsedAge} tuổi), hệ thống tự động khóa chế độ Duy trì cân nặng để đảm bảo phát triển thể chất toàn diện.
          </AppText>
        </View>
      )}

      {/* ── Goal Option Cards ──────────────────────────────────── */}
      <View style={styles.cardsContainer}>
        {GOAL_ITEMS.map((item) => {
          const isSelected = selectedGoal === item.key;
          const isDisabled = isUnderage && item.key !== 'maintain';
          const iconColor = isSelected
            ? isDark
              ? '#C084FC'
              : theme.colors.brandPrimary
            : isDark
              ? '#8E87AA'
              : theme.colors.textSecondary;

          return (
            <AnimatedCard
              key={item.key}
              selected={isSelected}
              onPress={() => {
                if (!isDisabled) {
                  setSelectedGoal(item.key);
                }
              }}
              style={[styles.goalCard, isDisabled && { opacity: 0.45 }]}
              selectedBorderColor={theme.colors.brandPrimary}
              selectedBgColor={isDark ? '#231742' : 'transparent'}
              unselectedBorderColor={isDark ? '#2E2352' : theme.colors.surfaceBorder}
              unselectedBgColor={isDark ? '#1A1433' : theme.colors.surfaceMid}
              activeScale={isDisabled ? 1 : 0.965}
              accessibilityLabel={`${item.title}, ${item.subtitle}`}
              accessibilityRole="radio"
            >
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.iconWrap,
                    isSelected
                      ? {
                        backgroundColor: 'transparent',
                      }
                      : {
                        backgroundColor: 'transparent',
                      },
                  ]}
                >
                  {item.renderIcon(iconColor)}
                </View>
                <View style={styles.textWrap}>
                  <AppText
                    style={[
                      styles.cardTitle,
                      {
                        color: isSelected
                          ? isDark
                            ? '#E9D5FF'
                            : theme.colors.brandPrimary
                          : isDark
                            ? '#FFFFFF'
                            : theme.colors.textPrimary,
                      },
                    ]}
                  >
                    {item.title}
                  </AppText>
                  <AppText
                    style={[
                      styles.cardSubtitle,
                      {
                        color: isDark ? '#A098BD' : theme.colors.textSecondary,
                      },
                    ]}
                  >
                    {item.subtitle}
                  </AppText>
                </View>
                <View style={styles.radioWrap}>
                  <AnimatedRadio
                    selected={isSelected}
                    activeColor={theme.colors.brandPrimary}
                    inactiveColor={isDark ? '#473B6B' : theme.colors.surfaceBorder}
                    size={24}
                  />
                </View>
              </View>
            </AnimatedCard>
          );
        })}
      </View>

      {/* ── Bottom Action Button ───────────────────────────────── */}
      <View style={[styles.bottomArea, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: theme.colors.brandAction,
              shadowColor: theme.colors.brandPrimary,
            },
          ]}
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
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: isDark ? '#120E29' : theme.colors.canvasBase,
        },
      ]}
    >
      {/* ── Top Bar ────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ChevronLeftIcon
            size={26}
            color={isDark ? '#FFFFFF' : theme.colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* ── Progress Bar: 65% ────────────────────────────────── */}
      <View
        style={[
          styles.progressTrack,
          {
            backgroundColor: isDark ? '#261F45' : theme.colors.surfaceBorder,
          },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: theme.colors.brandPrimary,
              width: '65%',
            },
          ]}
        />
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
