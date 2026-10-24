import React, { useMemo, useRef, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Keyboard,
  Modal,
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
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';
import { images } from '@/assets/images';
import { useTheme, type ThemeContextValue } from '@/theme';
import { useActivity } from '../ActivityProvider';
import { calculateCaloriesBurned } from '../utils';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { todayKey } from '@/features/nutrition/utils';

type Props = NativeStackScreenProps<RootStackParamList, 'ActivityWorkout'>;

export type IntensityOption = {
  key: string;
  label: string;
  met: number;
};

// Sport image resolver
function getSportImage(activityId: string, activityName: string): ImageSourcePropType {
  const idLower = (activityId || '').toLowerCase();
  const nameLower = (activityName || '').toLowerCase();

  if (idLower.includes('australian_football') || nameLower.includes('bầu dục úc')) {
    return images.australianFootball;
  }
  if (nameLower.includes('chạy') || nameLower.includes('run') || nameLower.includes('marathon') || nameLower.includes('điền kinh')) {
    return images.runningTrack;
  }
  if (nameLower.includes('đạp xe') || nameLower.includes('cycl')) {
    return images.cyclingTrack;
  }
  if (nameLower.includes('cầu lông') || nameLower.includes('badminton')) {
    return images.badmintonCourt;
  }
  if (nameLower.includes('pickleball')) {
    return images.pickleballCourt;
  }
  if (nameLower.includes('yoga') || nameLower.includes('thiền') || nameLower.includes('giãn cơ') || nameLower.includes('pilates')) {
    return images.yogaPractice;
  }

  // Default to Australian football or running track as high-energy sport image
  return images.australianFootball;
}

export function ActivityWorkoutScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { addActivityLog } = useActivity();
  const { state: nutritionState } = useNutrition();


  const { activityId, activityName, met: initialMet, date } = route.params;
  const selectedDate = date || nutritionState.selectedDate || todayKey();
  const activityTitle = activityName || 'Hoạt động';
  const baseMet = initialMet || 6.0;

  // User weight fallback
  const userWeight =
    nutritionState.weightLogs.length > 0
      ? nutritionState.weightLogs[nutritionState.weightLogs.length - 1].weightKg
      : 65;

  // Short label for default display (e.g. "Bóng bầu dục Úc" from "Bóng bầu dục Úc (Australian Football)")
  const shortName = useMemo(() => {
    const parenIndex = activityTitle.indexOf('(');
    if (parenIndex > 0) {
      return activityTitle.substring(0, parenIndex).trim();
    }
    return activityTitle;
  }, [activityTitle]);

  // Dynamic intensity options
  const intensityOptions = useMemo<IntensityOption[]>(() => {
    return [
      {
        key: 'standard',
        label: shortName,
        met: baseMet,
      },
      {
        key: 'moderate',
        label: `${shortName} (Vừa phải)`,
        met: Math.round(baseMet * 0.85 * 10) / 10,
      },
      {
        key: 'intense',
        label: `${shortName} (Cường độ cao)`,
        met: Math.round(baseMet * 1.25 * 10) / 10,
      },
    ];
  }, [shortName, baseMet]);

  const [selectedIntensity, setSelectedIntensity] = useState<IntensityOption>(intensityOptions[0]);
  const [levelModalVisible, setLevelModalVisible] = useState(false);
  const [duration, setDuration] = useState('0');
  const [calories, setCalories] = useState('');
  const [isManualCalories, setIsManualCalories] = useState(false);

  const durationInputRef = useRef<TextInput>(null);
  const caloriesInputRef = useRef<TextInput>(null);

  // Compute calories automatically based on duration and intensity MET
  const updateCaloriesAuto = (newDurStr: string, currentMet: number) => {
    if (isManualCalories) return;

    const durNum = parseInt(newDurStr, 10) || 0;
    if (durNum > 0) {
      const burned = calculateCaloriesBurned(currentMet, userWeight, durNum);
      setCalories(burned > 0 ? String(burned) : '');
    } else {
      setCalories('');
    }
  };

  const handleSelectIntensity = (option: IntensityOption) => {
    setSelectedIntensity(option);
    setLevelModalVisible(false);
    updateCaloriesAuto(duration, option.met);
  };

  const handleDurationChange = (text: string) => {
    const sanitized = text.replace(/[^0-9]/g, '');
    setDuration(sanitized);
    updateCaloriesAuto(sanitized, selectedIntensity.met);
  };

  const handleCaloriesChange = (text: string) => {
    const sanitized = text.replace(/[^0-9]/g, '');
    setCalories(sanitized);
    setIsManualCalories(sanitized.length > 0);
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

  const durNum = parseInt(duration, 10) || 0;
  const calNum = parseInt(calories, 10) || 0;
  const canSave = durNum > 0 || calNum > 0;

  const handleSave = () => {
    if (!canSave) return;

    const finalDur = durNum > 0 ? durNum : 30;
    const finalCal =
      calNum > 0
        ? calNum
        : calculateCaloriesBurned(selectedIntensity.met, userWeight, finalDur);

    addActivityLog({
      date: selectedDate,
      type: 'other',
      name: activityTitle,
      durationMinutes: finalDur,
      caloriesBurned: finalCal,
      source: 'MANUAL',
    });

    navigation.goBack();
  };

  // Image dimensions matching screenshots
  const heroWidth = Math.min(screenWidth * 0.74, 280);
  const heroHeight = Math.round(heroWidth * (9 / 16));
  const heroImageSource = getSportImage(activityId, activityTitle);

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

        {/* ── Hero Sport Image ─────────────────────────────── */}
        <View style={styles.heroWrapper}>
          <Image
            source={heroImageSource}
            style={[styles.heroImage, { width: heroWidth, height: heroHeight }]}
            resizeMode="cover"
            accessibilityLabel={activityTitle}
          />
        </View>

        {/* ── Input Rows ───────────────────────────────────── */}
        <View style={styles.formContainer}>
          {/* Row 1: Mức độ */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setLevelModalVisible(true)}
            style={styles.fieldRow}
            accessibilityRole="button"
            accessibilityLabel={`Mức độ: ${selectedIntensity.label}`}
          >
            <Text style={styles.fieldLabel}>Mức độ</Text>
            <View style={styles.fieldRight}>
              <Text style={styles.fieldValueText} numberOfLines={1}>
                {selectedIntensity.label}
              </Text>
              <ChevronRightIcon size={18} color={c.textSecondary} />
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

        {/* ── Modal chọn Mức độ (Bottom Sheet) ─────────────── */}
        <Modal
          visible={levelModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setLevelModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setLevelModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View
                  style={[
                    styles.bottomSheet,
                    { paddingBottom: Math.max(24, insets.bottom + 16) },
                  ]}
                >
                  {/* Handle bar */}
                  <View style={styles.sheetHandle} />

                  <Text style={styles.sheetTitle}>Chọn mức độ hoạt động</Text>

                  {intensityOptions.map((option) => {
                    const isSelected = selectedIntensity.key === option.key;
                    return (
                      <TouchableOpacity
                        key={option.key}
                        activeOpacity={0.7}
                        onPress={() => handleSelectIntensity(option)}
                        style={[
                          styles.intensityOptionRow,
                          isSelected && styles.intensityOptionRowSelected,
                        ]}
                      >
                        <View style={styles.intensityOptionInfo}>
                          <Text
                            style={[
                              styles.intensityOptionText,
                              isSelected && styles.intensityOptionTextSelected,
                            ]}
                          >
                            {option.label}
                          </Text>
                          <Text style={styles.intensityMetText}>
                            {option.met.toFixed(1)} MET
                          </Text>
                        </View>
                        {isSelected && (
                          <View style={styles.checkCircle}>
                            <View style={styles.checkInner} />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
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
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
    },
    saveTextActive: {
      color: c.brandSecondary,
    },
    saveTextDisabled: {
      color: c.textDisabled,
    },
    headerDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.surfaceBorder,
    },
    heroWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 24,
      marginBottom: 28,
    },
    heroImage: {
      borderRadius: 16,
      backgroundColor: c.surfaceHigh,
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
      color: c.textSecondary,
      fontSize: 16,
      fontFamily: 'PlusJakartaSans_500Medium',
    },
    fieldRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      maxWidth: '65%',
      justifyContent: 'flex-end',
    },
    fieldValueText: {
      color: c.textPrimary,
      fontSize: 16,
      fontFamily: 'PlusJakartaSans_500Medium',
      marginRight: 4,
    },
    fieldInput: {
      color: c.textPrimary,
      fontSize: 16,
      fontFamily: 'PlusJakartaSans_600SemiBold',
      fontWeight: '600',
      textAlign: 'right',
      minWidth: 40,
      paddingVertical: 0,
      paddingHorizontal: 4,
    },
    fieldUnit: {
      color: c.textPrimary,
      fontSize: 16,
      fontFamily: 'PlusJakartaSans_500Medium',
      minWidth: 32,
    },
    rowDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.surfaceBorder,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      justifyContent: 'flex-end',
    },
    bottomSheet: {
      backgroundColor: c.surfaceMid,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 12,
      paddingHorizontal: 20,
    },
    sheetHandle: {
      width: 38,
      height: 4,
      borderRadius: 2,
      backgroundColor: c.surfaceBorder,
      alignSelf: 'center',
      marginBottom: 16,
    },
    sheetTitle: {
      color: c.textPrimary,
      fontSize: 18,
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      marginBottom: 14,
      textAlign: 'center',
    },
    intensityOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderRadius: 14,
      marginBottom: 8,
      backgroundColor: c.surfaceHigh,
    },
    intensityOptionRowSelected: {
      backgroundColor: c.surfaceHigh,
      borderWidth: 1,
      borderColor: c.brandSecondary,
    },
    intensityOptionInfo: {
      flex: 1,
    },
    intensityOptionText: {
      color: c.textPrimary,
      fontSize: 15,
      fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    intensityOptionTextSelected: {
      color: c.brandSecondary,
      fontWeight: '700',
    },
    intensityMetText: {
      color: c.textSecondary,
      fontSize: 13,
      fontFamily: 'PlusJakartaSans_400Regular',
      marginTop: 2,
    },
    checkCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: c.brandSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 12,
    },
    checkInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: c.brandSecondary,
    },
  });
}

