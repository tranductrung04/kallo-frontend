import React, { useMemo, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { ChevronLeftIcon } from '@/components/icons';
import { images } from '@/assets/images';
import { useTheme, type ThemeContextValue } from '@/theme';
import { useActivity } from '../ActivityProvider';
import { calculateCaloriesBurned } from '../utils';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { todayKey } from '@/features/nutrition/utils';

type Props = NativeStackScreenProps<RootStackParamList, 'RunningWorkout'>;

export function RunningWorkoutScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { width: screenWidth } = useWindowDimensions();
  const { addActivityLog } = useActivity();
  const { state: nutritionState } = useNutrition();

  const selectedDate = route.params?.date || nutritionState.selectedDate || todayKey();
  const activityTitle = route.params?.activityName || 'Chạy nhanh (Running)';

  // User weight fallback
  const userWeight =
    nutritionState.weightLogs.length > 0
      ? nutritionState.weightLogs[nutritionState.weightLogs.length - 1].weightKg
      : 65;

  const [distance, setDistance] = useState('0');
  const [duration, setDuration] = useState('0');
  const [calories, setCalories] = useState('');
  const [isManualCalories, setIsManualCalories] = useState(false);

  const distanceInputRef = useRef<TextInput>(null);
  const durationInputRef = useRef<TextInput>(null);
  const caloriesInputRef = useRef<TextInput>(null);

  // Compute calories automatically when distance or duration changes
  const updateCaloriesAuto = (newDistStr: string, newDurStr: string) => {
    if (isManualCalories) return;

    const distNum = parseFloat(newDistStr) || 0;
    const durNum = parseInt(newDurStr, 10) || 0;

    if (durNum > 0) {
      // MET for running is 8.3
      const burned = calculateCaloriesBurned(8.3, userWeight, durNum);
      setCalories(burned > 0 ? String(burned) : '');
    } else if (distNum > 0) {
      // Approximate calories based on distance: ~1.036 kcal / kg / km
      const burned = Math.round(distNum * userWeight * 1.036);
      setCalories(burned > 0 ? String(burned) : '');
    } else {
      setCalories('');
    }
  };

  const handleDistanceChange = (text: string) => {
    // Only allow valid decimal number
    const sanitized = text.replace(/[^0-9.]/g, '');
    setDistance(sanitized);
    updateCaloriesAuto(sanitized, duration);
  };

  const handleDurationChange = (text: string) => {
    // Only allow digits
    const sanitized = text.replace(/[^0-9]/g, '');
    setDuration(sanitized);
    updateCaloriesAuto(distance, sanitized);
  };

  const handleCaloriesChange = (text: string) => {
    const sanitized = text.replace(/[^0-9]/g, '');
    setCalories(sanitized);
    setIsManualCalories(sanitized.length > 0);
  };

  const handleDistanceFocus = () => {
    if (distance === '0') {
      setDistance('');
    }
  };

  const handleDistanceBlur = () => {
    if (!distance.trim()) {
      setDistance('0');
    }
  };

  const handleDurationFocus = () => {
    if (duration === '0') {
      setDuration('');
    }
  };

  const handleDurationBlur = () => {
    if (!duration.trim()) {
      setDuration('0');
    }
  };

  const distNum = parseFloat(distance) || 0;
  const durNum = parseInt(duration, 10) || 0;
  const calNum = parseInt(calories, 10) || 0;
  const canSave = distNum > 0 || durNum > 0 || calNum > 0;

  const handleSave = () => {
    if (!canSave) return;

    const finalDist = distNum > 0 ? distNum : undefined;
    const finalDur = durNum > 0 ? durNum : distNum > 0 ? Math.round(distNum * 6) : 30;
    const finalCal =
      calNum > 0
        ? calNum
        : durNum > 0
        ? calculateCaloriesBurned(8.3, userWeight, finalDur)
        : Math.round((distNum || 0) * userWeight * 1.036);

    addActivityLog({
      date: selectedDate,
      type: 'running',
      name: activityTitle,
      durationMinutes: finalDur,
      distanceKm: finalDist,
      caloriesBurned: finalCal,
      source: 'MANUAL',
    });

    navigation.goBack();
  };

  // Image width calculation
  const heroWidth = Math.min(screenWidth * 0.74, 280);
  const heroHeight = Math.round(heroWidth * (9 / 16));

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { paddingTop: Math.max(8, insets.top) }]}>
        <StatusBar
          barStyle={theme.scheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={c.canvasBase}
        />

        {/* ── Header ────────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <ChevronLeftIcon size={22} color={c.textPrimary} />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
              {activityTitle}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={!canSave}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.saveButton}
            accessibilityRole="button"
            accessibilityLabel="Lưu"
          >
            <Text style={[styles.saveText, canSave ? styles.saveTextActive : styles.saveTextDisabled]}>
              Lưu
            </Text>
          </TouchableOpacity>
        </View>

        {/* Subtle border under header */}
        <View style={styles.headerDivider} />

        {/* ── Hero Runner Image ─────────────────────────────── */}
        <View style={styles.heroWrapper}>
          <Image
            source={images.runningTrack}
            style={[styles.heroImage, { width: heroWidth, height: heroHeight }]}
            resizeMode="cover"
            accessibilityLabel="Chạy bộ"
          />
        </View>

        {/* ── Input Rows ───────────────────────────────────── */}
        <View style={styles.formContainer}>
          {/* Row 1: Khoảng cách */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => distanceInputRef.current?.focus()}
            style={styles.fieldRow}
          >
            <Text style={styles.fieldLabel}>Khoảng cách</Text>
            <View style={styles.fieldRight}>
              <TextInput
                ref={distanceInputRef}
                value={distance}
                onChangeText={handleDistanceChange}
                onFocus={handleDistanceFocus}
                onBlur={handleDistanceBlur}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={c.textDisabled}
                style={styles.fieldInput}
                selectionColor={c.brandSecondary}
              />
              <Text style={styles.fieldUnit}>Km</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.rowDivider} />

          {/* Row 2: Thời gian */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => durationInputRef.current?.focus()}
            style={styles.fieldRow}
          >
            <Text style={styles.fieldLabel}>Thời gian</Text>
            <View style={styles.fieldRight}>
              <TextInput
                ref={durationInputRef}
                value={duration}
                onChangeText={handleDurationChange}
                onFocus={handleDurationFocus}
                onBlur={handleDurationBlur}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={c.textDisabled}
                style={styles.fieldInput}
                selectionColor={c.brandSecondary}
              />
              <Text style={styles.fieldUnit}>Phút</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.rowDivider} />

          {/* Row 3: Calo tiêu thụ */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => caloriesInputRef.current?.focus()}
            style={styles.fieldRow}
          >
            <Text style={styles.fieldLabel}>Calo tiêu thụ</Text>
            <View style={styles.fieldRight}>
              <TextInput
                ref={caloriesInputRef}
                value={calories}
                onChangeText={handleCaloriesChange}
                keyboardType="numeric"
                placeholder=""
                placeholderTextColor={c.textDisabled}
                style={styles.fieldInput}
                selectionColor={c.brandSecondary}
              />
              <Text style={styles.fieldUnit}>Cal</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.rowDivider} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

function createStyles(theme: ThemeContextValue) {
  const { colors: c } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.canvasBase,
    },
    header: {
      height: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    backButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    titleContainer: {
      maxWidth: 210,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      color: c.textPrimary,
      fontSize: 18,
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      textAlign: 'center',
    },
    saveButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    saveText: {
      fontSize: 16,
      fontFamily: 'PlusJakartaSans_600SemiBold',
      fontWeight: '600',
    },
    saveTextDisabled: {
      color: c.textDisabled,
    },
    saveTextActive: {
      color: c.brandSecondary,
    },
    headerDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.surfaceBorder,
    },
    heroWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 26,
      marginBottom: 34,
    },
    heroImage: {
      borderRadius: 16,
    },
    formContainer: {
      paddingHorizontal: 20,
    },
    fieldRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 18,
    },
    fieldLabel: {
      color: c.textPrimary,
      fontSize: 16,
      fontFamily: 'PlusJakartaSans_400Regular',
    },
    fieldRight: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    fieldInput: {
      color: c.textPrimary,
      fontSize: 16,
      fontFamily: 'PlusJakartaSans_400Regular',
      textAlign: 'right',
      minWidth: 44,
      paddingVertical: 0,
      paddingHorizontal: 0,
      marginRight: 10,
    },
    fieldUnit: {
      color: c.textPrimary,
      fontSize: 16,
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      minWidth: 36,
      textAlign: 'right',
    },
    rowDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.surfaceBorder,
    },
  });
}
