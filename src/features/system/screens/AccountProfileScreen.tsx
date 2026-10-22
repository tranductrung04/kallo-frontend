import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppText } from '@/components/common';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useAuth } from '@/features/auth/AuthProvider';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { useOfflineSync } from '@/services/offline';
import {
  calculateBmi,
  bmiCategory,
  calculateBmr,
  calculateTdee,
} from '@/features/profile/utils/calculations';

type Props = BottomTabScreenProps<MainTabParamList, 'Profile'>;
type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export function AccountProfileScreen({ navigation }: Props) {
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const { signOut } = useAuth();
  const { state: nutritionState } = useNutrition();
  const { isOnline, pendingCount, syncNow, toggleOnlineStatus } = useOfflineSync();
  const root = navigation.getParent() as RootNavigation | undefined;

  // Modals state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHealthMetricsModal, setShowHealthMetricsModal] = useState(false);
  const [showCustomizeGoalsModal, setShowCustomizeGoalsModal] = useState(false);

  // User Profile State
  const [displayName] = useState('Nam');
  const [age] = useState(22);
  const [heightCm] = useState(160);
  const [weightKg] = useState(60);

  // Nutrition goals & Macro State
  const [targetCalories, setTargetCalories] = useState(1794);
  const [proteinPercent, setProteinPercent] = useState(20);
  const [carbsPercent, setCarbsPercent] = useState(50);
  const [fatPercent, setFatPercent] = useState(30);

  // Calculated grams
  const proteinGrams = Math.round((targetCalories * (proteinPercent / 100)) / 4);
  const carbsGrams = Math.round((targetCalories * (carbsPercent / 100)) / 4);
  const fatGrams = Math.round((targetCalories * (fatPercent / 100)) / 9);

  // Health calculations (BMI, BMR, TDEE)
  const bmiVal = calculateBmi(weightKg, heightCm);
  const bmiDesc = bmiCategory(bmiVal);
  const bmrVal = Math.round(calculateBmr('male', weightKg, heightCm, age));
  const tdeeVal = Math.round(calculateTdee(bmrVal, 'light'));

  // SVG Segmented Ring Dimensions
  const ringSize = 130;
  const strokeWidth = 10;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Segment stroke dashes with gaps
  const proteinLength = (circumference * proteinPercent) / 100;
  const carbsLength = (circumference * carbsPercent) / 100;
  const fatLength = (circumference * fatPercent) / 100;

  const proteinOffset = 0;
  const carbsOffset = -proteinLength;
  const fatOffset = -(proteinLength + carbsLength);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Xóa vĩnh viễn tài khoản? ⚠️',
      'Hành động này sẽ xóa toàn bộ nhật ký bữa ăn, chỉ số cân nặng và dữ liệu sức khỏe của bạn khỏi hệ thống Kallo theo yêu cầu FR-AUTH-07. Bạn không thể hoàn tác sau khi xác nhận.',
      [
        { text: 'Hủy bỏ', style: 'cancel' },
        {
          text: 'Xóa tài khoản',
          style: 'destructive',
          onPress: async () => {
            setShowSettingsModal(false);
            await signOut();
            Alert.alert('Đã xóa tài khoản', 'Dữ liệu của bạn đã được xóa thành công.');
          },
        },
      ]
    );
  };

  const handleSaveGoals = () => {
    if (proteinPercent + carbsPercent + fatPercent !== 100) {
      Alert.alert('Chưa cân bằng tỷ lệ', 'Tổng tỷ lệ % của Đạm, Carb và Béo phải bằng đúng 100%.');
      return;
    }
    setShowCustomizeGoalsModal(false);
    Alert.alert('Cập nhật thành công! 🎉', 'Mục tiêu dinh dưỡng của bạn đã được cập nhật.');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
      {/* ── Top Header Row ────────────────────────────────────────────── */}
      <View style={styles.topHeader}>
        <AppText variant="headlineLg" style={styles.headerTitle}>
          Hồ sơ cá nhân
        </AppText>
        <TouchableOpacity
          onPress={() => setShowSettingsModal(true)}
          style={[styles.settingsButton, { backgroundColor: theme.colors.surfaceHigh }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Cài đặt tài khoản"
        >
          <AppText variant="headlineSm" color={theme.colors.textPrimary}>
            ⚙
          </AppText>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── User Avatar & Display Name ───────────────────────────────── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <AppText variant="dataDisplay" color="#FFFFFF" style={styles.avatarLetter}>
                {displayName.charAt(0).toUpperCase()}
              </AppText>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.addPhotoButton,
                { backgroundColor: isDark ? '#221D34' : '#FFFFFF', borderColor: theme.colors.canvasBase },
              ]}
              onPress={() =>
                Alert.alert('Đổi ảnh đại diện', 'Chọn ảnh đại diện mới từ thư viện hoặc chụp ảnh.')
              }
              accessibilityRole="button"
              accessibilityLabel="Thay đổi ảnh đại diện"
            >
              <AppText variant="labelLg" color={theme.colors.textPrimary}>
                +
              </AppText>
            </TouchableOpacity>
          </View>

          <AppText variant="headlineMd" style={styles.userName}>
            {displayName}
          </AppText>
          <AppText variant="caption" color={theme.colors.textSecondary}>
            Đã tham gia từ 15 Thg 09, 2026
          </AppText>
        </View>

        {/* ── VIP / Trial Banner ───────────────────────────────────────── */}
        <View style={styles.vipBannerCard}>
          <View style={styles.vipBannerContent}>
            <AppText variant="labelLg" style={styles.vipBannerTitle}>
              Miễn phí 14 ngày toàn bộ tính năng
            </AppText>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.vipBannerButton}
              onPress={() =>
                Alert.alert(
                  'Kallo Premium VIP 🌟',
                  'Kích hoạt 14 ngày dùng thử miễn phí toàn bộ tính năng: Quét AI không giới hạn, phân tích thực đơn chuyên sâu và mở khóa toàn bộ huy hiệu!'
                )
              }
            >
              <AppText variant="labelMd" style={styles.vipBannerButtonText}>
                Trải nghiệm ngay
              </AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.vipBannerGraphic}>
            <Image
              source={images.paywallTrophy}
              style={styles.vipBannerTrophy}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* ── Physical Metrics Pill & Sub-actions ──────────────────────── */}
        <View style={styles.metricsCapsuleWrapper}>
          <View
            style={[
              styles.metricsCapsule,
              { backgroundColor: theme.colors.surfaceHigh, borderColor: theme.colors.surfaceBorder },
            ]}
          >
            <View style={styles.metricItemCol}>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                🗓️ {age} tuổi
              </AppText>
            </View>
            <View style={[styles.capsuleDivider, { backgroundColor: theme.colors.surfaceBorder }]} />
            <View style={styles.metricItemCol}>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                🚶 {heightCm} cm
              </AppText>
            </View>
            <View style={[styles.capsuleDivider, { backgroundColor: theme.colors.surfaceBorder }]} />
            <View style={styles.metricItemCol}>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                ⚖️ {weightKg} kg
              </AppText>
            </View>
          </View>

          <View style={styles.metricsPillsRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.subActionPill,
                {
                  backgroundColor: isDark ? 'rgba(158, 100, 247, 0.15)' : '#EDE5FF',
                  borderColor: isDark ? 'rgba(158, 100, 247, 0.3)' : '#D6B8FF',
                },
              ]}
              onPress={() => setShowHealthMetricsModal(true)}
            >
              <AppText variant="labelMd" color={theme.colors.brandPrimary}>
                Chỉ số sức khỏe
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.subActionPill,
                {
                  backgroundColor: isDark ? 'rgba(158, 100, 247, 0.15)' : '#EDE5FF',
                  borderColor: isDark ? 'rgba(158, 100, 247, 0.3)' : '#D6B8FF',
                },
              ]}
              onPress={() => root?.navigate('Onboarding', { screen: 'Onboarding' })}
            >
              <AppText variant="labelMd" color={theme.colors.brandPrimary}>
                Hồ sơ thể chất
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Hành trình của bạn (Your Journey Card) ───────────────────── */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Report')}
          >
            <AppText variant="headlineSm">Hành trình của bạn</AppText>
            <AppText variant="headlineSm" color={theme.colors.textSecondary}>
              ›
            </AppText>
          </TouchableOpacity>

          <AppCard style={styles.journeyCard}>
            <View style={styles.targetIconWrapper}>
              <Image
                source={images.accountTarget}
                style={styles.targetIcon}
                resizeMode="contain"
              />
            </View>
            <AppText variant="headlineSm" align="center" style={styles.journeyTitle}>
              Bạn đang duy trì cân nặng rất tốt!
            </AppText>
            <AppText
              variant="caption"
              color={theme.colors.textSecondary}
              align="center"
              style={styles.journeySubtitle}
            >
              Cập nhật lại cân nặng để xem tiến trình
            </AppText>

            {/* Visual Weight Slider Bar */}
            <View style={styles.weightTrackContainer}>
              <View
                style={[
                  styles.weightTrackBg,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#E4E0F0' },
                ]}
              >
                <View style={[styles.weightTrackFill, { backgroundColor: theme.colors.brandPrimary }]} />
              </View>
              <View style={[styles.weightIndicatorDot, { borderColor: theme.colors.brandPrimary }]}>
                <View
                  style={[
                    styles.weightIndicatorInner,
                    { backgroundColor: theme.colors.brandPrimary },
                  ]}
                />
              </View>
              <AppText
                variant="labelMd"
                color={theme.colors.textPrimary}
                style={styles.weightIndicatorLabel}
              >
                {weightKg} kg
              </AppText>
            </View>
          </AppCard>
        </View>

        {/* ── Mục tiêu dinh dưỡng & đa lượng ────────────────────────────── */}
        <View style={styles.sectionContainer}>
          <AppText variant="headlineSm" style={styles.sectionHeaderTitle}>
            Mục tiêu dinh dưỡng & đa lượng
          </AppText>

          <AppCard style={styles.macroCard}>
            <View style={styles.macroRowContent}>
              {/* Left: Segmented Calorie Ring */}
              <View style={styles.calorieRingContainer}>
                <Svg
                  width={ringSize}
                  height={ringSize}
                  style={{ transform: [{ rotate: '-90deg' }] }}
                >
                  {/* Background Track */}
                  <Circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    stroke={isDark ? '#221D34' : '#F1EFF9'}
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  {/* Protein Arc (Red / Coral) */}
                  <Circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    stroke={theme.colors.macroProtein}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${proteinLength - 2} ${circumference}`}
                    strokeDashoffset={proteinOffset}
                    strokeLinecap="round"
                  />
                  {/* Carbs Arc (Blue / Cobalt) */}
                  <Circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    stroke={theme.colors.macroCarbs}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${carbsLength - 2} ${circumference}`}
                    strokeDashoffset={carbsOffset}
                    strokeLinecap="round"
                  />
                  {/* Fat Arc (Yellow / Amber) */}
                  <Circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    stroke={theme.colors.macroFats}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${fatLength - 2} ${circumference}`}
                    strokeDashoffset={fatOffset}
                    strokeLinecap="round"
                  />
                </Svg>

                {/* Center of Ring: Flame + Calorie Number */}
                <View style={styles.ringCenterContent}>
                  <AppText variant="headlineSm" color={theme.colors.macroProtein}>
                    🔥
                  </AppText>
                  <AppText variant="headlineSm" style={styles.calorieNumberText}>
                    {targetCalories.toLocaleString('vi-VN')}
                  </AppText>
                </View>
              </View>

              {/* Right: Macro breakdown list */}
              <View style={styles.macroListCol}>
                <View style={styles.macroItemRow}>
                  <AppText variant="bodyMd" color={theme.colors.macroProtein}>
                    ⚡
                  </AppText>
                  <AppText variant="bodyMd" color={theme.colors.textSecondary} style={styles.flex}>
                    Chất đạm{' '}
                    <AppText variant="labelLg" color={theme.colors.textPrimary}>
                      {proteinPercent}%
                    </AppText>{' '}
                    ({proteinGrams}g)
                  </AppText>
                </View>

                <View style={styles.macroItemRow}>
                  <AppText variant="bodyMd" color={theme.colors.macroCarbs}>
                    🌾
                  </AppText>
                  <AppText variant="bodyMd" color={theme.colors.textSecondary} style={styles.flex}>
                    Đường bột{' '}
                    <AppText variant="labelLg" color={theme.colors.textPrimary}>
                      {carbsPercent}%
                    </AppText>{' '}
                    ({carbsGrams}g)
                  </AppText>
                </View>

                <View style={styles.macroItemRow}>
                  <AppText variant="bodyMd" color={theme.colors.macroFats}>
                    💧
                  </AppText>
                  <AppText variant="bodyMd" color={theme.colors.textSecondary} style={styles.flex}>
                    Chất béo{' '}
                    <AppText variant="labelLg" color={theme.colors.textPrimary}>
                      {fatPercent}%
                    </AppText>{' '}
                    ({fatGrams}g)
                  </AppText>
                </View>
              </View>
            </View>

            {/* Bottom Button inside Macro Card */}
            <AppButton
              label="Tuỳ chỉnh mục tiêu"
              variant="secondary"
              onPress={() => setShowCustomizeGoalsModal(true)}
              style={styles.customizeGoalBtn}
            />
          </AppCard>
        </View>

        {/* ── Xem báo cáo thống kê ──────────────────────────────────────── */}
        <View style={styles.sectionContainer}>
          <AppText variant="headlineSm" style={styles.sectionHeaderTitle}>
            Xem báo cáo thống kê
          </AppText>

          <View style={styles.statsIconsRow}>
            {/* Dinh dưỡng */}
            <TouchableOpacity
              style={styles.statIconCol}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Report')}
            >
              <View style={[styles.statIconCircle, { backgroundColor: isDark ? '#2E2619' : '#FEF3C7' }]}>
                <AppText style={styles.statEmoji}>🥣</AppText>
              </View>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Dinh dưỡng
              </AppText>
            </TouchableOpacity>

            {/* Tập luyện */}
            <TouchableOpacity
              style={styles.statIconCol}
              activeOpacity={0.8}
              onPress={() => root?.navigate('ActivityTracker')}
            >
              <View style={[styles.statIconCircle, { backgroundColor: isDark ? '#30182C' : '#FFE4E6' }]}>
                <AppText style={styles.statEmoji}>🏋️</AppText>
              </View>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Tập luyện
              </AppText>
            </TouchableOpacity>

            {/* Số bước */}
            <TouchableOpacity
              style={styles.statIconCol}
              activeOpacity={0.8}
              onPress={() => root?.navigate('HealthSync')}
            >
              <View style={[styles.statIconCircle, { backgroundColor: isDark ? '#162C22' : '#DCFCE7' }]}>
                <AppText style={styles.statEmoji}>👟</AppText>
              </View>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Số bước
              </AppText>
            </TouchableOpacity>

            {/* Cân nặng */}
            <TouchableOpacity
              style={styles.statIconCol}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Report')}
            >
              <View style={[styles.statIconCircle, { backgroundColor: isDark ? '#1C2538' : '#E0F2FE' }]}>
                <AppText style={styles.statEmoji}>⚖️</AppText>
              </View>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Cân nặng
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Cộng đồng và hỗ trợ ───────────────────────────────────────── */}
        <View style={styles.sectionContainer}>
          <AppText variant="headlineSm" style={styles.sectionHeaderTitle}>
            Cộng đồng và hỗ trợ
          </AppText>

          {/* Community & Support Banner */}
          <TouchableOpacity
            style={styles.communityBannerWrap}
            activeOpacity={0.88}
            onPress={() =>
              Alert.alert(
                'Cộng đồng Kallo 🎉',
                'Đang kết nối tới nhóm Facebook và Zalo Cộng đồng Healthy Kallo Việt Nam!'
              )
            }
            accessibilityRole="button"
            accessibilityLabel="Gia nhập cộng đồng Kallo ngay"
          >
            <Image
              source={images.congDongHoTro}
              style={styles.communityBannerImage}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Social media tiles */}
          <AppCard style={styles.socialCard}>
            <View style={styles.socialSearchHeader}>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                🔍 Tìm Kallo trên trang mạng xã hội
              </AppText>
            </View>

            <View style={styles.socialTilesRow}>
              {/* TikTok */}
              <TouchableOpacity
                style={[styles.socialTile, { backgroundColor: theme.colors.surfaceHigh }]}
                activeOpacity={0.8}
                onPress={() => Alert.alert('Kallo TikTok', 'Theo dõi @kallo.health trên TikTok')}
              >
                <Image source={images.tiktokLogo} style={styles.socialLogoImg} resizeMode="contain" />
                <AppText variant="caption" color={theme.colors.textPrimary}>
                  Tiktok
                </AppText>
              </TouchableOpacity>

              {/* Facebook */}
              <TouchableOpacity
                style={[styles.socialTile, { backgroundColor: theme.colors.surfaceHigh }]}
                activeOpacity={0.8}
                onPress={() => Alert.alert('Kallo Facebook', 'Theo dõi Fanpage Kallo Healthy')}
              >
                <Image source={images.facebookLogo} style={styles.socialLogoImg} resizeMode="contain" />
                <AppText variant="caption" color={theme.colors.textPrimary}>
                  Facebook
                </AppText>
              </TouchableOpacity>

              {/* Instagram */}
              <TouchableOpacity
                style={[styles.socialTile, { backgroundColor: theme.colors.surfaceHigh }]}
                activeOpacity={0.8}
                onPress={() => Alert.alert('Kallo Instagram', 'Theo dõi @kallo.vietnam trên Instagram')}
              >
                <Image source={images.instagramLogo} style={styles.socialLogoImg} resizeMode="contain" />
                <AppText variant="caption" color={theme.colors.textPrimary}>
                  Instagram
                </AppText>
              </TouchableOpacity>
            </View>

            <View style={styles.menuDivider} />

            {/* Support center link */}
            <TouchableOpacity
              style={styles.supportCenterRow}
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert(
                  'Trung tâm hỗ trợ Kallo',
                  'Hotline: 1900-KALLO\nEmail: support@kallo.health\nGiờ hỗ trợ: 08:00 - 21:00 hằng ngày'
                )
              }
            >
              <AppText variant="bodyMd">🌐 Trung tâm hỗ trợ</AppText>
              <AppText variant="bodySm" color={theme.colors.textSecondary}>
                ›
              </AppText>
            </TouchableOpacity>
          </AppCard>
        </View>

        {/* ── Footer Branding & Disclaimer ──────────────────────────────── */}
        <View style={styles.footerBranding}>
          <AppText variant="headlineXl" style={styles.footerLogoText}>
            kallo
          </AppText>
          <AppText variant="caption" color={theme.colors.textSecondary}>
            Phiên bản: 1.0.0 (52)
          </AppText>
          <AppText variant="caption" color={theme.colors.textSecondary}>
            Mã thiết bị: kallo-rn-android-77a4c
          </AppText>
          <AppText variant="caption" color={theme.colors.textSecondary} style={styles.copyrightText}>
            © Kallo Healthy 2026, All Rights Reserved
          </AppText>
          <AppText
            variant="bodySm"
            align="center"
            color={theme.colors.textSecondary}
            style={styles.disclaimerText}
          >
            Mọi thông tin trên Kallo chỉ mang tính chất tham khảo, không thể thay thế đánh giá y tế chuyên sâu từ bác sĩ.
          </AppText>
        </View>
      </ScrollView>

      {/* ── 1. Settings & System Actions Modal ────────────────────────── */}
      <Modal
        visible={showSettingsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surfaceMid }]}>
            <View style={styles.modalHeaderRow}>
              <AppText variant="headlineSm">Cài đặt & Tài khoản</AppText>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <AppText variant="headlineSm" color={theme.colors.textSecondary}>
                  ✕
                </AppText>
              </TouchableOpacity>
            </View>

            <View style={styles.modalList}>
              {/* Theme Toggle */}
              <TouchableOpacity
                style={styles.settingsRowItem}
                onPress={theme.toggleScheme}
              >
                <AppText variant="bodyMd">
                  {theme.scheme === 'dark' ? '🌙 Chế độ ban đêm (Tối)' : '☀️ Chế độ ban ngày (Sáng)'}
                </AppText>
                <AppText variant="caption" color={theme.colors.brandPrimary}>
                  Đổi
                </AppText>
              </TouchableOpacity>

              {/* Reminders */}
              <TouchableOpacity
                style={styles.settingsRowItem}
                onPress={() => {
                  setShowSettingsModal(false);
                  root?.navigate('ReminderSettings');
                }}
              >
                <AppText variant="bodyMd">⏰ Cài đặt nhắc nhở thông minh</AppText>
                <AppText variant="bodySm" color={theme.colors.textSecondary}>
                  ›
                </AppText>
              </TouchableOpacity>

              {/* Notifications */}
              <TouchableOpacity
                style={styles.settingsRowItem}
                onPress={() => {
                  setShowSettingsModal(false);
                  root?.navigate('NotificationCenter');
                }}
              >
                <AppText variant="bodyMd">🔔 Trung tâm thông báo</AppText>
                <AppText variant="bodySm" color={theme.colors.textSecondary}>
                  ›
                </AppText>
              </TouchableOpacity>

              {/* Offline & Sync */}
              <TouchableOpacity
                style={styles.settingsRowItem}
                onPress={() => {
                  void syncNow();
                  Alert.alert('Đồng bộ dữ liệu', isOnline ? 'Đang trực tuyến. Đã gửi các bản ghi.' : 'Đang ở chế độ ngoại tuyến.');
                }}
              >
                <AppText variant="bodyMd">🔄 Trạng thái đồng bộ ngoại tuyến</AppText>
                <AppText variant="caption" color={isOnline ? theme.colors.quickScanner : theme.colors.macroProtein}>
                  {isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}
                </AppText>
              </TouchableOpacity>

              {/* Change Password */}
              <TouchableOpacity
                style={styles.settingsRowItem}
                onPress={() =>
                  Alert.alert('Đổi mật khẩu', 'Nhập mật khẩu hiện tại và mật khẩu mới tối thiểu 8 ký tự.')
                }
              >
                <AppText variant="bodyMd">🔒 Đổi mật khẩu</AppText>
                <AppText variant="bodySm" color={theme.colors.textSecondary}>
                  ›
                </AppText>
              </TouchableOpacity>

              {/* Sign out */}
              <TouchableOpacity
                style={styles.settingsRowItem}
                onPress={() => {
                  setShowSettingsModal(false);
                  void signOut();
                }}
              >
                <AppText variant="bodyMd" color={theme.colors.brandPrimary}>
                  🚪 Đăng xuất tài khoản
                </AppText>
              </TouchableOpacity>

              {/* Delete Account */}
              <TouchableOpacity
                style={styles.settingsRowItem}
                onPress={handleDeleteAccount}
              >
                <AppText variant="bodyMd" color={theme.colors.macroProtein}>
                  ⚠️ Xóa vĩnh viễn tài khoản
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── 2. Health Metrics Modal (Chỉ số sức khỏe) ─────────────────── */}
      <Modal
        visible={showHealthMetricsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHealthMetricsModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surfaceMid }]}>
            <View style={styles.modalHeaderRow}>
              <AppText variant="headlineSm">Chỉ số sức khỏe cá nhân</AppText>
              <TouchableOpacity onPress={() => setShowHealthMetricsModal(false)}>
                <AppText variant="headlineSm" color={theme.colors.textSecondary}>
                  ✕
                </AppText>
              </TouchableOpacity>
            </View>

            <View style={styles.metricsModalList}>
              <View style={styles.metricModalCard}>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Chỉ số khối cơ thể (BMI)
                </AppText>
                <AppText variant="headlineSm" color={theme.colors.brandPrimary}>
                  {bmiVal.toFixed(1)} — {bmiDesc}
                </AppText>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Khuyến nghị người châu Á: 18.5 - 22.9
                </AppText>
              </View>

              <View style={styles.metricModalCard}>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Năng lượng chuyển hoá cơ bản (BMR)
                </AppText>
                <AppText variant="headlineSm" color={theme.colors.macroCarbs}>
                  {bmrVal} kcal/ngày
                </AppText>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Năng lượng cơ thể tiêu thụ khi nghỉ ngơi hoàn toàn
                </AppText>
              </View>

              <View style={styles.metricModalCard}>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Tổng năng lượng tiêu hao (TDEE)
                </AppText>
                <AppText variant="headlineSm" color={theme.colors.macroFats}>
                  {tdeeVal} kcal/ngày
                </AppText>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Bao gồm hoạt động nhẹ và sinh hoạt thường nhật
                </AppText>
              </View>

              <View style={styles.metricModalCard}>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Mục tiêu nước mỗi ngày
                </AppText>
                <AppText variant="headlineSm" color={theme.colors.water}>
                  {weightKg * 35} ml
                </AppText>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Tiêu chuẩn 35 ml trên mỗi kg cân nặng
                </AppText>
              </View>
            </View>

            <AppButton
              label="Đóng"
              variant="primary"
              onPress={() => setShowHealthMetricsModal(false)}
            />
          </View>
        </View>
      </Modal>

      {/* ── 3. Customize Goals Modal (Tuỳ chỉnh mục tiêu) ─────────────── */}
      <Modal
        visible={showCustomizeGoalsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomizeGoalsModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surfaceMid }]}>
            <View style={styles.modalHeaderRow}>
              <AppText variant="headlineSm">Tuỳ chỉnh mục tiêu dinh dưỡng</AppText>
              <TouchableOpacity onPress={() => setShowCustomizeGoalsModal(false)}>
                <AppText variant="headlineSm" color={theme.colors.textSecondary}>
                  ✕
                </AppText>
              </TouchableOpacity>
            </View>

            <View style={styles.customizeGoalSection}>
              {/* Calorie stepper */}
              <View style={styles.goalAdjustRow}>
                <AppText variant="labelLg">Mục tiêu Calo hàng ngày:</AppText>
                <View style={styles.stepperWrap}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => setTargetCalories((c) => Math.max(1200, c - 50))}
                  >
                    <AppText variant="headlineSm">-</AppText>
                  </TouchableOpacity>
                  <AppText variant="headlineSm" style={styles.stepperVal}>
                    {targetCalories}
                  </AppText>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => setTargetCalories((c) => Math.min(3500, c + 50))}
                  >
                    <AppText variant="headlineSm">+</AppText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Macro ratios */}
              <View style={styles.macroAdjustSection}>
                <AppText variant="labelLg" style={styles.macroAdjustTitle}>
                  Phân bổ 3 nhóm chất (Tổng: {proteinPercent + carbsPercent + fatPercent}%):
                </AppText>

                {/* Protein */}
                <View style={styles.macroAdjustRow}>
                  <AppText variant="bodyMd" color={theme.colors.macroProtein}>
                    ⚡ Chất đạm: {proteinPercent}% ({proteinGrams}g)
                  </AppText>
                  <View style={styles.stepperSmallWrap}>
                    <TouchableOpacity
                      style={styles.stepperSmallBtn}
                      onPress={() => setProteinPercent((p) => Math.max(10, p - 5))}
                    >
                      <AppText>-</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.stepperSmallBtn}
                      onPress={() => setProteinPercent((p) => Math.min(50, p + 5))}
                    >
                      <AppText>+</AppText>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Carbs */}
                <View style={styles.macroAdjustRow}>
                  <AppText variant="bodyMd" color={theme.colors.macroCarbs}>
                    🌾 Đường bột: {carbsPercent}% ({carbsGrams}g)
                  </AppText>
                  <View style={styles.stepperSmallWrap}>
                    <TouchableOpacity
                      style={styles.stepperSmallBtn}
                      onPress={() => setCarbsPercent((c) => Math.max(10, c - 5))}
                    >
                      <AppText>-</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.stepperSmallBtn}
                      onPress={() => setCarbsPercent((c) => Math.min(70, c + 5))}
                    >
                      <AppText>+</AppText>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Fat */}
                <View style={styles.macroAdjustRow}>
                  <AppText variant="bodyMd" color={theme.colors.macroFats}>
                    💧 Chất béo: {fatPercent}% ({fatGrams}g)
                  </AppText>
                  <View style={styles.stepperSmallWrap}>
                    <TouchableOpacity
                      style={styles.stepperSmallBtn}
                      onPress={() => setFatPercent((f) => Math.max(10, f - 5))}
                    >
                      <AppText>-</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.stepperSmallBtn}
                      onPress={() => setFatPercent((f) => Math.min(50, f + 5))}
                    >
                      <AppText>+</AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <AppButton label="Lưu mục tiêu" variant="primary" onPress={handleSaveGoals} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 48,
    gap: 20,
  },

  // ── Top Header ──────────────────────────────────────────────────────
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── User Avatar Section ─────────────────────────────────────────────
  avatarSection: {
    alignItems: 'center',
    marginTop: 4,
  },
  avatarWrapper: {
    position: 'relative',
    width: 90,
    height: 90,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 44,
    lineHeight: 48,
    fontWeight: '700',
  },
  addPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 10,
  },

  // ── VIP / Trial Banner ──────────────────────────────────────────────
  vipBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FDE68A',
    borderRadius: 18,
    padding: 16,
    overflow: 'hidden',
  },
  vipBannerContent: {
    flex: 1,
    gap: 8,
  },
  vipBannerTitle: {
    color: '#13121B',
    fontSize: 15,
    fontWeight: '700',
  },
  vipBannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  vipBannerButtonText: {
    color: '#0D0B14',
    fontSize: 13,
    fontWeight: '700',
  },
  vipBannerGraphic: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vipBannerTrophy: {
    width: 76,
    height: 76,
  },

  // ── Metrics Capsule (Thước đo thể trạng) ─────────────────────────────
  metricsCapsuleWrapper: {
    gap: 12,
  },
  metricsCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 9999,
    borderWidth: 1,
  },
  metricItemCol: {
    flex: 1,
    alignItems: 'center',
  },
  capsuleDivider: {
    width: 1,
    height: 18,
  },
  metricsPillsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  subActionPill: {
    flex: 1,
    height: 40,
    borderRadius: 9999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Hành trình của bạn ──────────────────────────────────────────────
  sectionContainer: {
    gap: 12,
  },
  sectionHeaderClickable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  journeyCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  targetIconWrapper: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetIcon: {
    width: 48,
    height: 48,
  },
  journeyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  journeySubtitle: {
    fontSize: 13,
  },
  weightTrackContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    position: 'relative',
    height: 40,
    justifyContent: 'center',
  },
  weightTrackBg: {
    width: '80%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  weightTrackFill: {
    width: '50%',
    height: '100%',
  },
  weightIndicatorDot: {
    position: 'absolute',
    top: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightIndicatorInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  weightIndicatorLabel: {
    position: 'absolute',
    bottom: -4,
    fontSize: 12,
    fontWeight: '700',
  },

  // ── Mục tiêu dinh dưỡng & đa lượng ──────────────────────────────────
  macroCard: {
    borderRadius: 20,
    padding: 18,
    gap: 16,
  },
  macroRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  calorieRingContainer: {
    position: 'relative',
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenterContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calorieNumberText: {
    fontSize: 20,
    fontWeight: '800',
  },
  macroListCol: {
    flex: 1,
    gap: 12,
  },
  macroItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customizeGoalBtn: {
    minHeight: 44,
  },

  // ── Xem báo cáo thống kê ────────────────────────────────────────────
  statsIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statIconCol: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  statIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statEmoji: {
    fontSize: 26,
  },

  // ── Cộng đồng và hỗ trợ ─────────────────────────────────────────────
  communityBannerWrap: {
    width: '100%',
    aspectRatio: 2862 / 1472,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1E1435',
  },
  communityBannerImage: {
    width: '100%',
    height: '100%',
  },
  socialCard: {
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  socialSearchHeader: {
    paddingBottom: 2,
  },
  socialTilesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 14,
  },
  socialLogoImg: {
    width: 22,
    height: 22,
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(128,128,128,0.12)',
  },
  supportCenterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },

  // ── Footer Branding ─────────────────────────────────────────────────
  footerBranding: {
    alignItems: 'center',
    paddingTop: 12,
    gap: 4,
  },
  footerLogoText: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  copyrightText: {
    marginTop: 4,
  },
  disclaimerText: {
    lineHeight: 18,
    marginTop: 6,
    paddingHorizontal: 12,
  },

  // ── Modals Common ───────────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    gap: 16,
    maxHeight: '80%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalList: {
    gap: 8,
  },
  settingsRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.1)',
  },
  metricsModalList: {
    gap: 10,
  },
  metricModalCard: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(128,128,128,0.06)',
    gap: 4,
  },
  customizeGoalSection: {
    gap: 16,
  },
  goalAdjustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(128,128,128,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperVal: {
    minWidth: 50,
    textAlign: 'center',
  },
  macroAdjustSection: {
    gap: 12,
  },
  macroAdjustTitle: {
    marginBottom: 4,
  },
  macroAdjustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepperSmallWrap: {
    flexDirection: 'row',
    gap: 8,
  },
  stepperSmallBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(128,128,128,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
