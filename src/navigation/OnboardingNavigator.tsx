import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from './types';
import { OnboardingScreen } from '@/features/profile/screens/OnboardingScreen';
import { useTheme } from '@/theme';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();
export function OnboardingNavigator() {
  const theme = useTheme();
  return <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: theme.colors.surface }, headerTintColor: theme.colors.text, contentStyle: { backgroundColor: theme.colors.background } }}>
    <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ title: 'Thiết lập hồ sơ', headerBackVisible: false }} />
  </Stack.Navigator>;
}
