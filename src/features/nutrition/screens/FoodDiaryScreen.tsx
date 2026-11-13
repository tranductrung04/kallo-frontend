import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useNutrition } from '../NutritionProvider';
import type { FoodLog, MealSlot } from '../types';
import { offsetDate, todayKey } from '../utils';
import {
  BASE_HOURS,
  createStyles,
  DatePickerModal,
  DiaryHeader,
  DiaryMenuModal,
  MacroStrip,
  QuickAddModal,
  TimelineHourRow,
  WaterLoggerModal,
  WeightLoggerModal,
  getMealSlotForHour,
} from './FoodDiary';


type Props = BottomTabScreenProps<MainTabParamList, 'Diary'>;
type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export function FoodDiaryScreen({ navigation }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const root = navigation.getParent() as RootNavigation | undefined;
  const {
    state,
    foods,
    getSummary,
    getLogs,
    setSelectedDate,
    deleteFoodLog,
    copyMeal,
    addWater,
    addWeight,
  } = useNutrition();

  const date = state.selectedDate || todayKey();
  const isToday = date === todayKey();
  const summary = getSummary(date);
  const currentLogs = getLogs(date);

  // Current hour of day
  const currentHourNum = new Date().getHours();
  const currentHourStr = `${String(currentHourNum).padStart(2, '0')}:00`;

  // Macro carousel page (0 = Calo/Macros, 1 = Nước/Tiêu hao/Cân nặng)
  const [carouselPage, setCarouselPage] = useState<0 | 1>(0);

  // Settings state (Matching Menu Screenshot)
  const [isTimelineMode, setIsTimelineMode] = useState(true);
  const [hideEmptyHours, setHideEmptyHours] = useState(false);
  const [hourRange, setHourRange] = useState<{ start: number; end: number }>({ start: 7, end: 23 });

  // Modals state
  const [selectedHourForAdd, setSelectedHourForAdd] = useState<string | null>(null);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [waterPromptVisible, setWaterPromptVisible] = useState(false);
  const [weightPromptVisible, setWeightPromptVisible] = useState(false);

  // Customize hours handler
  const handleCustomizeHours = () => {
    Alert.alert(
      'Tuỳ chỉnh khung giờ hiển thị',
      'Chọn khoảng thời gian theo dõi nhật ký trong ngày:',
      [
        {
          text: '07:00 - 23:00 (Mặc định)',
          onPress: () => setHourRange({ start: 7, end: 23 }),
        },
        {
          text: '06:00 - 24:00 (Cả ngày)',
          onPress: () => setHourRange({ start: 6, end: 24 }),
        },
        {
          text: '08:00 - 22:00 (Gọn gàng)',
          onPress: () => setHourRange({ start: 8, end: 22 }),
        },
        {
          text: '06:00 - 18:00 (Nhịn ăn 16:8)',
          onPress: () => setHourRange({ start: 6, end: 18 }),
        },
        { text: 'Hủy', style: 'cancel' },
      ]
    );
  };

  // Base timeline hours list
  const allTimelineHours = useMemo(() => {
    const hoursSet = new Set<string>();
    for (let h = hourRange.start; h <= hourRange.end; h++) {
      hoursSet.add(`${String(h).padStart(2, '0')}:00`);
    }
    currentLogs.forEach((log) => {
      if (log.time) {
        const hour = `${log.time.split(':')[0]}:00`;
        hoursSet.add(hour);
      }
    });
    return Array.from(hoursSet).sort();
  }, [currentLogs, hourRange]);

  // Group logs by timeline hour
  const logsByHour = useMemo(() => {
    const map = new Map<string, FoodLog[]>();
    allTimelineHours.forEach((h) => map.set(h, []));

    currentLogs.forEach((log) => {
      let targetHour = '08:00';
      if (log.time) {
        const h = parseInt(log.time.split(':')[0], 10);
        targetHour = `${String(h).padStart(2, '0')}:00`;
      } else {
        if (log.meal === 'breakfast') targetHour = '08:00';
        else if (log.meal === 'lunch') targetHour = '12:00';
        else if (log.meal === 'snack') targetHour = '15:00';
        else if (log.meal === 'dinner') targetHour = '19:00';
      }

      const list = map.get(targetHour) || [];
      list.push(log);
      map.set(targetHour, list);
    });

    return map;
  }, [currentLogs, allTimelineHours]);

  // Visible timeline hours (filters empty hours if hideEmptyHours is ON)
  const timelineHours = useMemo(() => {
    if (!hideEmptyHours) return allTimelineHours;
    return allTimelineHours.filter(
      (hour) => (logsByHour.get(hour)?.length || 0) > 0 || (isToday && hour === currentHourStr)
    );
  }, [allTimelineHours, hideEmptyHours, logsByHour, isToday, currentHourStr]);

  // 7 days for the date picker strip
  const weekDayList = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const target = offsetDate(todayKey(), i - 3);
      const d = new Date(`${target}T12:00:00`);
      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      return {
        key: target,
        label: dayNames[d.getDay()],
        dayNum: d.getDate(),
        isSelected: target === date,
      };
    });
  }, [date]);

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.colors.canvasBase }]}>
      <StatusBar
        barStyle={theme.scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.canvasBase}
      />

      {/* ── 1. Top Navigation Bar ────────────────────────────────────────────── */}
      <DiaryHeader
        date={date}
        textColor={theme.colors.textPrimary}
        onOpenMenu={() => setMenuModalVisible(true)}
        onOpenDatePicker={() => setDatePickerVisible(true)}
        onPrevDay={() => setSelectedDate(offsetDate(date, -1))}
        onNextDay={() => setSelectedDate(offsetDate(date, 1))}
      />

      {/* ── 2. Top Macro / Calories Strip ────────────────────────────────────── */}
      <MacroStrip
        summary={summary}
        page={carouselPage}
        onPageChange={setCarouselPage}
        onPressReport={(metric) => {
          if (root) {
            root.navigate('ReportOverview', { date, metric });
          } else {
            (navigation as any).navigate('ReportOverview', { date, metric });
          }
        }}
      />

      {/* ── 3. Timeline / Hourly Schedule List ──────────────────────────────── */}
      <ScrollView
        contentContainerStyle={styles.timelineScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {timelineHours.map((hour) => (
          <TimelineHourRow
            key={hour}
            hour={hour}
            isCurrent={isToday && hour === currentHourStr}
            logs={logsByHour.get(hour) || []}
            foods={foods}
            onPressAdd={() =>
              root?.navigate('FoodSearch', {
                date,
                meal: getMealSlotForHour(hour),
                hour,
              })
            }
            onPressLog={(log) =>
              root?.navigate('FoodDetail', {
                foodId: log.foodId,
                date,
                meal: log.meal,
                logId: log.id,
                source: log.source,
              })
            }
            onDeleteLog={deleteFoodLog}
          />
        ))}
      </ScrollView>

      {/* ── 4. Quick Add Action Modal ────────────────────────────────────────── */}
      <QuickAddModal
        visible={selectedHourForAdd !== null}
        hour={selectedHourForAdd}
        date={date}
        onClose={() => setSelectedHourForAdd(null)}
        onSelectSearch={(meal: MealSlot) => {
          setSelectedHourForAdd(null);
          root?.navigate('FoodSearch', { date, meal });
        }}
        onSelectScan={(meal: MealSlot) => {
          setSelectedHourForAdd(null);
          root?.navigate('AIMealScan', { date, meal });
        }}
        onSelectBarcode={(meal: MealSlot) => {
          setSelectedHourForAdd(null);
          root?.navigate('BarcodeScanner', { date, meal });
        }}
        onSelectCustom={(meal: MealSlot) => {
          setSelectedHourForAdd(null);
          root?.navigate('CustomFoodForm', { date, meal });
        }}
        onCopyYesterday={(meal: MealSlot) => {
          copyMeal(offsetDate(date, -1), date, meal);
          setSelectedHourForAdd(null);
          Alert.alert('Thành công', 'Đã sao chép bữa ăn từ hôm qua.');
        }}
      />

      {/* ── 5. Hamburger Settings Menu Modal (Matching Screenshot) ─────────── */}
      <DiaryMenuModal
        visible={menuModalVisible}
        onClose={() => setMenuModalVisible(false)}
        isTimelineMode={isTimelineMode}
        onToggleTimelineMode={setIsTimelineMode}
        hideEmptyHours={hideEmptyHours}
        onToggleHideEmptyHours={setHideEmptyHours}
        onCustomizeHours={handleCustomizeHours}
        summary={summary}
        date={date}
        onNavigateMealPlan={() => {
          setMenuModalVisible(false);
          root?.navigate('MealPlanOverview');
        }}
        onNavigateReport={() => {
          setMenuModalVisible(false);
          root?.navigate('ReportOverview', { date });
        }}
        onNavigateActivity={() => {
          setMenuModalVisible(false);
          root?.navigate('ActivityTracker', { date });
        }}
        onNavigateReminders={() => {
          setMenuModalVisible(false);
          root?.navigate('ReminderSettings');
        }}
        onOpenWater={() => {
          setMenuModalVisible(false);
          setWaterPromptVisible(true);
        }}
        onOpenWeight={() => {
          setMenuModalVisible(false);
          setWeightPromptVisible(true);
        }}
      />

      {/* ── 6. Date Picker Modal ─────────────────────────────────────────────── */}
      <DatePickerModal
        visible={datePickerVisible}
        date={date}
        isToday={isToday}
        weekDayList={weekDayList}
        onSelectDate={(newDate) => {
          setSelectedDate(newDate);
          setDatePickerVisible(false);
        }}
        onSelectToday={() => {
          setSelectedDate(todayKey());
          setDatePickerVisible(false);
        }}
        onClose={() => setDatePickerVisible(false)}
      />

      {/* ── 7. Quick Water Logger Modal ──────────────────────────────────────── */}
      <WaterLoggerModal
        visible={waterPromptVisible}
        waterMl={summary.waterMl}
        waterGoalMl={summary.waterGoalMl || 2000}
        onAddWater={(amount) => {
          addWater(date, amount);
          setWaterPromptVisible(false);
        }}
        onClose={() => setWaterPromptVisible(false)}
      />

      {/* ── 8. Quick Weight Logger Modal ─────────────────────────────────────── */}
      <WeightLoggerModal
        visible={weightPromptVisible}
        weightKg={summary.weightKg}
        targetWeightKg={summary.targetWeightKg || 60}
        onAddWeight={(newWeight) => {
          addWeight(date, newWeight);
          setWeightPromptVisible(false);
          Alert.alert('Thành công', `Đã cập nhật cân nặng: ${newWeight} kg`);
        }}
        onClose={() => setWeightPromptVisible(false)}
      />
    </SafeAreaView>
  );
}
