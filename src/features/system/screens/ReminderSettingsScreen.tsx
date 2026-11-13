import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppCard, AppSwitch, AppText } from '@/components/common';
import {
  CutleryIcon,
  DropletIcon,
  FlameIcon,
  MoonIcon,
  TriangleAlertIcon,
} from '@/components/icons';
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <DropletIcon size={18} color={theme.colors.brandPrimary} />
                <AppText variant="headlineSm">Nhắc nhở uống nước</AppText>
              </View>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Mỗi 2 giờ trong khung giờ {reminders.waterStartHour} - {reminders.waterEndHour}
              </AppText>
            </View>
            <AppSwitch
              value={reminders.waterReminderEnabled}
              onValueChange={(val) => handleToggle('waterReminderEnabled', val)}
              accessibilityLabel="Nhắc nhở uống nước"
            />
          </View>
        </AppCard>

        {/* ── Meals Reminders Card ────────────────────────────────────── */}
        <AppCard style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <CutleryIcon size={18} color={theme.colors.brandPrimary} />
            <AppText variant="headlineSm">Nhắc nhở ghi 3 bữa chính</AppText>
          </View>
          <AppText variant="caption" color={theme.colors.textSecondary}>
            Thông báo đẩy nhẹ nhàng khi đến giờ ăn hàng ngày
          </AppText>

          {/* Breakfast */}
          <View style={styles.settingRow}>
            <View>
              <AppText variant="bodyMd">Bữa sáng</AppText>
              <AppText variant="caption" color={theme.colors.brandPrimary}>{reminders.breakfastTime}</AppText>
            </View>
            <AppSwitch
              value={reminders.breakfastReminderEnabled}
              onValueChange={(val) => handleToggle('breakfastReminderEnabled', val)}
              accessibilityLabel="Nhắc nhở bữa sáng"
            />
          </View>

          {/* Lunch */}
          <View style={styles.settingRow}>
            <View>
              <AppText variant="bodyMd">Bữa trưa</AppText>
              <AppText variant="caption" color={theme.colors.brandPrimary}>{reminders.lunchTime}</AppText>
            </View>
            <AppSwitch
              value={reminders.lunchReminderEnabled}
              onValueChange={(val) => handleToggle('lunchReminderEnabled', val)}
              accessibilityLabel="Nhắc nhở bữa trưa"
            />
          </View>

          {/* Dinner */}
          <View style={styles.settingRow}>
            <View>
              <AppText variant="bodyMd">Bữa tối</AppText>
              <AppText variant="caption" color={theme.colors.brandPrimary}>{reminders.dinnerTime}</AppText>
            </View>
            <AppSwitch
              value={reminders.dinnerReminderEnabled}
              onValueChange={(val) => handleToggle('dinnerReminderEnabled', val)}
              accessibilityLabel="Nhắc nhở bữa tối"
            />
          </View>
        </AppCard>

        {/* ── Safety Over-Calorie Warning Card (FR-SYS-02) ────────────── */}
        <AppCard style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.flex}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <TriangleAlertIcon size={18} color={theme.colors.calorieIn} />
                <AppText variant="headlineSm">Cảnh báo vượt Calo</AppText>
              </View>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Gửi cảnh báo tức thì khi tổng năng lượng nạp trong ngày vượt 100% Calo mục tiêu (FR-SYS-02).
              </AppText>
            </View>
            <AppSwitch
              value={reminders.overCalorieWarningEnabled}
              onValueChange={(val) => handleToggle('overCalorieWarningEnabled', val)}
              activeTrackColor={theme.colors.calorieIn}
              accessibilityLabel="Cảnh báo vượt Calo"
            />
          </View>
        </AppCard>

        {/* ── Streak Motivation Card ─────────────────────────────────── */}
        <AppCard style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.flex}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <FlameIcon size={18} color={theme.colors.brandPrimary} />
                <AppText variant="headlineSm">Nhắc nhở duy trì Streak</AppText>
              </View>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Nhắc vào lúc 21:00 nếu hôm nay bạn chưa hoàn thành mục tiêu ngày
              </AppText>
            </View>
            <AppSwitch
              value={reminders.streakReminderEnabled}
              onValueChange={(val) => handleToggle('streakReminderEnabled', val)}
              accessibilityLabel="Nhắc nhở duy trì Streak"
            />
          </View>
        </AppCard>

        {/* ── Do Not Disturb (DND) Card ───────────────────────────────── */}
        <AppCard style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.flex}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MoonIcon size={18} color={theme.colors.brandPrimary} />
                <AppText variant="headlineSm">Chế độ Không làm phiền</AppText>
              </View>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Tắt toàn bộ âm thanh và rung thông báo trong khung giờ {reminders.dndStartTime} - {reminders.dndEndTime}
              </AppText>
            </View>
            <AppSwitch
              value={reminders.dndEnabled}
              onValueChange={(val) => handleToggle('dndEnabled', val)}
              accessibilityLabel="Chế độ Không làm phiền"
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
