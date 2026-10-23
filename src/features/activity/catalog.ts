import type { ActivityCatalogItem, ActivityType } from './types';

export const ACTIVITY_CATALOG: ActivityCatalogItem[] = [
  { type: 'walking', name: 'Đi bộ', met: 3.5, icon: '🚶', category: 'Cardio', defaultDuration: 30 },
  { type: 'running', name: 'Chạy bộ', met: 8.3, icon: '🏃', category: 'Cardio', defaultDuration: 30 },
  { type: 'cycling', name: 'Đạp xe', met: 7.0, icon: '🚴', category: 'Cardio', defaultDuration: 45 },
  { type: 'swimming', name: 'Bơi lội', met: 7.0, icon: '🏊', category: 'Toàn thân', defaultDuration: 45 },
  { type: 'gym', name: 'Tập tạ / Gym', met: 5.0, icon: '🏋️', category: 'Kháng lực', defaultDuration: 60 },
  { type: 'yoga', name: 'Yoga', met: 2.8, icon: '🧘', category: 'Thư giãn', defaultDuration: 45 },
  { type: 'badminton', name: 'Cầu lông', met: 5.5, icon: '🏸', category: 'Thể thao', defaultDuration: 60 },
  { type: 'pickleball', name: 'Pickleball', met: 5.5, icon: '🏓', category: 'Thể thao', defaultDuration: 45 },
  { type: 'football', name: 'Bóng đá', met: 7.5, icon: '⚽', category: 'Thể thao', defaultDuration: 60 },
  { type: 'jump_rope', name: 'Nhảy dây', met: 10.0, icon: '⚡', category: 'HIIT', defaultDuration: 20 },
  { type: 'other', name: 'Hoạt động khác', met: 4.0, icon: '⏱️', category: 'Tổng hợp', defaultDuration: 30 },
];

export function findActivityMeta(type: ActivityType): ActivityCatalogItem {
  return ACTIVITY_CATALOG.find((item) => item.type === type) || ACTIVITY_CATALOG[ACTIVITY_CATALOG.length - 1];
}
