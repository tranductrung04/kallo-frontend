import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppText } from '@/components/common';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useAuth } from '@/features/auth/AuthProvider';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { useOfflineSync } from '@/services/offline';
import { MaintenanceModal } from '../components/MaintenanceModal';
import { ForceUpdateModal } from '../components/ForceUpdateModal';

type Props = BottomTabScreenProps<MainTabParamList, 'Profile'>;
type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export function AccountProfileScreen({ navigation }: Props) {
  const theme = useTheme();
  const { signOut } = useAuth();
  const { state: nutritionState } = useNutrition();
  const { isOnline, pendingCount, syncNow, toggleOnlineStatus } = useOfflineSync();
  const root = navigation.getParent() as RootNavigation | undefined;

  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const goals = nutritionState.goals;

  const handleDeleteAccount = () => {
    Alert.alert(
      'Xóa vĩnh viễn tài khoản? ⚠️',
      'Hành động này sẽ xóa toàn bộ nhật ký bữa ăn, chỉ số cân nặng và dữ liệu sức khỏe của bạn khỏi hệ thống Kallo. Bạn không thể hoàn tác sau khi xác nhận.',
      [
        { text: 'Hủy bỏ', style: 'cancel' },
        {
          text: 'Xóa tài khoản',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            Alert.alert('Đã xóa tài khoản', 'Dữ liệu của bạn đã được xóa thành công.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── User Profile Header Card ───────────────────────────────── */}
        <View style={styles.profileHeroContainer}>
          <Image
            source={images.accountCardBg}
            style={styles.profileHeroBg}
            resizeMode="cover"
          />
          <View style={styles.profileHeroOverlay}>
            <View style={styles.avatarRow}>
              <Image
                source={images.avatar}
                style={styles.avatar}
                accessibilityLabel="Ảnh đại diện người dùng"
              />
              <View style={styles.userInfo}>
                <AppText variant="headlineMd" color="#FFFFFF">
                  Shadow
                </AppText>
                <AppText variant="caption" color="rgba(255,255,255,0.8)">
                  shadwo@kallo.health • Thành viên tích cực
                </AppText>
              </View>
            </View>

            <View style={styles.userStatsRow}>
              <View style={styles.userStatItem}>
                <AppText variant="caption" color="rgba(255,255,255,0.75)">Mục tiêu Calo</AppText>
                <AppText variant="headlineSm" color="#FFFFFF">{goals.calories} kcal</AppText>
              </View>
              <View style={styles.userStatDivider} />
              <View style={styles.userStatItem}>
                <AppText variant="caption" color="rgba(255,255,255,0.75)">Mục tiêu Cân nặng</AppText>
                <AppText variant="headlineSm" color="#FFFFFF">{goals.targetWeightKg} kg</AppText>
              </View>
              <View style={styles.userStatDivider} />
              <View style={styles.userStatItem}>
                <AppText variant="caption" color="rgba(255,255,255,0.75)">Nước mỗi ngày</AppText>
                <AppText variant="headlineSm" color="#FFFFFF">{goals.waterMl} ml</AppText>
              </View>
            </View>
          </View>
        </View>

        {/* ── Quick Health Roadmap & Target Card ──────────────────────── */}
        <AppCard style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => root?.navigate('Onboarding', { screen: 'Onboarding' })}
          >
            <Image source={images.reOnboarding} style={styles.menuIcon} resizeMode="contain" />
            <View style={styles.menuTextWrap}>
              <AppText variant="bodyMd">Tái thiết lập hồ sơ sức khỏe</AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Cập nhật lại cân nặng, chiều cao, TDEE và mục tiêu giảm cân
              </AppText>
            </View>
            <AppText variant="bodySm" color={theme.colors.textSecondary}>›</AppText>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => root?.navigate('StreakDetail')}
          >
            <Image source={images.accountTarget} style={styles.menuIcon} resizeMode="contain" />
            <View style={styles.menuTextWrap}>
              <AppText variant="bodyMd">Mục tiêu & Chuỗi Streak</AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Quản lý ngày đóng băng và theo dõi kỷ lục liên tiếp
              </AppText>
            </View>
            <AppText variant="bodySm" color={theme.colors.textSecondary}>›</AppText>
          </TouchableOpacity>
        </AppCard>

        {/* ── Notifications & System Settings ─────────────────────────── */}
        <AppCard style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => root?.navigate('NotificationCenter')}
          >
            <AppText variant="headlineSm">🔔</AppText>
            <View style={styles.menuTextWrap}>
              <AppText variant="bodyMd">Trung tâm thông báo</AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Xem các thông báo nhắc nhở và cập nhật hệ thống
              </AppText>
            </View>
            <AppText variant="bodySm" color={theme.colors.textSecondary}>›</AppText>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => root?.navigate('ReminderSettings')}
          >
            <AppText variant="headlineSm">⏰</AppText>
            <View style={styles.menuTextWrap}>
              <AppText variant="bodyMd">Cài đặt nhắc nhở thông minh</AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Giờ nhắc uống nước, 3 bữa chính và cảnh báo vượt calo
              </AppText>
            </View>
            <AppText variant="bodySm" color={theme.colors.textSecondary}>›</AppText>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Theme switcher (FR-SYS-08) */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={theme.toggleScheme}
          >
            <AppText variant="headlineSm">
              {theme.scheme === 'dark' ? '🌙' : '☀️'}
            </AppText>
            <View style={styles.menuTextWrap}>
              <AppText variant="bodyMd">Giao diện hiển thị</AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Đang sử dụng: {theme.scheme === 'dark' ? 'Chế độ Tối (Dark)' : 'Chế độ Sáng (Light)'}
              </AppText>
            </View>
            <AppText variant="caption" color={theme.colors.brandPrimary}>
              Chuyển đổi
            </AppText>
          </TouchableOpacity>
        </AppCard>

        {/* ── Offline & Sync Manager Card ─────────────────────────────── */}
        <AppCard style={styles.syncCard}>
          <View style={styles.syncCardHeader}>
            <View>
              <AppText variant="headlineSm">Đồng bộ & Chế độ ngoại tuyến</AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Trạng thái: {isOnline ? '🟢 Đang trực tuyến' : '🔴 Chế độ ngoại tuyến'} • {pendingCount} mục chờ
              </AppText>
            </View>
          </View>

          <View style={styles.syncActionsRow}>
            <AppButton
              label={isOnline ? 'Mô phỏng Mất mạng' : 'Mô phỏng Bật mạng'}
              variant="outline"
              onPress={toggleOnlineStatus}
              style={styles.syncActionBtn}
            />
            <AppButton
              label="Đồng bộ ngay"
              variant="primary"
              onPress={() => void syncNow()}
              disabled={!isOnline || pendingCount === 0}
              style={styles.syncActionBtn}
            />
          </View>
        </AppCard>

        {/* ── Community & Social Card ─────────────────────────────────── */}
        <AppCard style={styles.communityCard}>
          <Image
            source={images.fbGroupArtwork}
            style={styles.communityBanner}
            resizeMode="cover"
          />
          <AppText variant="headlineSm">Cộng đồng Kallo Healthy</AppText>
          <AppText variant="bodySm" color={theme.colors.textSecondary}>
            Tham gia chia sẻ bữa ăn ngon, kinh nghiệm giảm mỡ và nhận thực đơn độc quyền từ chuyên gia.
          </AppText>

          <View style={styles.socialIconsRow}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
              <Image source={images.facebookLogo} style={styles.socialLogo} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
              <Image source={images.instagramLogo} style={styles.socialLogo} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
              <Image source={images.tiktokLogo} style={styles.socialLogo} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </AppCard>

        {/* ── Developer & System Tools ────────────────────────────────── */}
        <AppCard style={styles.devCard}>
          <AppText variant="headlineSm">Kiểm tra trạng thái Hệ thống</AppText>
          <View style={styles.devActionsRow}>
            <AppButton
              label="Modal Bảo trì"
              variant="secondary"
              onPress={() => setShowMaintenanceModal(true)}
              style={styles.devActionBtn}
            />
            <AppButton
              label="Bản cập nhật mới"
              variant="secondary"
              onPress={() => setShowUpdateModal(true)}
              style={styles.devActionBtn}
            />
          </View>
          <AppButton
            label="Mở Component Showcase (UI Kit)"
            variant="outline"
            onPress={() => root?.navigate('ComponentShowcase')}
          />
        </AppCard>

        {/* ── Logout & Delete Account Buttons ─────────────────────────── */}
        <View style={styles.dangerZone}>
          <AppButton
            label="Đăng xuất tài khoản"
            variant="secondary"
            onPress={() => { void signOut(); }}
          />

          <TouchableOpacity
            style={styles.deleteAccountBtn}
            onPress={handleDeleteAccount}
            accessibilityRole="button"
            accessibilityLabel="Xóa tài khoản vĩnh viễn"
          >
            <AppText variant="bodySm" color={theme.colors.calorieIn} align="center">
              Xóa vĩnh viễn tài khoản (FR-AUTH-07)
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── System Modals ────────────────────────────────────────────── */}
      <MaintenanceModal
        visible={showMaintenanceModal}
        onRetry={() => setShowMaintenanceModal(false)}
      />

      <ForceUpdateModal
        visible={showUpdateModal}
        isMandatory={false}
        latestVersion="2.1.0"
        onUpdate={() => setShowUpdateModal(false)}
        onDismiss={() => setShowUpdateModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  profileHeroContainer: {
    height: 190,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E1B2E',
  },
  profileHeroBg: {
    width: '100%',
    height: '100%',
  },
  profileHeroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 18, 32, 0.55)',
    padding: 16,
    justifyContent: 'space-between',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 14,
    paddingVertical: 10,
  },
  userStatItem: {
    alignItems: 'center',
    gap: 2,
  },
  userStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  menuCard: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  menuIcon: {
    width: 32,
    height: 32,
  },
  menuTextWrap: {
    flex: 1,
    gap: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(128,128,128,0.12)',
  },
  syncCard: {
    gap: 12,
  },
  syncCardHeader: {
    gap: 2,
  },
  syncActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  syncActionBtn: {
    flex: 1,
  },
  communityCard: {
    gap: 12,
    overflow: 'hidden',
  },
  communityBanner: {
    width: '100%',
    height: 110,
    borderRadius: 12,
  },
  socialIconsRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 4,
  },
  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(128,128,128,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialLogo: {
    width: 26,
    height: 26,
  },
  devCard: {
    gap: 12,
  },
  devActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  devActionBtn: {
    flex: 1,
  },
  dangerZone: {
    gap: 14,
    marginTop: 8,
  },
  deleteAccountBtn: {
    paddingVertical: 10,
  },
});
