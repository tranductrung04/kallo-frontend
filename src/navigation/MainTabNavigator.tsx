import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MainTabParamList } from './types';
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
import { DashboardQuickActionsModal } from './DashboardQuickActionsModal';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  const theme = useTheme();
  const { state } = useNutrition();
  const isDark = theme.scheme === 'dark';
  const insets = useSafeAreaInsets();

  const [quickActionsVisible, setQuickActionsVisible] = useState(false);

  // Tab bar height including safe area bottom inset
  const tabBarHeight = 64 + (insets.bottom > 0 ? insets.bottom : 0);

  // Animation for center (+) button rotating into (✕)
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(rotateAnim, {
        toValue: quickActionsVisible ? 1 : 0,
        friction: 7,
        tension: 65,
        useNativeDriver: true,
      }),
      Animated.spring(bgAnim, {
        toValue: quickActionsVisible ? 1 : 0,
        friction: 8,
        tension: 50,
        useNativeDriver: false,
      }),
    ]).start();
  }, [quickActionsVisible, rotateAnim, bgAnim]);

  // Rotate 0deg (+) -> 45deg (✕)
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  // Center button background: brand primary when closed, lavender/light purple when open
  const animatedCircleBg = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      theme.colors.brandPrimary,
      isDark ? '#B488FC' : '#9E64F7',
    ],
  });

  // ── Center Floating (+) Button (Transforms to ✕ via 45deg rotation) ───────
  const centerButton = (props: BottomTabBarButtonProps) => (
    <Pressable
      testID={props.testID}
      onPress={() => setQuickActionsVisible((prev) => !prev)}
      onLongPress={props.onLongPress}
      accessibilityRole="button"
      accessibilityLabel={quickActionsVisible ? 'Đóng menu thao tác nhanh' : 'Mở menu thao tác nhanh'}
      style={({ pressed }) => [
        props.style as object,
        styles.centerButtonPressable,
        pressed && styles.scanPressed,
      ]}
    >
      <Animated.View
        style={[
          styles.centerButtonCircle,
          {
            backgroundColor: animatedCircleBg,
            shadowColor: theme.colors.glow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 4,
          },
        ]}
      >
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <PlusIcon size={24} color="#FFFFFF" strokeWidth={2.6} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );

  // ── Colors from Theme & DESIGN.md ──────────────────────────────────────────
  const barBg = theme.colors.tabBar;
  const barBorderTop = theme.colors.surfaceBorder;
  // Active Tab: Dark brandSecondary (#B488FC) / Light brandPrimary (#7B4FE0)
  const activeColor = isDark ? theme.colors.brandSecondary : theme.colors.brandPrimary;
  const inactiveColor = theme.colors.textSecondary;

  return (
    <View style={styles.rootContainer}>
      <Tab.Navigator
        screenListeners={{
          tabPress: () => {
            if (quickActionsVisible) {
              setQuickActionsVisible(false);
            }
          },
        }}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          tabBarStyle: {
            height: tabBarHeight,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
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

        {/* 3. Nút tròn thêm nhanh (+) -> xoay thành (✕) */}
        <Tab.Screen
          name="Scan"
          component={ScanTabScreen}
          options={{
            title: 'AI Scan',
            tabBarLabel: () => null,
            tabBarButton: centerButton,
            tabBarAccessibilityLabel: 'Thêm thao tác nhanh',
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

      {/* ── Quick Actions Bottom Sheet Overlay (Hiện phía trên thanh Tab Bar thật) ─ */}
      <DashboardQuickActionsModal
        visible={quickActionsVisible}
        onClose={() => setQuickActionsVisible(false)}
        selectedDate={state.selectedDate || todayKey()}
        bottomOffset={tabBarHeight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    position: 'relative',
  },
  centerButtonPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.94 }],
  },
});
