import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { MainTabNavigator } from './MainTabNavigator';
import { AuthNavigator } from './AuthNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { ComponentShowcaseScreen } from '@/features/system/screens/ComponentShowcaseScreen';
import { ScanPlaceholderScreen } from '@/features/system/screens/PlaceholderScreens';
import { FoodSearchScreen } from '@/features/nutrition/screens/FoodSearchScreen';
import { FoodDetailScreen } from '@/features/nutrition/screens/FoodDetailScreen';
import { CustomFoodFormScreen } from '@/features/nutrition/screens/CustomFoodFormScreen';
import { AIMealScanScreen } from '@/features/nutrition/screens/AIMealScanScreen';
import { MealScanResultScreen } from '@/features/nutrition/screens/MealScanResultScreen';
import { BarcodeScannerScreen } from '@/features/nutrition/screens/BarcodeScannerScreen';
import { ActivityTrackerScreen, HealthSyncScreen, BodyMetricScreen } from '@/features/activity';
import { MealPlanOverviewScreen, MealPlanWizardScreen, MealPlanDetailScreen } from '@/features/meal-plan';
import { NutritionChatScreen, VoiceLogModal } from '@/features/assistant';
import { StreakDetailModal, BadgesChallengesScreen, FriendsLeaderboardScreen } from '@/features/gamification';
import { NotificationCenterScreen, ReminderSettingsScreen } from '@/features/system';
import { useTheme } from '@/theme';
import { AppText } from '@/components/common';
import { useAuth } from '@/features/auth/AuthProvider';

const Stack = createNativeStackNavigator<RootStackParamList>();
function SplashScreen() { const theme = useTheme(); const insets = useSafeAreaInsets(); return <View style={[styles.splash, { backgroundColor: theme.colors.primary, paddingTop: insets.top, paddingBottom: insets.bottom }]}><ActivityIndicator color={theme.colors.onPrimary} accessibilityLabel="Đang khởi động" /><AppText variant="title" color={theme.colors.onPrimary}>Kallo</AppText><AppText color={theme.colors.onPrimary}>Chăm sóc sức khỏe mỗi ngày</AppText></View>; }

export function RootNavigator() {
  const theme = useTheme(); const { status } = useAuth();
  if (status === 'loading') return <SplashScreen />;
  const baseTheme = theme.scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = { ...baseTheme, colors: { ...baseTheme.colors, background: theme.colors.background, card: theme.colors.surface, text: theme.colors.text, border: theme.colors.border, primary: theme.colors.primary } };
  return <NavigationContainer theme={navigationTheme}><Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: theme.colors.surface }, headerTintColor: theme.colors.text, contentStyle: { backgroundColor: theme.colors.background } }}>
    {status === 'signedOut' ? <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} /> : status === 'needsProfile' ? <Stack.Screen name="Onboarding" component={OnboardingNavigator} options={{ headerShown: false }} /> : <>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="ComponentShowcase" component={ComponentShowcaseScreen} options={{ title: 'Bộ UI Kit' }} />
      <Stack.Screen name="AIScanPlaceholder" component={ScanPlaceholderScreen} options={{ title: 'AI Meal Scan' }} />
      <Stack.Screen name="FoodSearch" component={FoodSearchScreen} options={{ title: 'Tìm món ăn' }} />
      <Stack.Screen name="FoodDetail" component={FoodDetailScreen} options={{ title: 'Chi tiết món ăn' }} />
      <Stack.Screen name="CustomFoodForm" component={CustomFoodFormScreen} options={{ title: 'Món ăn tùy chỉnh' }} />
      <Stack.Screen name="AIMealScan" component={AIMealScanScreen} options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      <Stack.Screen name="MealScanResult" component={MealScanResultScreen} options={{ title: 'Kết quả nhận diện' }} />
      <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      <Stack.Screen name="ActivityTracker" component={ActivityTrackerScreen} options={{ title: 'Vận động & Thể thao' }} />
      <Stack.Screen name="HealthSync" component={HealthSyncScreen} options={{ title: 'Đồng bộ sức khỏe' }} />
      <Stack.Screen name="BodyMetric" component={BodyMetricScreen} options={{ title: 'Chỉ số eo / mông' }} />
      <Stack.Screen name="MealPlanOverview" component={MealPlanOverviewScreen} options={{ title: 'Thực đơn AI' }} />
      <Stack.Screen name="MealPlanWizard" component={MealPlanWizardScreen} options={{ title: 'Tạo thực đơn AI' }} />
      <Stack.Screen name="MealPlanDetail" component={MealPlanDetailScreen} options={{ title: 'Chi tiết thực đơn' }} />
      <Stack.Screen name="NutritionChat" component={NutritionChatScreen} options={{ title: 'Trợ lý Kallo AI' }} />
      <Stack.Screen name="VoiceLogModal" component={VoiceLogModal} options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="StreakDetail" component={StreakDetailModal} options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="BadgesChallenges" component={BadgesChallengesScreen} options={{ title: 'Huy hiệu & Thử thách' }} />
      <Stack.Screen name="FriendsLeaderboard" component={FriendsLeaderboardScreen} options={{ title: 'Bảng xếp hạng bạn bè' }} />
      <Stack.Screen name="NotificationCenter" component={NotificationCenterScreen} options={{ title: 'Trung tâm thông báo' }} />
      <Stack.Screen name="ReminderSettings" component={ReminderSettingsScreen} options={{ title: 'Cài đặt nhắc nhở' }} />
    </>}
  </Stack.Navigator></NavigationContainer>;
}
const styles = StyleSheet.create({ splash: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 } });
