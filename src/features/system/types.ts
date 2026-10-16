export type NotificationCategory = 'ALL' | 'NUTRITION' | 'ACTIVITY' | 'SYSTEM' | 'COMMUNITY';

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  isRead: boolean;
  actionRoute?: string;
};

export type ReminderSettings = {
  waterReminderEnabled: boolean;
  waterIntervalHours: number;
  waterStartHour: string;
  waterEndHour: string;
  breakfastReminderEnabled: boolean;
  breakfastTime: string;
  lunchReminderEnabled: boolean;
  lunchTime: string;
  dinnerReminderEnabled: boolean;
  dinnerTime: string;
  overCalorieWarningEnabled: boolean;
  dndEnabled: boolean;
  dndStartTime: string;
  dndEndTime: string;
  streakReminderEnabled: boolean;
};
