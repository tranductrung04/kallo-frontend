import type { NavigatorScreenParams } from '@react-navigation/native';
import type { FoodLogSource, MealSlot } from '@/features/nutrition/types';

export type MainTabParamList = {
  Home: undefined;
  Diary: undefined;
  Scan: undefined;
  MealPlan: undefined;
  Profile: undefined;
  Report?: undefined;
};
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string } | undefined;
};
export type OnboardingStackParamList = { Onboarding: undefined };
export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  ComponentShowcase: undefined;
  AIScanPlaceholder: undefined;
  FoodSearch: { date: string; meal: MealSlot; hour?: string };
  FoodDetail: { foodId: string; date: string; meal: MealSlot; logId?: string; source?: FoodLogSource };
  CustomFoodForm: { foodId?: string; date: string; meal: MealSlot; barcode?: string };
  AIMealScan: { date: string; meal: MealSlot };
  MealScanResult: { imageUri: string; date: string; meal: MealSlot };
  BarcodeScanner: { date: string; meal: MealSlot };
  ActivityTracker: { date?: string } | undefined;
  HealthSync: undefined;
  BodyMetric: undefined;
  MealPlanOverview: undefined;
  MealPlanWizard: undefined;
  MealPlanDetail: { planId?: string } | undefined;
  NutritionChat: { initialPrompt?: string } | undefined;
  VoiceLogModal: { date?: string; meal?: MealSlot } | undefined;
  StreakDetail: undefined;
  BadgesChallenges: undefined;
  FriendsLeaderboard: undefined;
  NotificationCenter: undefined;
  ReminderSettings: undefined;
  ReportOverview: { date?: string; metric?: string } | undefined;
};
