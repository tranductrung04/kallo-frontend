import React, { useMemo, useRef, useState } from 'react';
import {
  Image,
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

type Props = NativeStackScreenProps<RootStackParamList, 'PickleballWorkout'>;

type IntensityOption = {
  key: string;
  label: string;
  met: number;
};

const INTENSITY_OPTIONS: IntensityOption[] = [
  {
    key: 'recreational',
    label: 'Nghiệp dư',
    met: 5.5,
  },
  {
    key: 'professional',
    label: 'Chuyên nghiệp',
    met: 7.0,
  },
];

export function PickleballWorkoutScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { addActivityLog } = useActivity();
  const { state: nutritionState } = useNutrition();

  const selectedDate = route.params?.date || nutritionState.selectedDate || todayKey();
  const activityTitle = route.params?.activityName || 'Pickleball';

  // User weight fallback
  const userWeight =
    nutritionState.weightLogs.length > 0
      ? nutritionState.weightLogs[nutritionState.weightLogs.length - 1].weightKg
      : 65;


  const [selectedIntensity, setSelectedIntensity] = useState<IntensityOption>(INTENSITY_OPTIONS[0]);
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
      type: 'pickleball',
      name: activityTitle,
      durationMinutes: finalDur,
      caloriesBurned: finalCal,
      source: 'MANUAL',
    });

    navigation.goBack();
  };

  // Image dimensions
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
            <Text style={styles.headerTitle} numberOfLines={1}>
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

        {/* ── Hero Pickleball Image ─────────────────────────── */}
        <View style={styles.heroWrapper}>
          <Image
            source={images.pickleballCourt}
            style={[styles.heroImage, { width: heroWidth, height: heroHeight }]}
            resizeMode="cover"
            accessibilityLabel="Pickleball"
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
              <Text style={styles.fieldValueText}>{selectedIntensity.label}</Text>
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
              <TouchableWithoutFeedback>
                <View style={[styles.modalSheet, { paddingBottom: Math.max(32, insets.bottom + 16) }]}>
                  <View style={styles.modalHandle} />

                  {INTENSITY_OPTIONS.map((opt, index) => {
                    const isLast = index === INTENSITY_OPTIONS.length - 1;
                    return (
                      <React.Fragment key={opt.key}>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => handleSelectIntensity(opt)}
                          style={styles.sheetOptionRow}
                          accessibilityRole="button"
                          accessibilityLabel={opt.label}
                        >
                          <Text style={styles.sheetOptionLabel}>{opt.label}</Text>
                          <ChevronRightIcon size={18} color={c.textSecondary} />
                        </TouchableOpacity>
                        {!isLast && <View style={styles.sheetDivider} />}
                      </React.Fragment>
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
      maxWidth: 240,
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
      color: c.textPrimary,
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
      color: c.textSecondary,
      fontSize: 16,
      fontFamily: 'PlusJakartaSans_400Regular',
    },
    fieldRight: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    fieldValueText: {
      color: c.textPrimary,
      fontSize: 16,
      fontFamily: 'PlusJakartaSans_600SemiBold',
      marginRight: 8,
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.72)',
      justifyContent: 'flex-end',
    },
    modalSheet: {
      backgroundColor: c.surfaceMid,
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      paddingTop: 12,
      paddingHorizontal: 20,
    },
    modalHandle: {
      width: 64,
      height: 5,
      backgroundColor: c.surfaceBorder,
      borderRadius: 2.5,
      alignSelf: 'center',
      marginBottom: 8,
    },
    sheetOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 18,
    },
    sheetOptionLabel: {
      color: c.textPrimary,
      fontSize: 16,
      fontFamily: 'PlusJakartaSans_500Medium',
    },
    sheetDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.surfaceBorder,
    },
  });
}

