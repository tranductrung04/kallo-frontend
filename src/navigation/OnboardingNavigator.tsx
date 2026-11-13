import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from './types';
import { OnboardingScreen } from '@/features/profile/screens/OnboardingScreen';
import {
  KalloWelcomeScreen,
  NicknameScreen,
  GenderSelectionScreen,
  HeightSelectionScreen,
  CurrentWeightSelectionScreen,
  GoalSelectionScreen,
  TargetWeightSelectionScreen,
  ActivityLevelSelectionScreen,
  DietAndAllergiesSelectionScreen,
  HealthConditionsSelectionScreen,
  ProfileSummaryScreen,
  CalculatingPlanScreen,
  PlanResultScreen,
  HealthProfileWizardScreen,
} from '@/features/health-profile/screens';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="KalloWelcome"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#120E29' },
      }}
    >
      <Stack.Screen
        name="KalloWelcome"
        component={KalloWelcomeScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="HealthProfileWizard"
        component={HealthProfileWizardScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Nickname"
        component={NicknameScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="GenderSelection"
        component={GenderSelectionScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="HeightSelection"
        component={HeightSelectionScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="CurrentWeightSelection"
        component={CurrentWeightSelectionScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="GoalSelection"
        component={GoalSelectionScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="TargetWeightSelection"
        component={TargetWeightSelectionScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="ActivityLevelSelection"
        component={ActivityLevelSelectionScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="DietAndAllergiesSelection"
        component={DietAndAllergiesSelectionScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="HealthConditionsSelection"
        component={HealthConditionsSelectionScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="ProfileSummary"
        component={ProfileSummaryScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="CalculatingPlan"
        component={CalculatingPlanScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="PlanResult"
        component={PlanResultScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}
