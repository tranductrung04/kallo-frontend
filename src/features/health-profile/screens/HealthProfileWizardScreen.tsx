import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon, MoonIcon, SunIcon } from '@/components/icons';
import { useTheme } from '@/theme';
import { useHealthProfileDraft } from '../hooks/useHealthProfileDraft';
import type { GoalType } from '../types';
import { GenderSelectionScreen } from './GenderSelectionScreen';
import { AgeSelectionScreen } from './AgeSelectionScreen';
import { HeightSelectionScreen } from './HeightSelectionScreen';
import { CurrentWeightSelectionScreen } from './CurrentWeightSelectionScreen';
import { GoalSelectionScreen } from './GoalSelectionScreen';
import { TargetWeightSelectionScreen } from './TargetWeightSelectionScreen';
import { ActivityLevelSelectionScreen } from './ActivityLevelSelectionScreen';
import { DietAndAllergiesSelectionScreen } from './DietAndAllergiesSelectionScreen';
import { HealthConditionsSelectionScreen } from './HealthConditionsSelectionScreen';
import { ProfileSummaryScreen } from './ProfileSummaryScreen';

const STEP_PERCENTAGES = [
  10,  // 0: Gender
  20,  // 1: Age
  32,  // 2: Height
  44,  // 3: Current Weight
  56,  // 4: Goal
  68,  // 5: Target Weight
  80,  // 6: Activity Level
  90,  // 7: Diet & Allergies
  96,  // 8: Health Conditions
  100, // 9: Profile Summary
];

interface HealthProfileWizardScreenProps {
  navigation?: any;
  route?: { params?: { initialStep?: number } };
}

export function HealthProfileWizardScreen({
  navigation,
  route,
}: HealthProfileWizardScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const { draft } = useHealthProfileDraft();
  const initial = route?.params?.initialStep ?? 0;
  const [currentStep, setCurrentStep] = useState(initial);

  // Persistent progress bar fill width animation
  const progressAnim = useRef(
    new Animated.Value(STEP_PERCENTAGES[initial] || 10)
  ).current;

  // Step transition animations
  const stepSlideAnim = useRef(new Animated.Value(0)).current;
  const stepFadeAnim = useRef(new Animated.Value(1)).current;

  const animateToStep = useCallback(
    (newStep: number, direction: 'forward' | 'backward') => {
      // 1. Animate progress bar fill width smoothly
      Animated.timing(progressAnim, {
        toValue: STEP_PERCENTAGES[newStep] || 10,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();

      // 2. Animate step content horizontal slide & fade
      stepSlideAnim.setValue(direction === 'forward' ? 36 : -36);
      stepFadeAnim.setValue(0);

      Animated.parallel([
        Animated.timing(stepSlideAnim, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(stepFadeAnim, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentStep(newStep);
    },
    [progressAnim, stepSlideAnim, stepFadeAnim]
  );

  const handleNext = useCallback(
    (nextGoal?: GoalType) => {
      if (currentStep === 4) {
        const effectiveGoal = nextGoal ?? draft.goal;
        animateToStep(effectiveGoal === 'maintain' ? 6 : 5, 'forward');
        return;
      }
      if (currentStep < 9) {
        animateToStep(currentStep + 1, 'forward');
      } else {
        // Completed Summary -> Navigate to Calculating Plan
        if (navigation?.navigate) {
          navigation.navigate('CalculatingPlan');
        }
      }
    },
    [currentStep, draft.goal, animateToStep, navigation]
  );

  const handleBack = useCallback(() => {
    if (currentStep === 6 && draft.goal === 'maintain') {
      animateToStep(4, 'backward');
      return;
    }
    if (currentStep > 0) {
      animateToStep(currentStep - 1, 'backward');
    } else {
      if (navigation?.canGoBack?.() && navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, [currentStep, draft.goal, animateToStep, navigation]);

  const renderActiveStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <GenderSelectionScreen
            navigation={navigation}
            onNext={() => handleNext()}
            onBack={handleBack}
            hideHeader
          />
        );
      case 1:
        return (
          <AgeSelectionScreen
            navigation={navigation}
            onNext={() => handleNext()}
            onBack={handleBack}
            hideHeader
          />
        );
      case 2:
        return (
          <HeightSelectionScreen
            navigation={navigation}
            onNext={() => handleNext()}
            onBack={handleBack}
            hideHeader
          />
        );
      case 3:
        return (
          <CurrentWeightSelectionScreen
            navigation={navigation}
            onNext={() => handleNext()}
            onBack={handleBack}
            hideHeader
          />
        );
      case 4:
        return (
          <GoalSelectionScreen
            navigation={navigation}
            onNext={(goal) => handleNext(goal)}
            onBack={handleBack}
            hideHeader
          />
        );
      case 5:
        return (
          <TargetWeightSelectionScreen
            navigation={navigation}
            onNext={() => handleNext()}
            onBack={handleBack}
            hideHeader
          />
        );
      case 6:
        return (
          <ActivityLevelSelectionScreen
            navigation={navigation}
            onNext={() => handleNext()}
            onBack={handleBack}
            hideHeader
          />
        );
      case 7:
        return (
          <DietAndAllergiesSelectionScreen
            navigation={navigation}
            onNext={() => handleNext()}
            onBack={handleBack}
            hideHeader
          />
        );
      case 8:
        return (
          <HealthConditionsSelectionScreen
            navigation={navigation}
            onNext={() => handleNext()}
            onBack={handleBack}
            hideHeader
          />
        );
      case 9:
        return (
          <ProfileSummaryScreen
            navigation={navigation}
            onNext={() => handleNext()}
            onBack={handleBack}
            hideHeader
          />
        );
      default:
        return null;
    }
  };

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
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* ── Persistent Fixed Top Bar ────────────────────────────── */}
      <View style={styles.persistentTopBar}>
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

        <View style={styles.topBarSpacer} />

        <TouchableOpacity
          onPress={theme.toggleScheme}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel={
            isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'
          }
          style={styles.themeToggleBtn}
        >
          {isDark ? (
            <SunIcon size={20} color="#FACC15" />
          ) : (
            <MoonIcon size={20} color={theme.colors.brandPrimary} />
          )}
        </TouchableOpacity>
      </View>

      {/* ── Persistent Single Progress Bar ──────────────────────── */}
      <View
        style={[
          styles.persistentProgressTrack,
          {
            backgroundColor: isDark ? '#261F45' : theme.colors.surfaceBorder,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.persistentProgressFill,
            {
              backgroundColor: theme.colors.brandPrimary,
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {/* ── Animated Step Content ───────────────────────────────── */}
      <Animated.View
        style={[
          styles.stepContainer,
          {
            opacity: stepFadeAnim,
            transform: [{ translateX: stepSlideAnim }],
          },
        ]}
      >
        {renderActiveStep()}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120E29',
  },
  persistentTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 44,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarSpacer: {
    flex: 1,
  },
  themeToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  persistentProgressTrack: {
    height: 6,
    backgroundColor: '#261F45',
    marginHorizontal: 20,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 2,
    marginBottom: 16,
  },
  persistentProgressFill: {
    height: '100%',
    backgroundColor: '#9D6CFA',
    borderRadius: 3,
  },
  stepContainer: {
    flex: 1,
  },
});
