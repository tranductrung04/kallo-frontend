// ─── HomeDashboardScreen — Nocturne & Daylight Vitality ──────────────────────
// DESIGN.md Phase 4:
//   canvasBase background, headlineMd greeting, QuickUtilityGrid
//   CalorieSummaryCard with brandPrimary ring
//   WaterTrackerCard, WeightTrackerCard
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppText, QuickUtilityGrid } from '@/components/common';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useNutrition } from '../NutritionProvider';
import { useActivity } from '@/features/activity';
import { useGamification } from '@/features/gamification';
import { CalorieSummaryCard, WaterTrackerCard, WeightTrackerCard } from '../components';
import { todayKey } from '../utils';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;
type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export function HomeDashboardScreen({ navigation }: Props) {
  const theme = useTheme();
  const { state, getSummary, addWater, addWeight, setWalkthroughSeen } = useNutrition();
  const { getTotalCaloriesBurnedForDate, getTotalStepsForDate } = useActivity();
  const { streak } = useGamification();
  const date = todayKey();
  const caloriesBurned = getTotalCaloriesBurnedForDate(date);
  const totalSteps = getTotalStepsForDate(date);
  const summary = getSummary(date, caloriesBurned);
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  useEffect(() => {
    if (!state.walkthroughSeen) setShowWalkthrough(true);
  }, [state.walkthroughSeen]);

  const root = navigation.getParent() as RootNavigation | undefined;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* ── Hero Header ─────────────────────────────────────────────── */}
        <View style={styles.hero}>
          <Image
            source={images.homeHeader}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
            accessibilityLabel="Kallo header"
          />
          {/* Semi-transparent overlay with indigo tint matching brand */}
          <View style={[styles.heroShade, { backgroundColor: 'rgba(18, 17, 26, 0.35)' }]}>
            <View style={styles.greeting}>
              <Image
                source={images.avatar}
                style={styles.avatar}
                accessibilityLabel="Ảnh đại diện"
              />
              <View>
                <AppText variant="bodySm" color="rgba(255,255,255,0.75)">Chào bạn 👋</AppText>
                <AppText variant="headlineSm" color="#FFFFFF">Hôm nay khỏe không?</AppText>
              </View>
            </View>
            <View style={styles.headerRightRow}>
              {/* Streak badge */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Chuỗi ${streak.currentStreak} ngày, bấm để xem chi tiết`}
                style={[styles.streakPill, { backgroundColor: 'rgba(255, 159, 67, 0.25)' }]}
                onPress={() => root?.navigate('StreakDetail')}
              >
                <AppText variant="caption" color="#FF9F43">
                  🔥 {streak.currentStreak} ngày
                </AppText>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Mở thông báo"
                style={styles.notification}
                onPress={() => root?.navigate('NotificationCenter')}
              >
                <AppText color="#FFFFFF" variant="headlineMd">🔔</AppText>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ── Quick Utility Grid (Search / Barcode / AI Scan / Voice) ─ */}
        <QuickUtilityGrid
          onSearch={() => root?.navigate('FoodSearch', { date, meal: 'snack' })}
          onBarcode={() => root?.navigate('BarcodeScanner', { date, meal: 'snack' })}
          onAIScan={() => root?.navigate('AIMealScan', { date, meal: 'snack' })}
          onVoice={() => root?.navigate('VoiceLogModal', { date, meal: 'snack' })}
        />

        {/* ── Phase 6 AI Features & Community ────────────────────────── */}
        <AppCard style={styles.aiCard}>
          <View style={styles.aiCardHeader}>
            <View>
              <AppText variant="headlineSm">Trợ lý AI & Thực đơn thông minh</AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Cá nhân hóa chế độ dinh dưỡng và kết nối cộng đồng
              </AppText>
            </View>
          </View>
          <View style={styles.aiActionsRow}>
            <AppButton
              label="Thực đơn AI"
              variant="primary"
              onPress={() => root?.navigate('MealPlanOverview')}
              style={styles.aiActionBtn}
            />
            <AppButton
              label="Chat với AI"
              variant="secondary"
              onPress={() => root?.navigate('NutritionChat')}
              style={styles.aiActionBtn}
            />
          </View>
          <View style={styles.aiActionsRow}>
            <AppButton
              label="Bảng xếp hạng"
              variant="outline"
              onPress={() => root?.navigate('FriendsLeaderboard')}
              style={styles.aiActionBtn}
            />
            <AppButton
              label="Huy hiệu & Thử thách"
              variant="outline"
              onPress={() => root?.navigate('BadgesChallenges')}
              style={styles.aiActionBtn}
            />
          </View>
        </AppCard>

        {/* ── Calorie & Macro Summary ─────────────────────────────────── */}
        <CalorieSummaryCard summary={summary} />

        {/* ── Water Tracker ─────────────────────────────────────────── */}
        <WaterTrackerCard
          amountMl={summary.waterMl}
          goalMl={summary.waterGoalMl}
          onAdd={(amount) => addWater(date, amount)}
        />

        {/* ── Weight Tracker ────────────────────────────────────────── */}
        <WeightTrackerCard
          weightKg={summary.weightKg}
          targetKg={summary.targetWeightKg}
          onSave={(weight) => addWeight(date, weight)}
        />

        {/* ── Activity Quick Actions ────────────────────────────────── */}
        <AppCard style={styles.actions}>
          <AppText variant="headlineSm">Ghi nhanh & Hoạt động</AppText>
          <AppText variant="bodySm" color={theme.colors.textSecondary}>
            {totalSteps > 0 ? `${totalSteps.toLocaleString()} bước hôm nay` : 'Chưa có dữ liệu bước chân'}
          </AppText>
          <View style={styles.actionRow}>
            <AppButton
              label="Vận động"
              variant="secondary"
              onPress={() => root?.navigate('ActivityTracker', { date })}
              accessibilityLabel="Ghi nhận bài tập và xem bước chân"
              style={styles.actionBtn}
            />
            <AppButton
              label="Nhật ký"
              variant="secondary"
              onPress={() => navigation.navigate('Diary')}
              accessibilityLabel="Mở nhật ký dinh dưỡng"
              style={styles.actionBtn}
            />
          </View>
        </AppCard>

        {/* ── First-time Walkthrough ────────────────────────────────── */}
        {showWalkthrough ? (
          <AppCard style={[styles.walkthrough, { backgroundColor: theme.colors.brandSoftTint }]}>
            <Image
              source={images.walkthroughArrowTop01}
              style={styles.arrow}
              accessibilityLabel="Mũi tên hướng dẫn"
            />
            <AppText variant="headlineSm">Bắt đầu theo dõi mỗi ngày</AppText>
            <AppText variant="bodyMd" color={theme.colors.textSecondary}>
              Ghi món ăn, nước uống và cân nặng để Kallo cập nhật tiến độ cho bạn.
            </AppText>
            <AppButton
              label="Đã hiểu"
              variant="secondary"
              onPress={() => { setShowWalkthrough(false); setWalkthroughSeen(); }}
            />
          </AppCard>
        ) : null}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16, gap: 16, paddingBottom: 32 },
  hero: { height: 148, borderRadius: 16, overflow: 'hidden' },
  heroShade: { flex: 1, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  notification: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  actions: { gap: 12 },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1 },
  headerRightRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 159, 67, 0.4)' },
  aiCard: { gap: 12 },
  aiCardHeader: { gap: 2 },
  aiActionsRow: { flexDirection: 'row', gap: 10 },
  aiActionBtn: { flex: 1 },
  walkthrough: { gap: 10, borderRadius: 16 },
  arrow: { width: 48, height: 48, resizeMode: 'contain', alignSelf: 'flex-end' },
});
