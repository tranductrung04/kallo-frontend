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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from '@/components/icons';
import { NicknameScreen } from './NicknameScreen';
import { GenderSelectionScreen } from './GenderSelectionScreen';
import { HeightSelectionScreen } from './HeightSelectionScreen';
import { CurrentWeightSelectionScreen } from './CurrentWeightSelectionScreen';
import { GoalSelectionScreen } from './GoalSelectionScreen';
import { TargetWeightSelectionScreen } from './TargetWeightSelectionScreen';
import { ActivityLevelSelectionScreen } from './ActivityLevelSelectionScreen';
import { DietAndAllergiesSelectionScreen } from './DietAndAllergiesSelectionScreen';
import { HealthConditionsSelectionScreen } from './HealthConditionsSelectionScreen';
import { ProfileSummaryScreen } from './ProfileSummaryScreen';

const STEP_PERCENTAGES = [
  10,  // 0: Nickname
  20,  // 1: Gender
  35,  // 2: Height
  50,  // 3: Current Weight
  65,  // 4: Goal
  75,  // 5: Target Weight
  85,  // 6: Activity Level
  92,  // 7: Diet & Allergies
  97,  // 8: Health Conditions
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

  const handleNext = useCallback(() => {
    if (currentStep < 9) {
      animateToStep(currentStep + 1, 'forward');
    } else {
      // Completed Summary -> Navigate to Calculating Plan
      if (navigation?.navigate) {
        navigation.navigate('CalculatingPlan');
      }
    }
  }, [currentStep, animateToStep, navigation]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      animateToStep(currentStep - 1, 'backward');
    } else {
      if (navigation?.canGoBack?.() && navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, [currentStep, animateToStep, navigation]);

  const renderActiveStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <NicknameScreen
            navigation={navigation}
            onNext={handleNext}
            onBack={handleBack}
            hideHeader
          />
        );
      case 1:
        return (
          <GenderSelectionScreen
            navigation={navigation}
            onNext={handleNext}
            onBack={handleBack}
            hideHeader
          />
        );
      case 2:
        return (
          <HeightSelectionScreen
            navigation={navigation}
            onNext={handleNext}
            onBack={handleBack}
            hideHeader
          />
        );
      case 3:
        return (
          <CurrentWeightSelectionScreen
            navigation={navigation}
            onNext={handleNext}
            onBack={handleBack}
            hideHeader
          />
        );
      case 4:
        return (
          <GoalSelectionScreen
            navigation={navigation}
            onNext={handleNext}
            onBack={handleBack}
            hideHeader
          />
        );
      case 5:
        return (
          <TargetWeightSelectionScreen
            navigation={navigation}
            onNext={handleNext}
            onBack={handleBack}
            hideHeader
          />
        );
      case 6:
        return (
          <ActivityLevelSelectionScreen
            navigation={navigation}
            onNext={handleNext}
            onBack={handleBack}
            hideHeader
          />
        );
      case 7:
        return (
          <DietAndAllergiesSelectionScreen
            navigation={navigation}
            onNext={handleNext}
            onBack={handleBack}
            hideHeader
          />
        );
      case 8:
        return (
          <HealthConditionsSelectionScreen
            navigation={navigation}
            onNext={handleNext}
            onBack={handleBack}
            hideHeader
          />
        );
      case 9:
        return (
          <ProfileSummaryScreen
            navigation={navigation}
            onNext={handleNext}
            onBack={handleBack}
            hideHeader
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Persistent Fixed Top Bar ────────────────────────────── */}
      <View style={styles.persistentTopBar}>
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

      {/* ── Persistent Single Progress Bar ──────────────────────── */}
      <View style={styles.persistentProgressTrack}>
        <Animated.View
          style={[
            styles.persistentProgressFill,
            {
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
