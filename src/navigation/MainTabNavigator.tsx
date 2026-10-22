import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList, RootStackParamList } from './types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@/theme';
import { AccountProfileScreen } from '@/features/system';
import { todayKey } from '@/features/nutrition/utils';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { ScanTabScreen } from '@/features/system/screens/PlaceholderScreens';
import { HomeDashboardScreen } from '@/features/nutrition/screens/HomeDashboardScreen';
import { FoodDiaryScreen } from '@/features/nutrition/screens/FoodDiaryScreen';
import { MealPlanOverviewScreen } from '@/features/meal-plan/screens/MealPlanOverviewScreen';
import {
  DiaryTabIcon,
  HomeTabIcon,
  MealPlanTabIcon,
  PlusIcon,
  ProfileTabIcon,
} from '@/components/icons';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  const theme = useTheme();
  const { state } = useNutrition();
  const isDark = theme.scheme === 'dark';
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // ── Center (+) Button (Matching Screenshot) ─────────────────────────────────
  const centerButton = (props: BottomTabBarButtonProps) => (
    <Pressable
      testID={props.testID}
      onPress={() =>
        (rootNavigation.getParent() as NativeStackNavigationProp<RootStackParamList> | undefined)?.navigate(
          'AIMealScan',
          { date: state.selectedDate || todayKey(), meal: 'snack' }
        )
      }
      onLongPress={props.onLongPress}
      accessibilityRole="button"
      accessibilityLabel="Thêm món ăn"
      style={({ pressed }) => [
        props.style as object,
        styles.centerButtonPressable,
        pressed && styles.scanPressed,
      ]}
    >
      <View
        style={[
          styles.centerButtonCircle,
          {
            backgroundColor: theme.colors.brandPrimary,
            shadowColor: theme.colors.glow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 4,
          },
        ]}
      >
        <PlusIcon size={20} color={theme.colors.onBrand} strokeWidth={2.4} />
      </View>
    </Pressable>
  );

  // ── Colors from Theme & DESIGN.md ──────────────────────────────────────────
  const barBg = theme.colors.tabBar;
  const barBorderTop = theme.colors.surfaceBorder;
  // Active Tab: Dark brandSecondary (#B488FC) / Light brandPrimary (#7B4FE0)
  const activeColor = isDark ? theme.colors.brandSecondary : theme.colors.brandPrimary;
  const inactiveColor = theme.colors.textSecondary;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: barBg,
          borderTopWidth: 1,
          borderTopColor: barBorderTop,
          ...(isDark ? {} : theme.shadows.bottomBar),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          letterSpacing: 0.1,
          fontFamily: 'PlusJakartaSans_600SemiBold',
          marginTop: 2,
        },
      }}
    >
      {/* 1. Trang chủ */}
      <Tab.Screen
        name="Home"
        component={HomeDashboardScreen}
        options={{
          title: 'Trang chủ',
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color }) => <HomeTabIcon color={color} />,
        }}
      />

      {/* 2. Nhật ký */}
      <Tab.Screen
        name="Diary"
        component={FoodDiaryScreen}
        options={{
          title: 'Nhật ký',
          tabBarLabel: 'Nhật ký',
          tabBarIcon: ({ color }) => <DiaryTabIcon color={color} />,
        }}
      />

      {/* 3. Nút tròn thêm nhanh (+) */}
      <Tab.Screen
        name="Scan"
        component={ScanTabScreen}
        options={{
          title: 'AI Scan',
          tabBarLabel: () => null,
          tabBarButton: centerButton,
          tabBarAccessibilityLabel: 'Thêm món ăn',
        }}
      />

      {/* 4. Thực đơn */}
      <Tab.Screen
        name="MealPlan"
        component={MealPlanOverviewScreen}
        options={{
          title: 'Thực đơn',
          tabBarLabel: 'Thực đơn',
          tabBarIcon: ({ color }) => <MealPlanTabIcon color={color} />,
        }}
      />

      {/* 5. Tài khoản */}
      <Tab.Screen
        name="Profile"
        component={AccountProfileScreen}
        options={{
          title: 'Tài khoản',
          tabBarLabel: 'Tài khoản',
          tabBarIcon: ({ color }) => <ProfileTabIcon color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  centerButtonPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.94 }],
  },
});
