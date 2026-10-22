import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Circle, Path } from 'react-native-svg';
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

const Tab = createBottomTabNavigator<MainTabParamList>();

// ─── Pixel-perfect SVG Tab Icons (Matching Screenshot) ───────────────────────

function HomeTabIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2.3c1.5 0 2.8.8 3.8 1.7l4.4 4.3c.8.7 1.3 1.7 1.3 2.7v8.5c0 1.1-.9 2-2 2h-2.5c-1.1 0-2-.9-2-2v-5.5c0-1.4-1.2-2.5-3-2.5s-3 1.1-3 2.5V19.5c0 1.1-.9 2-2 2H4.5c-1.1 0-2-.9-2-2v-8.5c0-1 .5-2 1.3-2.7l4.4-4.3c1-.9 2.3-1.7 3.8-1.7z" />
    </Svg>
  );
}

function DiaryTabIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill={color}>
      {/* Spoon (Thìa / Muỗng bên trái) */}
      <Path d="M8 2c-2.2 0-3.5 2.2-3.5 5.2 0 2.8 1.3 4.6 2.2 5.6v7.9c0 .7.6 1.3 1.3 1.3s1.3-.6 1.3-1.3v-7.9c.9-1 2.2-2.8 2.2-5.6C11.5 4.2 10.2 2 8 2z" />
      {/* Fork (Nĩa / Dĩa 3 răng bên phải) */}
      <Path d="M14.1 2c.4 0 .7.3.7.7v4.8c0 .5.3.8.65.8s.65-.3.65-.8V2.7c0-.4.3-.7.6-.7s.6.3.6.7v4.8c0 .5.3.8.65.8s.65-.3.65-.8V2.7c0-.4.3-.7.7-.7s.5.3.5.7v5.5c0 2.3-1 3.6-1.8 4.6v7.9c0 .7-.6 1.3-1.3 1.3s-1.3-.6-1.3-1.3v-7.9c-.8-1-1.8-2.3-1.8-4.6V2.7c0-.4.2-.7.5-.7z" />
    </Svg>
  );
}

function MealPlanTabIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill={color}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 2h3c.8 0 1.5.7 1.5 1.5V4.5h2c1.7 0 3 1.3 3 3v11c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3v-11c0-1.7 1.3-3 3-3h2V3.5c0-.8.7-1.5 1.5-1.5zM9.8 5.6h4.4c.3 0 .6.3.6.6s-.3.6-.6.6H9.8c-.3 0-.6-.3-.6-.6s.3-.6.6-.6zM7.2 10c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm3.6.2h5.9c.4 0 .8.4.8.8s-.4.8-.8.8h-5.9c-.4 0-.8-.4-.8-.8s.4-.8.8-.8zm-3.6 4.3c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm3.6.2h5.9c.4 0 .8.4.8.8s-.4.8-.8.8h-5.9c-.4 0-.8-.4-.8-.8s.4-.8.8-.8z"
      />
    </Svg>
  );
}

function ProfileTabIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill={color}>
      <Circle cx={12} cy={7} r={4.5} />
      <Path d="M12 13.5c3.5 0 6.5 1.3 8 3 .5.6.7 1.3.7 2v2c0 .7-.6 1.3-1.3 1.3H4.6c-.7 0-1.3-.6-1.3-1.3v-2c0-.7.2-1.4.7-2 1.5-1.7 4.5-3 8-3z" />
    </Svg>
  );
}

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
        <Svg width={20} height={20} viewBox="0 0 24 24" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round">
          <Path d="M12 5v14M5 12h14" />
        </Svg>
      </View>
    </Pressable>
  );

  // ── Colors from Theme & DESIGN.md ──────────────────────────────────────────
  const barBg = theme.colors.tabBar;
  const barBorderTop = isDark ? 'rgba(255, 255, 255, 0.08)' : theme.colors.surfaceBorder;
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
