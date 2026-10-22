// ─── Date helpers for the Home Dashboard ──────────────────────────────────────

import { todayKey } from '../../utils';

const DAYS_OF_WEEK = ['CHỦ NHẬT', 'THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY'];
const WEEK_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export function formatHeaderDate(dateKey: string): string {
  const today = new Date(`${todayKey()}T12:00:00`);
  const dateObj = new Date(`${dateKey}T12:00:00`);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const diffDays = Math.round((dateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `HÔM NAY, ${day} THG ${month}`;
  }
  if (diffDays === -1) {
    return `HÔM QUA, ${day} THG ${month}`;
  }
  if (diffDays === 1) {
    return `NGÀY MAI, ${day} THG ${month}`;
  }
  return `${DAYS_OF_WEEK[dateObj.getDay()]}, ${day} THG ${month}`;
}

export type WeekDay = {
  label: string;
  key: string;
  dateNum: number;
  isSelected: boolean;
  isToday: boolean;
};

/** Trả về 7 ngày (T2 → CN) của tuần chứa `selectedDateKey`. */
export function getWeekDays(selectedDateKey: string): WeekDay[] {
  const today = todayKey();
  const current = new Date(`${selectedDateKey}T12:00:00`);
  const dayOfWeek = current.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(current);
  monday.setDate(current.getDate() + mondayOffset);

  return WEEK_LABELS.map((label, index) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + index);
    const key = todayKey(d);
    return {
      label,
      key,
      dateNum: d.getDate(),
      isSelected: key === selectedDateKey,
      isToday: key === today,
    };
  });
}

export function formatWeightDate(dateStr?: string): string {
  if (!dateStr) return '15 Th 09, 2026';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (match) {
    const [, year, month, day] = match;
    return `${day} Th ${month}, ${year}`;
  }
  return dateStr;
}
