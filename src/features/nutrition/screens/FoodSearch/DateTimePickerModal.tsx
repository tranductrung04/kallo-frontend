import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseXIcon } from '@/components/icons';
import { useTheme } from '@/theme';
import { offsetDate, todayKey } from '../../utils';
import { styles } from './FoodSearchScreen.styles';

const ITEM_HEIGHT = 44;
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));

export function formatPickerDate(dateKey: string): string {
  const today = todayKey();
  if (dateKey === today) return 'Hôm nay';
  if (dateKey === offsetDate(today, -1)) return 'Hôm qua';
  if (dateKey === offsetDate(today, 1)) return 'Ngày mai';

  const d = new Date(`${dateKey}T12:00:00`);
  const days = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
  const dayOfWeek = days[d.getDay()];
  return `${dayOfWeek}, ${d.getDate()} thg ${d.getMonth() + 1}`;
}

export type DateTimePickerModalProps = {
  visible: boolean;
  initialDate: string;
  initialHour: string;
  onClose: () => void;
  onConfirm: (date: string, hour: string) => void;
};

export function DateTimePickerModal({
  visible,
  initialDate,
  initialHour,
  onClose,
  onConfirm,
}: DateTimePickerModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [tempDate, setTempDate] = useState(initialDate);
  const [tempHour, setTempHour] = useState(initialHour.slice(0, 2) || '11');
  const dateScrollRef = useRef<ScrollView>(null);
  const hourScrollRef = useRef<ScrollView>(null);

  const dateList = useMemo(() => {
    const base = todayKey();
    const list: string[] = [];
    for (let i = -45; i <= 14; i++) {
      list.push(offsetDate(base, i));
    }
    if (initialDate && !list.includes(initialDate)) {
      list.unshift(initialDate);
      list.sort();
    }
    return list;
  }, [initialDate]);

  // Sync scroll position when opening modal
  useEffect(() => {
    if (visible) {
      const curDate = initialDate || todayKey();
      const curHour = (initialHour || '11:00').slice(0, 2);
      setTempDate(curDate);
      setTempHour(curHour);

      const dIdx = dateList.indexOf(curDate);
      const hIdx = HOURS.indexOf(curHour);

      const timer = setTimeout(() => {
        if (dIdx >= 0) {
          dateScrollRef.current?.scrollTo({ y: dIdx * ITEM_HEIGHT, animated: false });
        }
        if (hIdx >= 0) {
          hourScrollRef.current?.scrollTo({ y: hIdx * ITEM_HEIGHT, animated: false });
        }
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [visible, initialDate, initialHour, dateList]);

  const handleDateScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.max(0, Math.min(Math.round(y / ITEM_HEIGHT), dateList.length - 1));
    const target = dateList[idx];
    if (target && target !== tempDate) {
      setTempDate(target);
    }
  };

  const handleDateScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.max(0, Math.min(Math.round(y / ITEM_HEIGHT), dateList.length - 1));
    const target = dateList[idx];
    if (target) {
      setTempDate(target);
    }
  };

  const handleHourScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.max(0, Math.min(Math.round(y / ITEM_HEIGHT), HOURS.length - 1));
    const target = HOURS[idx];
    if (target && target !== tempHour) {
      setTempHour(target);
    }
  };

  const handleHourScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.max(0, Math.min(Math.round(y / ITEM_HEIGHT), HOURS.length - 1));
    const target = HOURS[idx];
    if (target) {
      setTempHour(target);
    }
  };

  const selectDateItem = (item: string, idx: number) => {
    setTempDate(item);
    dateScrollRef.current?.scrollTo({ y: idx * ITEM_HEIGHT, animated: true });
  };

  const selectHourItem = (item: string, idx: number) => {
    setTempHour(item);
    hourScrollRef.current?.scrollTo({ y: idx * ITEM_HEIGHT, animated: true });
  };

  const dateSelectedIndex = dateList.indexOf(tempDate);
  const hourSelectedIndex = HOURS.indexOf(tempHour);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={[
            styles.hourSheetContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 12 },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header: Title & Close Button */}
          <View style={styles.modalHeaderRow}>
            <View style={styles.modalHeaderPlaceholder} />
            <Text style={styles.modalHeaderTitle}>Lựa chọn ngày & giờ</Text>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={onClose}
              accessibilityLabel="Đóng"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <CloseXIcon size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* 2-Column Wheel Picker (Date & Hour) */}
          <View style={styles.pickerColumnsContainer}>
            {/* Highlight Bar covering the middle row */}
            <View style={styles.pickerHighlightBar} pointerEvents="none" />

            {/* Date Column */}
            <View style={styles.dateColumnWrapper}>
              <ScrollView
                ref={dateScrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                scrollEventThrottle={16}
                onScroll={handleDateScroll}
                onMomentumScrollEnd={handleDateScrollEnd}
                onScrollEndDrag={handleDateScrollEnd}
                contentContainerStyle={styles.wheelContentContainer}
              >
                {dateList.map((dKey, idx) => {
                  const diff = Math.abs(idx - dateSelectedIndex);
                  const isSelected = diff === 0;
                  return (
                    <TouchableOpacity
                      key={dKey}
                      style={styles.wheelItemBtn}
                      activeOpacity={0.8}
                      onPress={() => selectDateItem(dKey, idx)}
                    >
                      <Text
                        style={[
                          styles.wheelItemText,
                          isSelected && styles.wheelItemTextSelected,
                          diff === 1 && styles.wheelItemTextAdjacent,
                          diff >= 2 && styles.wheelItemTextDistant,
                        ]}
                        numberOfLines={1}
                      >
                        {formatPickerDate(dKey)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Hour Column */}
            <View style={styles.hourColumnWrapper}>
              <ScrollView
                ref={hourScrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                scrollEventThrottle={16}
                onScroll={handleHourScroll}
                onMomentumScrollEnd={handleHourScrollEnd}
                onScrollEndDrag={handleHourScrollEnd}
                contentContainerStyle={styles.wheelContentContainer}
              >
                {HOURS.map((hStr, idx) => {
                  const diff = Math.abs(idx - hourSelectedIndex);
                  const isSelected = diff === 0;
                  return (
                    <TouchableOpacity
                      key={hStr}
                      style={styles.wheelItemBtn}
                      activeOpacity={0.8}
                      onPress={() => selectHourItem(hStr, idx)}
                    >
                      <Text
                        style={[
                          styles.wheelItemText,
                          isSelected && styles.wheelItemTextSelected,
                          diff === 1 && styles.wheelItemTextAdjacent,
                          diff >= 2 && styles.wheelItemTextDistant,
                        ]}
                      >
                        {hStr}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          {/* "Lựa chọn" Confirm Button */}
          <TouchableOpacity
            style={styles.confirmChoiceBtn}
            activeOpacity={0.85}
            onPress={() => {
              const formattedHour = `${tempHour}:00`;
              onConfirm(tempDate, formattedHour);
            }}
          >
            <Text style={styles.confirmChoiceText}>Lựa chọn</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
