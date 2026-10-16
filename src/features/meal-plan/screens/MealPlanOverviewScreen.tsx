import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppText, EmptyStateView } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useMealPlan } from '../MealPlanProvider';
import { formatVnd } from '../utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function MealPlanOverviewScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { currentPlan, savedPlans } = useMealPlan();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Hero Banner AI ─────────────────────────────────────────── */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.heroBannerContainer}
          onPress={() => navigation.navigate('MealPlanWizard')}
          accessibilityRole="button"
          accessibilityLabel="Tạo thực đơn AI ngay"
        >
          <Image
            source={images.mealPlanNewAiBanner}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <View style={styles.badge}>
              <AppText variant="caption" color="#FFFFFF">AI SMART MENU</AppText>
            </View>
            <AppText variant="headlineSm" color="#FFFFFF">
              Lập thực đơn thông minh
            </AppText>
            <AppText variant="bodySm" color="rgba(255,255,255,0.85)">
              Cá nhân hóa theo Calo, Macro, Ngân sách & Dị ứng
            </AppText>
          </View>
        </TouchableOpacity>

        {/* ── Active / Current Meal Plan Card ─────────────────────────── */}
        {currentPlan ? (
          <AppCard style={styles.planCard}>
            <View style={styles.planHeader}>
              <View style={styles.flex}>
                <AppText variant="caption" color={theme.colors.brandPrimary}>
                  THỰC ĐƠN HIỆN TẠI
                </AppText>
                <AppText variant="headlineSm">{currentPlan.title}</AppText>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: theme.colors.brandSoftTint }]}>
                <AppText variant="caption" color={theme.colors.brandPrimary}>
                  {currentPlan.days.length} ngày
                </AppText>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <AppText variant="caption" color={theme.colors.textSecondary}>Mục tiêu</AppText>
                <AppText variant="headlineSm">{currentPlan.goal.targetCalories} kcal</AppText>
              </View>
              <View style={styles.metricItem}>
                <AppText variant="caption" color={theme.colors.textSecondary}>Ngân sách</AppText>
                <AppText variant="headlineSm">{formatVnd(currentPlan.goal.dailyBudgetVnd)}/ngày</AppText>
              </View>
              <View style={styles.metricItem}>
                <AppText variant="caption" color={theme.colors.textSecondary}>Dị ứng</AppText>
                <AppText variant="bodySm" color={theme.colors.calorieIn}>
                  {currentPlan.goal.excludedAllergens.length > 0
                    ? currentPlan.goal.excludedAllergens.join(', ')
                    : 'Không có'}
                </AppText>
              </View>
            </View>

            <View style={styles.cardActions}>
              <AppButton
                label="Xem chi tiết thực đơn"
                variant="primary"
                onPress={() => navigation.navigate('MealPlanDetail')}
              />
            </View>
          </AppCard>
        ) : null}

        {/* ── Feature Highlight Banners ───────────────────────────────── */}
        <View style={styles.secondaryBanners}>
          <TouchableOpacity
            style={styles.halfBanner}
            onPress={() => navigation.navigate('MealPlanWizard')}
            activeOpacity={0.85}
          >
            <Image
              source={images.mealPlanRecipeSuggestion}
              style={styles.halfBannerImage}
              resizeMode="cover"
            />
            <View style={styles.halfBannerOverlay}>
              <AppText variant="headlineSm" color="#FFFFFF">Gợi ý món Việt</AppText>
              <AppText variant="caption" color="rgba(255,255,255,0.8)">Chuẩn dinh dưỡng</AppText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.halfBanner}
            onPress={() => navigation.navigate('MealPlanWizard')}
            activeOpacity={0.85}
          >
            <Image
              source={images.mealPlanRecipeScanBanner}
              style={styles.halfBannerImage}
              resizeMode="cover"
            />
            <View style={styles.halfBannerOverlay}>
              <AppText variant="headlineSm" color="#FFFFFF">Tối ưu chi phí</AppText>
              <AppText variant="caption" color="rgba(255,255,255,0.8)">Tiết kiệm mỗi ngày</AppText>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Main CTA ─────────────────────────────────────────────────── */}
        <AppButton
          label="Tạo thực đơn AI mới (3 bước)"
          variant="primary"
          onPress={() => navigation.navigate('MealPlanWizard')}
          accessibilityLabel="Mở wizard tạo thực đơn AI"
        />

        {/* ── Saved Plans Section ─────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <AppText variant="headlineSm">Thực đơn đã lưu</AppText>
          <AppText variant="caption" color={theme.colors.textSecondary}>
            {savedPlans.length} thực đơn
          </AppText>
        </View>

        {savedPlans.length === 0 && !currentPlan ? (
          <EmptyStateView
            title="Chưa có thực đơn nào"
            message="Hãy để AI Kallo thiết kế thực đơn phù hợp nhất với thể trạng và ngân sách của bạn!"
          />
        ) : (
          savedPlans.map((plan) => (
            <AppCard key={plan.id} style={styles.savedCard}>
              <View style={styles.savedCardContent}>
                <AppText variant="headlineSm">{plan.title}</AppText>
                <AppText variant="bodySm" color={theme.colors.textSecondary}>
                  {plan.goal.targetCalories} kcal • {formatVnd(plan.goal.dailyBudgetVnd)}/ngày
                </AppText>
              </View>
              <AppButton
                label="Xem"
                variant="secondary"
                onPress={() => navigation.navigate('MealPlanDetail')}
              />
            </AppCard>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 36 },
  heroBannerContainer: {
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E1B2E',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 18, 30, 0.45)',
    padding: 18,
    justifyContent: 'flex-end',
    gap: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  planCard: {
    gap: 14,
    borderRadius: 18,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  flex: { flex: 1 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(128,128,128,0.15)',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  cardActions: {
    marginTop: 4,
  },
  secondaryBanners: {
    flexDirection: 'row',
    gap: 12,
  },
  halfBanner: {
    flex: 1,
    height: 110,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  halfBannerImage: {
    width: '100%',
    height: '100%',
  },
  halfBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 14, 25, 0.45)',
    padding: 12,
    justifyContent: 'flex-end',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savedCardContent: {
    flex: 1,
    gap: 4,
  },
});
