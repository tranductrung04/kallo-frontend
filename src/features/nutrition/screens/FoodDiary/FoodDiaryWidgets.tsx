import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import type { Food, FoodLog, MealSlot, NutritionSummary } from '../../types';
import { formatNumber, todayKey } from '../../utils';
import { useTheme } from '@/theme';
import {
  getDateTitle,
  getFullDateHeaderTitle,
  getLogNutrition,
  getMealSlotForHour,
  getMealSlotLabel,
} from './diaryUtils';
import { useFoodDiaryStyles } from './FoodDiaryScreen.styles';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DropletIcon,
  FiberIcon,
  FlagIcon,
  FlameIcon,
  LightningIcon,
  MenuIcon,
  PlusIcon,
  SaltIcon,
  ScaleIcon,
  SugarIcon,
  TimelineDiaryPhoneIllustration,
  WheatIcon,
} from '@/components/icons';


// ─── 1. Header Bar ──────────────────────────────────────────────────────────
export type DiaryHeaderProps = {
  date: string;
  textColor: string;
  onOpenMenu: () => void;
  onOpenDatePicker: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
};

export function DiaryHeader({
  date,
  textColor,
  onOpenMenu,
  onOpenDatePicker,
  onPrevDay,
  onNextDay,
}: DiaryHeaderProps) {
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useFoodDiaryStyles();

  return (
    <View style={styles.headerBar}>
      {/* Left: Hamburger Menu Button */}
      <TouchableOpacity
        onPress={onOpenMenu}
        style={styles.headerIconButton}
        accessibilityLabel="Menu tùy chọn"
      >
        <MenuIcon size={22} color={textColor || c.textPrimary} />
      </TouchableOpacity>

      {/* Center: <  Hôm nay  > */}
      <View style={styles.dateNavigator}>
        <TouchableOpacity
          onPress={onPrevDay}
          style={styles.chevronButton}
          accessibilityLabel="Ngày trước"
        >
          <ChevronLeftIcon size={18} color={textColor || c.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenDatePicker}
          style={styles.dateTitleContainer}
          accessibilityLabel="Chọn ngày"
        >
          <Text style={[styles.dateTitleText, { color: textColor || c.textPrimary }]}>{getDateTitle(date)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNextDay}
          style={styles.chevronButton}
          accessibilityLabel="Ngày tiếp theo"
        >
          <ChevronRightIcon size={18} color={textColor || c.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Right: Balance Placeholder */}
      <View style={styles.headerIconButton} />
    </View>
  );
}

// ─── 2. Macro Strip ─────────────────────────────────────────────────────────
export type MacroStripProps = {
  summary: NutritionSummary;
  page: 0 | 1;
  onPageChange: (page: 0 | 1) => void;
  onPressReport?: (metric?: string) => void;
};

export function MacroStrip({ summary, page, onPageChange, onPressReport }: MacroStripProps) {
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useFoodDiaryStyles();
  const { width: screenWidth } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);

  const saltGoal = 5;
  const sugarGoal = 49;
  const fiberGoal = 24;
  const saltCurrent = (summary as any).salt ?? (summary as any).sodium ?? 0;
  const sugarCurrent = (summary as any).sugar ?? 0;
  const fiberCurrent = (summary as any).fiber ?? 0;

  // Sync scroll position when page changes via dot tap
  useEffect(() => {
    scrollRef.current?.scrollTo({ x: page * screenWidth, animated: true });
  }, [page, screenWidth]);

  return (
    <View style={styles.macroStripContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const offsetX = e.nativeEvent.contentOffset.x;
          const newPage = (Math.round(offsetX / screenWidth) >= 1 ? 1 : 0) as 0 | 1;
          if (newPage !== page) {
            onPageChange(newPage);
          }
        }}
        scrollEventThrottle={16}
      >
        {/* SLIDE 1: Calories & 3 Macros */}
        <View style={[styles.macroSlide, { width: screenWidth }]}>
          <View style={styles.macroItemsRow}>
            {/* 1. Calories */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onPressReport?.('calories')}
              style={styles.macroItem}
            >
              <FlameIcon size={15} color={c.brandPrimary} />
              <Text style={styles.macroText}>
                {formatNumber(summary.calories)} / {formatNumber(summary.caloriesGoal || 1794)}
              </Text>
            </TouchableOpacity>

            {/* 2. Protein */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onPressReport?.('protein')}
              style={styles.macroItem}
            >
              <LightningIcon size={14} color={c.macroProtein} />
              <Text style={styles.macroText}>
                {formatNumber(Math.round(summary.protein))} / {formatNumber(summary.proteinGoal || 90)}
              </Text>
            </TouchableOpacity>

            {/* 3. Carbs */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onPressReport?.('carbs')}
              style={styles.macroItem}
            >
              <WheatIcon size={15} color={c.macroCarbs} />
              <Text style={styles.macroText}>
                {formatNumber(Math.round(summary.carbs))} / {formatNumber(summary.carbsGoal || 224)}
              </Text>
            </TouchableOpacity>

            {/* 4. Fat */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onPressReport?.('fat')}
              style={styles.macroItem}
            >
              <DropletIcon size={14} color={c.macroFats} />
              <Text style={styles.macroText}>
                {formatNumber(Math.round(summary.fat))} / {formatNumber(summary.fatGoal || 60)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 4 Progress Bars */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onPressReport?.('calories')}
            style={styles.progressBarsRow}
          >
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: c.brandPrimary,
                    width: `${Math.min(100, Math.max(0, (summary.calories / (summary.caloriesGoal || 1794)) * 100))}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: c.macroProtein,
                    width: `${Math.min(100, Math.max(0, (summary.protein / (summary.proteinGoal || 90)) * 100))}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: c.macroCarbs,
                    width: `${Math.min(100, Math.max(0, (summary.carbs / (summary.carbsGoal || 224)) * 100))}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: c.macroFats,
                    width: `${Math.min(100, Math.max(0, (summary.fat / (summary.fatGoal || 60)) * 100))}%`,
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* SLIDE 2: Calories, Muối, Đường, Chất xơ */}
        <View style={[styles.macroSlide, { width: screenWidth }]}>
          <View style={styles.macroItemsRow}>
            {/* 1. Calories */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onPressReport?.('calories')}
              style={styles.macroItem}
            >
              <FlameIcon size={15} color={c.brandPrimary} />
              <Text style={styles.macroText}>
                {formatNumber(summary.calories)} / {formatNumber(summary.caloriesGoal || 1952)}
              </Text>
            </TouchableOpacity>

            {/* 2. Salt */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onPressReport?.('salt')}
              style={styles.macroItem}
            >
              <SaltIcon size={15} color={c.macroSalt} capColor={c.onBrand} />
              <Text style={styles.macroText}>
                {formatNumber(saltCurrent)} / {formatNumber(saltGoal)}
              </Text>
            </TouchableOpacity>

            {/* 3. Sugar */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onPressReport?.('sugar')}
              style={styles.macroItem}
            >
              <SugarIcon size={15} color={c.macroSugar} />
              <Text style={styles.macroText}>
                {formatNumber(sugarCurrent)} / {formatNumber(sugarGoal)}
              </Text>
            </TouchableOpacity>

            {/* 4. Fiber */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onPressReport?.('fiber')}
              style={styles.macroItem}
            >
              <FiberIcon
                size={15}
                color={c.macroFiber}
                stalkColor={c.macroFiberSoft}
                creaseColor={c.macroFiberStrong}
              />
              <Text style={styles.macroText}>
                {formatNumber(fiberCurrent)} / {formatNumber(fiberGoal)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 4 Progress Bars */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onPressReport?.('calories')}
            style={styles.progressBarsRow}
          >
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: c.brandPrimary,
                    width: `${Math.min(100, Math.max(0, (summary.calories / (summary.caloriesGoal || 1952)) * 100))}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: c.macroSalt,
                    width: `${Math.min(100, Math.max(0, (saltCurrent / saltGoal) * 100))}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: c.macroSugar,
                    width: `${Math.min(100, Math.max(0, (sugarCurrent / sugarGoal) * 100))}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: c.macroFiber,
                    width: `${Math.min(100, Math.max(0, (fiberCurrent / fiberGoal) * 100))}%`,
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>


      {/* Carousel Pagination Dots */}
      <View style={styles.carouselDotsContainer}>
        <TouchableOpacity
          onPress={() => {
            onPageChange(0);
            scrollRef.current?.scrollTo({ x: 0, animated: true });
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View
            style={[
              styles.carouselDot,
              page === 0 ? styles.carouselDotActive : styles.carouselDotInactive,
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onPageChange(1);
            scrollRef.current?.scrollTo({ x: screenWidth, animated: true });
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View
            style={[
              styles.carouselDot,
              page === 1 ? styles.carouselDotActive : styles.carouselDotInactive,
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}


// ─── 3. Timeline Hour Row & Food Item Card ──────────────────────────────────
export type TimelineHourRowProps = {
  hour: string;
  isCurrent: boolean;
  logs: FoodLog[];
  foods: Food[];
  onPressAdd: () => void;
  onPressLog: (log: FoodLog) => void;
  onDeleteLog: (logId: string) => void;
};

export function TimelineHourRow({
  hour,
  isCurrent,
  logs,
  foods,
  onPressAdd,
  onPressLog,
  onDeleteLog,
}: TimelineHourRowProps) {
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useFoodDiaryStyles();
  const hasLogs = logs.length > 0;
  const totalCaloriesInHour = logs.reduce((sum, log) => {
    const nut = getLogNutrition(log, foods);
    return sum + nut.calories;
  }, 0);

  return (
    <View style={styles.hourBlock}>
      {/* The Timeline Row: [Time Pill] ─────── [Plus Button] */}
      <View style={styles.hourRow}>
        <View style={[styles.timePill, isCurrent && styles.timePillCurrent]}>
          <Text style={[styles.timeText, isCurrent && styles.timeTextCurrent]}>
            {hour}
          </Text>
        </View>

        <View style={styles.connectingLine} />

        {hasLogs && (
          <View style={styles.hourCaloriesBadge}>
            <Text style={styles.hourCaloriesText}>
              {formatNumber(Math.round(totalCaloriesInHour))} kcal
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={onPressAdd}
          activeOpacity={0.7}
          style={styles.plusButton}
          accessibilityLabel={`Thêm món vào lúc ${hour}`}
        >
          <PlusIcon size={14} color={c.textSecondary} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      {/* Nested Food Items (if logged in this hour) */}
      {hasLogs && (
        <View style={styles.foodListContainer}>
          {logs.map((log) => {
            const nutrition = getLogNutrition(log, foods);
            return (
              <TouchableOpacity
                key={log.id}
                activeOpacity={0.75}
                onPress={() => onPressLog(log)}
                style={styles.foodItemCard}
              >
                <View style={styles.foodItemMain}>
                  <Text style={styles.foodItemName} numberOfLines={1}>
                    {log.foodName}
                  </Text>
                  <Text style={styles.foodItemSubtitle}>
                    {log.grams}g • {formatNumber(Math.round(nutrition.calories))} kcal
                  </Text>
                </View>

                <View style={styles.foodItemMacros}>
                  <Text style={styles.foodMacroText}>
                    P: {Math.round(nutrition.protein)}g
                  </Text>
                  <Text style={styles.foodMacroText}>
                    C: {Math.round(nutrition.carbs)}g
                  </Text>
                  <Text style={styles.foodMacroText}>
                    F: {Math.round(nutrition.fat)}g
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => onDeleteLog(log.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.deleteLogButton}
                >
                  <Text style={styles.deleteLogText}>✕</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ─── 4. Quick Add Action Modal ──────────────────────────────────────────────
export type QuickAddModalProps = {
  visible: boolean;
  hour: string | null;
  date: string;
  onClose: () => void;
  onSelectSearch: (meal: MealSlot) => void;
  onSelectScan: (meal: MealSlot) => void;
  onSelectBarcode: (meal: MealSlot) => void;
  onSelectCustom: (meal: MealSlot) => void;
  onCopyYesterday: (meal: MealSlot) => void;
};

export function QuickAddModal({
  visible,
  hour,
  date,
  onClose,
  onSelectSearch,
  onSelectScan,
  onSelectBarcode,
  onSelectCustom,
  onCopyYesterday,
}: QuickAddModalProps) {
  const styles = useFoodDiaryStyles();
  if (!hour) return null;
  const activeMealSlot = getMealSlotForHour(hour);
  const activeMealLabel = getMealSlotLabel(activeMealSlot);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.actionSheetContent} onPress={(e) => e.stopPropagation()}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Thêm món vào lúc {hour}</Text>
            <Text style={styles.sheetSubtitle}>
              {activeMealLabel} • {getDateTitle(date)}
            </Text>
          </View>

          <View style={styles.actionOptionsList}>
            {/* Search */}
            <TouchableOpacity
              style={styles.actionOptionItem}
              onPress={() => onSelectSearch(activeMealSlot)}
            >
              <View style={[styles.actionIconBox, { backgroundColor: 'rgba(158, 100, 247, 0.15)' }]}>
                <Text style={styles.actionEmoji}>🔍</Text>
              </View>
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionOptionTitle}>Tìm kiếm thực phẩm</Text>
                <Text style={styles.actionOptionDesc}>Tìm trong cơ sở dữ liệu hàng nghìn món ăn</Text>
              </View>
            </TouchableOpacity>

            {/* AI Scan */}
            <TouchableOpacity
              style={styles.actionOptionItem}
              onPress={() => onSelectScan(activeMealSlot)}
            >
              <View style={[styles.actionIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <Text style={styles.actionEmoji}>✨</Text>
              </View>
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionOptionTitle}>Quét ảnh bằng AI</Text>
                <Text style={styles.actionOptionDesc}>Chụp ảnh bữa ăn để AI tự động nhận diện món & calo</Text>
              </View>
            </TouchableOpacity>

            {/* Barcode */}
            <TouchableOpacity
              style={styles.actionOptionItem}
              onPress={() => onSelectBarcode(activeMealSlot)}
            >
              <View style={[styles.actionIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                <Text style={styles.actionEmoji}>📷</Text>
              </View>
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionOptionTitle}>Quét mã vạch</Text>
                <Text style={styles.actionOptionDesc}>Quét bao bì thực phẩm đóng gói</Text>
              </View>
            </TouchableOpacity>

            {/* Custom Food */}
            <TouchableOpacity
              style={styles.actionOptionItem}
              onPress={() => onSelectCustom(activeMealSlot)}
            >
              <View style={[styles.actionIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Text style={styles.actionEmoji}>✍️</Text>
              </View>
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionOptionTitle}>Thêm món tùy chỉnh</Text>
                <Text style={styles.actionOptionDesc}>Tự tạo món ăn mới với định lượng dinh dưỡng</Text>
              </View>
            </TouchableOpacity>

            {/* Copy Yesterday */}
            <TouchableOpacity
              style={styles.actionOptionItem}
              onPress={() => onCopyYesterday(activeMealSlot)}
            >
              <View style={[styles.actionIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Text style={styles.actionEmoji}>📋</Text>
              </View>
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionOptionTitle}>Sao chép từ hôm qua</Text>
                <Text style={styles.actionOptionDesc}>
                  Lấy lại các món ăn của {activeMealLabel.toLowerCase()} hôm trước
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeSheetButton} onPress={onClose}>
            <Text style={styles.closeSheetText}>Đóng</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Custom Toggle Switch ───────────────────────────────────────────────────
function ToggleSwitch({
  value,
  onValueChange,
  accessibilityLabel,
}: {
  value: boolean;
  onValueChange: (val: boolean) => void;
  accessibilityLabel?: string;
}) {
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useFoodDiaryStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.toggleSwitchContainer,
        { backgroundColor: value ? c.brandPrimary : c.surfaceBorder },
      ]}
    >
      <View
        style={[
          styles.toggleSwitchThumb,
          { alignSelf: value ? 'flex-end' : 'flex-start' },
        ]}
      />
    </TouchableOpacity>
  );
}

// ─── 5. Settings / Drawer Menu Modal ─────────────────────────────────────────
export type DiaryMenuModalProps = {
  visible: boolean;
  onClose: () => void;
  isTimelineMode?: boolean;
  onToggleTimelineMode?: (val: boolean) => void;
  hideEmptyHours?: boolean;
  onToggleHideEmptyHours?: (val: boolean) => void;
  onCustomizeHours?: () => void;
  // Optional extra props for backwards compatibility
  summary?: NutritionSummary;
  date?: string;
  onNavigateMealPlan?: () => void;
  onNavigateReport?: () => void;
  onNavigateActivity?: () => void;
  onNavigateReminders?: () => void;
  onOpenWater?: () => void;
  onOpenWeight?: () => void;
};

export function DiaryMenuModal({
  visible,
  onClose,
  isTimelineMode = true,
  onToggleTimelineMode,
  hideEmptyHours = false,
  onToggleHideEmptyHours,
  onCustomizeHours,
}: DiaryMenuModalProps) {
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useFoodDiaryStyles();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.settingsSheetContent}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Top Drag Handle */}
          <View style={styles.settingsHandle} />

          {/* Title: Thiết lập */}
          <Text style={styles.settingsTitle}>Thiết lập</Text>

          {/* Item 1: Nhật ký theo thời gian */}
          <View style={styles.settingMainRow}>
            {/* Phone Mockup Illustration */}
            <TimelineDiaryPhoneIllustration size={70} />

            {/* Center Text Description */}
            <View style={styles.settingMainTextCol}>
              <Text style={styles.settingMainTitle}>Nhật ký theo thời gian</Text>
              <Text style={styles.settingMainDesc}>
                {'Ghi món ăn theo thời gian,\nkhông chia theo bữa.\nLinh hoạt hơn – phù hợp với mọi\nthói quen ăn uống.'}
              </Text>
            </View>

            {/* Toggle Switch */}
            <ToggleSwitch
              value={isTimelineMode}
              onValueChange={(val) => onToggleTimelineMode?.(val)}
              accessibilityLabel="Nhật ký theo thời gian"
            />
          </View>

          {/* Divider */}
          <View style={styles.settingsDivider} />

          {/* Item 2: Tuỳ chỉnh khung giờ hiển thị */}
          <TouchableOpacity
            style={styles.settingOptionRow}
            onPress={onCustomizeHours}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Tuỳ chỉnh khung giờ hiển thị"
          >
            <Text style={styles.settingOptionLabel}>
              Tuỳ chỉnh khung giờ hiển thị
            </Text>
            <ChevronRightIcon size={18} color={c.textSecondary} />
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.settingsDivider} />

          {/* Item 3: Ẩn giờ trống */}
          <View style={styles.settingOptionRow}>
            <Text style={styles.settingOptionLabel}>Ẩn giờ trống</Text>
            <ToggleSwitch
              value={hideEmptyHours}
              onValueChange={(val) => onToggleHideEmptyHours?.(val)}
              accessibilityLabel="Ẩn giờ trống"
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── 6. Full Month Date Picker Modal (Shared Component) ─────────────────────
export { DatePickerModal, MonthCalendarModal } from '@/components/common';
export type { DatePickerModalProps, MonthCalendarModalProps } from '@/components/common';

// ─── 7. Water Logger Modal ──────────────────────────────────────────────────
export type WaterLoggerModalProps = {
  visible: boolean;
  waterMl: number;
  waterGoalMl: number;
  onAddWater: (amount: number) => void;
  onClose: () => void;
};

export function WaterLoggerModal({
  visible,
  waterMl,
  waterGoalMl,
  onAddWater,
  onClose,
}: WaterLoggerModalProps) {
  const styles = useFoodDiaryStyles();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.actionSheetContent} onPress={(e) => e.stopPropagation()}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Ghi nhận uống nước</Text>
            <Text style={styles.sheetSubtitle}>
              Đã uống: {formatNumber(waterMl)} / {formatNumber(waterGoalMl || 2000)} ml
            </Text>
          </View>

          <View style={styles.waterButtonsRow}>
            <TouchableOpacity style={styles.waterQuickBtn} onPress={() => onAddWater(250)}>
              <Text style={styles.waterQuickEmoji}>🥛</Text>
              <Text style={styles.waterQuickLabel}>+250 ml</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.waterQuickBtn} onPress={() => onAddWater(500)}>
              <Text style={styles.waterQuickEmoji}>🍶</Text>
              <Text style={styles.waterQuickLabel}>+500 ml</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.waterQuickBtn} onPress={() => onAddWater(750)}>
              <Text style={styles.waterQuickEmoji}>🧃</Text>
              <Text style={styles.waterQuickLabel}>+750 ml</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeSheetButton} onPress={onClose}>
            <Text style={styles.closeSheetText}>Đóng</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── 8. Weight Logger Modal ─────────────────────────────────────────────────
export type WeightLoggerModalProps = {
  visible: boolean;
  weightKg?: number;
  targetWeightKg: number;
  onAddWeight: (weight: number) => void;
  onClose: () => void;
};

export function WeightLoggerModal({
  visible,
  weightKg,
  targetWeightKg,
  onAddWeight,
  onClose,
}: WeightLoggerModalProps) {
  const styles = useFoodDiaryStyles();
  const baseWeight = weightKg || targetWeightKg || 60;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.actionSheetContent} onPress={(e) => e.stopPropagation()}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Ghi nhận cân nặng</Text>
            <Text style={styles.sheetSubtitle}>
              Mục tiêu: {formatNumber(targetWeightKg || 60, 1)} kg
            </Text>
          </View>

          <View style={styles.waterButtonsRow}>
            {[-1, -0.5, 0.5, 1].map((delta) => {
              const newWeight = Math.round((baseWeight + delta) * 10) / 10;
              return (
                <TouchableOpacity
                  key={delta}
                  style={styles.waterQuickBtn}
                  onPress={() => onAddWeight(newWeight)}
                >
                  <Text style={styles.waterQuickLabel}>{delta > 0 ? `+${delta}` : delta} kg</Text>
                  <Text style={styles.weightSubLabel}>{newWeight} kg</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.closeSheetButton} onPress={onClose}>
            <Text style={styles.closeSheetText}>Đóng</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
