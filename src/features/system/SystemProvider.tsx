import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppNotification, NotificationCategory, ReminderSettings } from './types';

const NOTIFICATIONS_KEY = '@kallo/notifications-v1';
const REMINDERS_KEY = '@kallo/reminders-v1';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Nhắc nhở uống nước 💧',
    message: 'Đã đến giờ nạp thêm một ly nước 250ml để thanh lọc cơ thể và duy trì năng lượng!',
    category: 'NUTRITION',
    timestamp: '10 phút trước',
    isRead: false,
    actionRoute: 'MainTabs',
  },
  {
    id: 'notif-2',
    title: 'Cảnh báo Calo mục tiêu ⚠️',
    message: 'Bạn đã đạt 92% mức calo mục tiêu hôm nay. Hãy ưu tiên rau củ cho bữa tối nhé!',
    category: 'NUTRITION',
    timestamp: '2 giờ trước',
    isRead: false,
    actionRoute: 'Diary',
  },
  {
    id: 'notif-3',
    title: 'Chuỗi Streak ấn tượng 🔥',
    message: 'Chúc mừng bạn đã duy trì chuỗi 7 ngày sống khỏe cùng Kallo! Nhận ngay huy hiệu mới.',
    category: 'COMMUNITY',
    timestamp: 'Hôm qua',
    isRead: true,
    actionRoute: 'StreakDetail',
  },
  {
    id: 'notif-4',
    title: 'Đồng bộ sức khỏe hoàn tất 👟',
    message: 'Đã đồng bộ 6.540 bước chân từ Health Connect. Calo tiêu hao đã được cập nhật.',
    category: 'ACTIVITY',
    timestamp: 'Hôm qua',
    isRead: true,
    actionRoute: 'ActivityTracker',
  },
];

export const DEFAULT_REMINDERS: ReminderSettings = {
  waterReminderEnabled: true,
  waterIntervalHours: 2,
  waterStartHour: '08:00',
  waterEndHour: '20:00',
  breakfastReminderEnabled: true,
  breakfastTime: '07:30',
  lunchReminderEnabled: true,
  lunchTime: '12:00',
  dinnerReminderEnabled: true,
  dinnerTime: '19:00',
  overCalorieWarningEnabled: true,
  dndEnabled: true,
  dndStartTime: '22:00',
  dndEndTime: '07:00',
  streakReminderEnabled: true,
};

export type SystemContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  reminders: ReminderSettings;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  updateReminders: (changes: Partial<ReminderSettings>) => void;
};

const SystemContext = createContext<SystemContextValue | null>(null);

export function SystemProvider({ children }: React.PropsWithChildren) {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [reminders, setReminders] = useState<ReminderSettings>(DEFAULT_REMINDERS);

  // Load from local storage
  useEffect(() => {
    void AsyncStorage.getItem(NOTIFICATIONS_KEY).then((data) => {
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) setNotifications(parsed);
        } catch {
          /* Ignore parse error */
        }
      }
    });

    void AsyncStorage.getItem(REMINDERS_KEY).then((data) => {
      if (data) {
        try {
          const parsed = JSON.parse(data);
          setReminders((prev) => ({ ...prev, ...parsed }));
        } catch {
          /* Ignore parse error */
        }
      }
    });
  }, []);

  // Save changes
  useEffect(() => {
    void AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications)).catch(() => undefined);
  }, [notifications]);

  useEffect(() => {
    void AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders)).catch(() => undefined);
  }, [reminders]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateReminders = useCallback((changes: Partial<ReminderSettings>) => {
    setReminders((prev) => ({ ...prev, ...changes }));
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const value: SystemContextValue = {
    notifications,
    unreadCount,
    reminders,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateReminders,
  };

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error('useSystem must be used inside SystemProvider');
  return ctx;
}
