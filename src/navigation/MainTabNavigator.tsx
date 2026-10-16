import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
import { ReportOverviewScreen } from '@/features/report/screens/ReportOverviewScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// ─── Tab Icons ───────────────────────────────────────────────────────────────
// Phase 3: glyph placeholders — will be replaced by icon assets in Phase 7
function TabIcon({ glyph, color }: { glyph: string; color: string }) {
  return <Text style={{ color, fontSize: 20, lineHeight: 24 }}>{glyph}</Text>;
}

export function MainTabNavigator() {
  const theme = useTheme();
  const { state } = useNutrition();
  const isDark = theme.scheme === 'dark';
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // ── Floating (+) AI Scan center button ──────────────────────────────────
  // DESIGN.md: 56x56px circular, brandPrimary, floatingButtonGlow shadow
  const centerButton = ({
    style,
    onLongPress,
    accessibilityState,
    testID,
  }: BottomTabBarButtonProps) => (
    <Pressable
      testID={testID}
      onPress={() =>
        (rootNavigation.getParent() as NativeStackNavigationProp<RootStackParamList> | undefined)?.navigate(
          'AIMealScan',
          { date: state.selectedDate || todayKey(), meal: 'snack' }
        )
      }
      onLongPress={onLongPress}
      accessibilityState={accessibilityState}
      accessibilityRole="button"
      accessibilityLabel="Mở AI Meal Scan"
      style={({ pressed }) => [
        styles.scanButton,
        {
          backgroundColor: theme.colors.brandPrimary,
          // floatingButtonGlow shadow
          shadowColor: isDark ? 'rgba(142, 124, 255, 0.40)' : 'rgba(108, 86, 245, 0.35)',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 1,
          shadowRadius: 24,
          elevation: 10,
        },
        style as object,
        pressed && styles.scanPressed,
      ]}
    >
      <Text style={styles.scanText}>＋</Text>
    </Pressable>
  );

  // ── Bottom Bar colors per DESIGN.md ────────────────────────────────────
  // Dark:  #161420 (90% opacity + backdrop blur)
  // Light: #FFFFFF (92% opacity + backdrop blur)
  const barBg = isDark ? '#161420' : '#FFFFFF';
  const barBorderTop = isDark ? '#252238' : '#E4E0F0';
  const activeColor = theme.colors.brandPrimary;
  const inactiveColor = theme.colors.textSecondary;

  void state;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          height: 68,
          paddingBottom: 10,
          paddingTop: 6,
          backgroundColor: barBg,
          borderTopWidth: 1,
          borderTopColor: barBorderTop,
          // Light mode: upward shadow per DESIGN.md
          ...(isDark
            ? {}
            : {
                shadowColor: 'rgba(19, 18, 27, 0.04)',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 1,
                shadowRadius: 16,
                elevation: 4,
              }),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.4,
          fontFamily: 'PlusJakartaSans_600SemiBold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeDashboardScreen}
        options={{
          title: 'Trang chủ',
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color }) => <TabIcon glyph="⌂" color={color} />,
        }}
      />
      <Tab.Screen
        name="Diary"
        component={FoodDiaryScreen}
        options={{
          title: 'Nhật ký',
          tabBarLabel: 'Nhật ký',
          tabBarIcon: ({ color }) => <TabIcon glyph="▤" color={color} />,
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanTabScreen}
        options={{
          title: 'AI Scan',
          tabBarLabel: 'AI Scan',
          tabBarButton: centerButton,
          tabBarAccessibilityLabel: 'Mở AI Meal Scan',
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportOverviewScreen}
        options={{
          title: 'Thống kê',
          tabBarLabel: 'Thống kê',
          tabBarIcon: ({ color }) => <TabIcon glyph="▥" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={AccountProfileScreen}
        options={{
          title: 'Cá nhân',
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ color }) => <TabIcon glyph="●" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  // DESIGN.md: 56x56px circular floating (+) button, top: -18 to float above bar
  scanButton: {
    top: -20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '300',
  },
  scanPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});

// Tab glyph icons will be replaced by proper icon assets in Phase 7.
