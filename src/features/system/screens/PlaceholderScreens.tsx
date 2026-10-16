import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppText, CircularProgress, EmptyStateView, ProgressBar } from '@/components/common';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useAuth } from '@/features/auth/AuthProvider';

type HomeProps = BottomTabScreenProps<MainTabParamList, 'Home'>;
type ProfileProps = BottomTabScreenProps<MainTabParamList, 'Profile'>;
type ScanProps = NativeStackScreenProps<RootStackParamList, 'AIScanPlaceholder'>;
type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

function openShowcase(navigation: HomeProps['navigation'] | ProfileProps['navigation']) {
  (navigation.getParent() as RootNavigation | undefined)?.navigate('ComponentShowcase');
}

export function HomeScreen({ navigation }: HomeProps) {
  const theme = useTheme();
  return <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
    <ScrollView contentContainerStyle={styles.content}>
      <Image source={images.homeHeader} style={styles.header} resizeMode="cover" accessibilityLabel="Kallo" />
      <AppText variant="title">Chào mừng đến Kallo</AppText>
      <AppCard>
        <AppText variant="heading">Tổng quan hôm nay</AppText>
        <View style={styles.row}>
          <CircularProgress value={0.62} label="Calo" />
          <View style={styles.flex}>
            <AppText color={theme.colors.textMuted}>Còn lại</AppText>
            <AppText variant="display">860 kcal</AppText>
            <ProgressBar value={0.62} color={theme.colors.calorieIn} />
          </View>
        </View>
      </AppCard>
      <AppButton label="Mở Component Showcase" variant="outline" onPress={() => openShowcase(navigation)} />
    </ScrollView>
  </SafeAreaView>;
}

function Screen({ title, message }: { title: string; message: string }) {
  const theme = useTheme();
  return <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
    <View style={styles.center}>
      <AppText variant="title">{title}</AppText>
      <AppText color={theme.colors.textMuted} align="center">{message}</AppText>
      <EmptyStateView title="Chưa có dữ liệu" message="Tính năng đang được chuẩn bị." />
    </View>
  </SafeAreaView>;
}

export function DiaryScreen() { return <Screen title="Nhật ký" message="Nhật ký dinh dưỡng sẽ được triển khai ở Phase 3." />; }
export function ReportScreen() { return <Screen title="Thống kê" message="Báo cáo và biểu đồ sẽ được triển khai ở Phase 5." />; }

export function ProfileScreen({ navigation }: ProfileProps) {
  const theme = useTheme();
  const { signOut } = useAuth();
  const root = navigation.getParent() as RootNavigation | undefined;
  return <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
    <ScrollView contentContainerStyle={styles.content}>
      <AppText variant="title">Cá nhân</AppText>
      <AppCard>
        <AppText variant="heading">Hồ sơ Kallo</AppText>
        <AppText color={theme.colors.textMuted}>Thiết lập sức khỏe, mục tiêu và tùy chọn ứng dụng.</AppText>
      </AppCard>
      <AppButton label="Chuỗi ngày Kallo Streak 🔥" variant="secondary" onPress={() => root?.navigate('StreakDetail')} />
      <AppButton label="Huy hiệu & Thử thách 🏆" variant="secondary" onPress={() => root?.navigate('BadgesChallenges')} />
      <AppButton label="Bảng xếp hạng bạn bè 👥" variant="secondary" onPress={() => root?.navigate('FriendsLeaderboard')} />
      <AppButton label="Trợ lý Kallo AI 🤖" variant="secondary" onPress={() => root?.navigate('NutritionChat')} />
      <AppButton label="Kế hoạch Thực đơn AI 📋" variant="secondary" onPress={() => root?.navigate('MealPlanOverview')} />
      <AppButton label="Mở Component Showcase" variant="outline" onPress={() => openShowcase(navigation)} />
      <AppButton label="Đăng xuất" variant="outline" onPress={() => { void signOut(); }} />
    </ScrollView>
  </SafeAreaView>;
}

export function ScanTabScreen() { return <Screen title="AI Meal Scan" message="Camera nhận diện món ăn sẽ có ở Phase 4." />; }

export function ScanPlaceholderScreen({ navigation }: ScanProps) {
  const theme = useTheme();
  return <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
    <View style={styles.center}>
      <Image source={images.mealScanBackground} style={styles.scanImage} resizeMode="contain" accessibilityLabel="Minh họa AI Meal Scan" />
      <AppText variant="title" align="center">AI Meal Scan</AppText>
      <AppText color={theme.colors.textMuted} align="center">Camera nhận diện món ăn sẽ có ở Phase 4.</AppText>
      <AppButton label="Đóng" variant="outline" onPress={navigation.goBack} />
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1 }, content: { padding: 20, gap: 18 }, header: { width: '100%', height: 120, borderRadius: 18 }, row: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 16 }, flex: { flex: 1, gap: 8 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 }, scanImage: { width: 220, height: 180 } });

