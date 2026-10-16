import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppCard, AppText } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useSystem } from '../SystemProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'ReminderSettings'>;

export function ReminderSettingsScreen({}: Props) {
  const theme = useTheme();
  const { reminders, updateReminders } = useSystem();

  const handleToggle = (key: keyof typeof reminders, value: boolean) => {
    updateReminders({ [key]: value });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Header Intro ───────────────────────────────────────────── */}
        <View style={styles.header}>
          <AppText variant="headlineMd">Cài đặt Nhắc nhở</AppText>
          <AppText variant="bodySm" color={theme.colors.textSecondary}>
            Thiết lập lịch thông báo thông minh giúp duy trì lối sống lành mạnh
          </AppText>
        </View>

        {/* ── Water Reminders Card ────────────────────────────────────── */}
        <AppCard style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.flex}>
              <AppText variant="headlineSm">Nhắc nhở uống nước 💧</AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Mỗi 2 giờ trong khung giờ {reminders.waterStartHour} - {reminders.waterEndHour}
              </AppText>
            </View>
            <Switch
              value={reminders.waterReminderEnabled}
              onValueChange={(val) => handleToggle('waterReminderEnabled', val)}
              trackColor={{ false: 'rgba(128,128,128,0.3)', true: theme.colors.brandPrimary }}
            />
          </View>
        </AppCard>

        {/* ── Meals Reminders Card ────────────────────────────────────── */}
        <AppCard style={styles.card}>
          <AppText variant="headlineSm">Nhắc nhở ghi 3 bữa chính 🍽️</AppText>
          <AppText variant="caption" color={theme.colors.textSecondary}>
            Thông báo đẩy nhẹ nhàng khi đến giờ ăn hàng ngày
          </AppText>

          {/* Breakfast */}
          <View style={styles.settingRow}>
            <View>
              <AppText variant="bodyMd">Bữa sáng</AppText>
              <AppText variant="caption" color={theme.colors.brandPrimary}>{reminders.breakfastTime}</AppText>
            </View>
            <Switch
              value={reminders.breakfastReminderEnabled}
              onValueChange={(val) => handleToggle('breakfastReminderEnabled', val)}
              trackColor={{ false: 'rgba(128,128,128,0.3)', true: theme.colors.brandPrimary }}
            />
          </View>

          {/* Lunch */}
          <View style={styles.settingRow}>
            <View>
              <AppText variant="bodyMd">Bữa trưa</AppText>
              <AppText variant="caption" color={theme.colors.brandPrimary}>{reminders.lunchTime}</AppText>
            </View>
            <Switch
              value={reminders.lunchReminderEnabled}
              onValueChange={(val) => handleToggle('lunchReminderEnabled', val)}
              trackColor={{ false: 'rgba(128,128,128,0.3)', true: theme.colors.brandPrimary }}
            />
          </View>

          {/* Dinner */}
          <View style={styles.settingRow}>
            <View>
              <AppText variant="bodyMd">Bữa tối</AppText>
              <AppText variant="caption" color={theme.colors.brandPrimary}>{reminders.dinnerTime}</AppText>
            </View>
            <Switch
              value={reminders.dinnerReminderEnabled}
              onValueChange={(val) => handleToggle('dinnerReminderEnabled', val)}
              trackColor={{ false: 'rgba(128,128,128,0.3)', true: theme.colors.brandPrimary }}
            />
          </View>
        </AppCard>

        {/* ── Safety Over-Calorie Warning Card (FR-SYS-02) ────────────── */}
        <AppCard style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.flex}>
              <AppText variant="headlineSm">Cảnh báo vượt Calo ⚠️</AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Gửi cảnh báo tức thì khi tổng năng lượng nạp trong ngày vượt 100% Calo mục tiêu (FR-SYS-02).
              </AppText>
            </View>
            <Switch
              value={reminders.overCalorieWarningEnabled}
              onValueChange={(val) => handleToggle('overCalorieWarningEnabled', val)}
              trackColor={{ false: 'rgba(128,128,128,0.3)', true: theme.colors.calorieIn }}
            />
          </View>
        </AppCard>

        {/* ── Streak Motivation Card ─────────────────────────────────── */}
        <AppCard style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.flex}>
              <AppText variant="headlineSm">Nhắc nhở duy trì Streak 🔥</AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Nhắc vào lúc 21:00 nếu hôm nay bạn chưa hoàn thành mục tiêu ngày
              </AppText>
            </View>
            <Switch
              value={reminders.streakReminderEnabled}
              onValueChange={(val) => handleToggle('streakReminderEnabled', val)}
              trackColor={{ false: 'rgba(128,128,128,0.3)', true: theme.colors.brandPrimary }}
            />
          </View>
        </AppCard>

        {/* ── Do Not Disturb (DND) Card ───────────────────────────────── */}
        <AppCard style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.flex}>
              <AppText variant="headlineSm">Chế độ Không làm phiền 🌙</AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Tắt toàn bộ âm thanh và rung thông báo trong khung giờ {reminders.dndStartTime} - {reminders.dndEndTime}
              </AppText>
            </View>
            <Switch
              value={reminders.dndEnabled}
              onValueChange={(val) => handleToggle('dndEnabled', val)}
              trackColor={{ false: 'rgba(128,128,128,0.3)', true: theme.colors.brandPrimary }}
            />
          </View>
        </AppCard>
      </ScrollView>
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
  header: {
    gap: 4,
  },
  card: {
    gap: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  flex: {
    flex: 1,
    paddingRight: 12,
    gap: 2,
  },
});
