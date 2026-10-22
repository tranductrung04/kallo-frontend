import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { CalendarIcon } from '@/components/icons';
import { offsetDate, todayKey } from '@/features/nutrition/utils';

export type MonthCalendarModalProps = {
  visible: boolean;
  date: string;
  onSelectDate: (date: string) => void;
  onClose: () => void;
  // Optional extra props for backwards compatibility
  title?: string;
  isToday?: boolean;
  onSelectToday?: () => void;
  weekDayList?: Array<{
    key: string;
    label: string;
    dayNum: number;
    isSelected: boolean;
  }>;
};

export type DatePickerModalProps = MonthCalendarModalProps;

/** Tiêu đề ngày đầy đủ cho header lịch (ví dụ: "Hôm nay, 21 Tháng 10") */
export function formatFullCalendarTitle(dateKey: string): string {
  const today = todayKey();
  const d = new Date(`${dateKey}T12:00:00`);
  const day = d.getDate();
  const month = d.getMonth() + 1;

  if (dateKey === today) return `Hôm nay, ${day} Tháng ${month}`;
  if (dateKey === offsetDate(today, -1)) return `Hôm qua, ${day} Tháng ${month}`;
  if (dateKey === offsetDate(today, 1)) return `Ngày mai, ${day} Tháng ${month}`;

  return `${day} Tháng ${month}`;
}

/**
 * Component Lịch Tháng dạng Dropdown Sheet dùng chung toàn ứng dụng
 */
export function MonthCalendarModal({
  visible,
  date,
  onSelectDate,
  onClose,
}: MonthCalendarModalProps) {
  const insets = useSafeAreaInsets();

  // Parse ngày đang được chọn
  const selectedYear = parseInt(date.split('-')[0], 10) || new Date().getFullYear();
  const selectedMonth = parseInt(date.split('-')[1], 10) || (new Date().getMonth() + 1);

  // Tháng và năm đang hiển thị trên lịch
  const [viewYear, setViewYear] = useState<number>(selectedYear);
  const [viewMonth, setViewMonth] = useState<number>(selectedMonth);

  // Đồng bộ tháng/năm khi mở modal hoặc date thay đổi
  useEffect(() => {
    if (visible) {
      const y = parseInt(date.split('-')[0], 10) || new Date().getFullYear();
      const m = parseInt(date.split('-')[1], 10) || (new Date().getMonth() + 1);
      setViewYear(y);
      setViewMonth(m);
    }
  }, [visible, date]);

  // Điều hướng tháng
  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Tính ma trận ngày trong tháng
  // Bắt đầu từ Thứ 2 (T2) -> Chủ nhật (CN): 0 = T2, 6 = CN
  const firstDayOfMonth = new Date(viewYear, viewMonth - 1, 1);
  const rawDay = firstDayOfMonth.getDay();
  const startOffset = rawDay === 0 ? 6 : rawDay - 1;
  const totalDaysInMonth = new Date(viewYear, viewMonth, 0).getDate();

  const daysGrid: Array<{ dayNum: number; dateKey: string } | null> = [];

  // Ô trống đầu tháng
  for (let i = 0; i < startOffset; i++) {
    daysGrid.push(null);
  }

  // Các ngày trong tháng
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const dateKey = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    daysGrid.push({ dayNum: d, dateKey });
  }

  const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.calendarModalOverlay}>
        <View style={[styles.calendarCard, { paddingTop: Math.max(12, insets.top) }]}>
          {/* 1. Header hàng đầu */}
          <View style={styles.calendarHeaderRow}>
            <Text style={styles.calendarHeaderTitle}>
              {formatFullCalendarTitle(date)}
            </Text>
            <TouchableOpacity
              onPress={() => {
                const today = todayKey();
                onSelectDate(today);
                onClose();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Về hôm nay"
            >
              <CalendarIcon size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* 2. Thanh chuyển tháng: ◀ Tháng X ▶ */}
          <View style={styles.calendarMonthNavRow}>
            <TouchableOpacity
              onPress={handlePrevMonth}
              style={styles.calendarMonthArrowBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Tháng trước"
            >
              <Svg width={11} height={14} viewBox="0 0 11 14" fill="none">
                <Path d="M9 2.5L2.5 7L9 11.5Z" fill="#FFFFFF" />
              </Svg>
            </TouchableOpacity>

            <Text style={styles.calendarMonthNavText}>
              Tháng {viewMonth}
            </Text>

            <TouchableOpacity
              onPress={handleNextMonth}
              style={styles.calendarMonthArrowBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Tháng sau"
            >
              <Svg width={11} height={14} viewBox="0 0 11 14" fill="none">
                <Path d="M2 2.5L8.5 7L2 11.5Z" fill="#FFFFFF" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* 3. Thứ trong tuần */}
          <View style={styles.calendarWeekdaysRow}>
            {weekdays.map((w) => (
              <View key={w} style={styles.calendarWeekdayCol}>
                <Text style={styles.calendarWeekdayText}>{w}</Text>
              </View>
            ))}
          </View>

          {/* Đường kẻ phân cách */}
          <View style={styles.calendarDivider} />

          {/* 4. Lưới các ngày trong tháng */}
          <View style={styles.calendarGrid}>
            {daysGrid.map((item, index) => {
              if (!item) {
                return (
                  <View key={`empty-${index}`} style={styles.calendarDayCell} />
                );
              }

              const isSelected = item.dateKey === date;
              const isToday = item.dateKey === todayKey();

              return (
                <TouchableOpacity
                  key={item.dateKey}
                  style={styles.calendarDayCell}
                  onPress={() => {
                    onSelectDate(item.dateKey);
                    onClose();
                  }}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Ngày ${item.dayNum}`}
                >
                  {isSelected && isToday ? (
                    /* Ngày được chọn VÀ là hôm nay: Vòng tròn đôi phát sáng */
                    <View style={styles.calendarSelectedOuterRing}>
                      <View style={styles.calendarSelectedInnerCircle}>
                        <Text style={styles.calendarSelectedDayNumber}>
                          {item.dayNum}
                        </Text>
                      </View>
                    </View>
                  ) : isSelected ? (
                    /* Ngày được chọn: Vòng tròn tím đặc */
                    <View style={styles.calendarSelectedSolid}>
                      <Text style={styles.calendarSelectedDayNumber}>
                        {item.dayNum}
                      </Text>
                    </View>
                  ) : isToday ? (
                    /* Ngày hôm nay: Vòng viền tròn outline */
                    <View style={styles.calendarTodayOutline}>
                      <Text style={styles.calendarTodayDayNumber}>
                        {item.dayNum}
                      </Text>
                    </View>
                  ) : (
                    /* Ngày thông thường */
                    <Text style={styles.calendarDayNumber}>
                      {item.dayNum}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Vùng nền mờ bên dưới để bấm ra ngoài đóng modal */}
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </View>
    </Modal>
  );
}

// Alias tương thích ngược
export const DatePickerModal = MonthCalendarModal;

const styles = StyleSheet.create({
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-start',
  },
  calendarCard: {
    backgroundColor: '#201A2F',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  calendarHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  calendarMonthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
    marginTop: 8,
    marginBottom: 16,
  },
  calendarMonthNavText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  calendarMonthArrowBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarWeekdaysRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  calendarWeekdayCol: {
    flex: 1,
    alignItems: 'center',
  },
  calendarWeekdayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9E9AA7',
  },
  calendarDivider: {
    height: 1,
    backgroundColor: '#2C253E',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  calendarDayCell: {
    width: '14.285%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  calendarSelectedOuterRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#A78BFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarSelectedInnerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#9E64F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarSelectedSolid: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#9E64F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarTodayOutline: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#A78BFA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  calendarTodayDayNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  calendarSelectedDayNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
