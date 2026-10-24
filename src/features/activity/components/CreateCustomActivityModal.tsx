import React, { useRef, useState } from 'react';
import {
  Keyboard,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseXIcon } from '@/components/icons';
import { useTheme } from '@/theme';
import { calculateCaloriesBurned } from '../utils';

export type CreateCustomActivityModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, durationMinutes: number, caloriesBurned: number) => void;
  userWeight?: number;
};

export function CreateCustomActivityModal({
  visible,
  onClose,
  onSave,
  userWeight = 65,
}: CreateCustomActivityModalProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors: c } = theme;

  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('0');
  const [customDuration, setCustomDuration] = useState('0');
  const [isManualCustomCalories, setIsManualCustomCalories] = useState(false);

  const customDurationRef = useRef<TextInput>(null);
  const customCaloriesRef = useRef<TextInput>(null);

  const handleCustomDurationChange = (text: string) => {
    const sanitized = text.replace(/[^0-9]/g, '');
    setCustomDuration(sanitized);
    if (!isManualCustomCalories) {
      const dur = parseInt(sanitized, 10) || 0;
      if (dur > 0) {
        const cal = calculateCaloriesBurned(5.0, userWeight, dur);
        setCustomCalories(String(cal));
      } else {
        setCustomCalories('0');
      }
    }
  };

  const handleCustomCaloriesChange = (text: string) => {
    const sanitized = text.replace(/[^0-9]/g, '');
    setCustomCalories(sanitized);
    setIsManualCustomCalories(sanitized.length > 0 && sanitized !== '0');
  };

  const handleCustomDurationFocus = () => {
    if (customDuration === '0') {
      setCustomDuration('');
    }
  };

  const handleCustomDurationBlur = () => {
    if (!customDuration.trim()) {
      setCustomDuration('0');
    }
  };

  const handleCustomCaloriesFocus = () => {
    if (customCalories === '0') {
      setCustomCalories('');
    }
  };

  const handleCustomCaloriesBlur = () => {
    if (!customCalories.trim()) {
      setCustomCalories('0');
    }
  };

  const customDurNum = parseInt(customDuration, 10) || 0;
  const customCalNum = parseInt(customCalories, 10) || 0;
  const canSaveCustom = customName.trim().length > 0 && (customDurNum > 0 || customCalNum > 0);

  const handleSave = () => {
    if (!canSaveCustom) return;

    const finalDur = customDurNum > 0 ? customDurNum : 30;
    const finalCal =
      customCalNum > 0
        ? customCalNum
        : calculateCaloriesBurned(5.0, userWeight, finalDur);

    onSave(customName.trim(), finalDur, finalCal);

    // Reset fields
    setCustomName('');
    setCustomCalories('0');
    setCustomDuration('0');
    setIsManualCustomCalories(false);
  };

  const handleClose = () => {
    setCustomName('');
    setCustomCalories('0');
    setCustomDuration('0');
    setIsManualCustomCalories(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.createModalContainer, { backgroundColor: c.canvasBase, paddingTop: Math.max(8, insets.top) }]}>
          <StatusBar
            barStyle={theme.scheme === 'dark' ? 'light-content' : 'dark-content'}
            backgroundColor={c.canvasBase}
          />

          {/* Header: Centered Title & Close Icon */}
          <View style={styles.createModalHeader}>
            <View style={styles.createModalHeaderSpacer} />
            <Text style={[styles.createModalTitle, { color: c.textPrimary }]}>Tạo mới hoạt động</Text>
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.createModalCloseBtn}
              accessibilityRole="button"
              accessibilityLabel="Đóng"
            >
              <CloseXIcon size={20} color={c.textPrimary} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          {/* Form Rows */}
          <View style={styles.createModalBody}>
            {/* Row 1: Tên bài tập */}
            <View style={styles.createFieldRow}>
              <Text style={[styles.createFieldLabel, { color: c.textPrimary }]}>Tên bài tập</Text>
              <TextInput
                value={customName}
                onChangeText={setCustomName}
                placeholder="Nhập tên bài tập"
                placeholderTextColor={c.textDisabled}
                style={[styles.createNameInput, { color: c.textPrimary }]}
                selectionColor={c.brandPrimary}
              />
            </View>
            <View style={[styles.createRowDivider, { backgroundColor: c.surfaceBorder }]} />

            {/* Row 2: Calo tiêu thụ */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => customCaloriesRef.current?.focus()}
              style={styles.createFieldRow}
            >
              <Text style={[styles.createFieldLabel, { color: c.textPrimary }]}>Calo tiêu thụ</Text>
              <View style={styles.createRightValueGroup}>
                <TextInput
                  ref={customCaloriesRef}
                  value={customCalories}
                  onChangeText={handleCustomCaloriesChange}
                  onFocus={handleCustomCaloriesFocus}
                  onBlur={handleCustomCaloriesBlur}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={c.textDisabled}
                  style={[styles.createNumberInput, { color: c.textPrimary }]}
                  selectionColor={c.brandPrimary}
                />
                <Text style={[styles.createFieldUnit, { color: c.textSecondary }]}>Cal</Text>
              </View>
            </TouchableOpacity>
            <View style={[styles.createRowDivider, { backgroundColor: c.surfaceBorder }]} />

            {/* Row 3: Thời gian luyện tập */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => customDurationRef.current?.focus()}
              style={styles.createFieldRow}
            >
              <Text style={[styles.createFieldLabel, { color: c.textPrimary }]}>Thời gian luyện tập</Text>
              <View style={styles.createRightValueGroup}>
                <TextInput
                  ref={customDurationRef}
                  value={customDuration}
                  onChangeText={handleCustomDurationChange}
                  onFocus={handleCustomDurationFocus}
                  onBlur={handleCustomDurationBlur}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={c.textDisabled}
                  style={[styles.createNumberInput, { color: c.textPrimary }]}
                  selectionColor={c.brandPrimary}
                />
                <Text style={[styles.createFieldUnit, { color: c.textSecondary }]}>Phút</Text>
              </View>
            </TouchableOpacity>
            <View style={[styles.createRowDivider, { backgroundColor: c.surfaceBorder }]} />
          </View>

          {/* Bottom Button */}
          <View style={[styles.createModalFooter, { paddingBottom: Math.max(20, insets.bottom + 12) }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSave}
              disabled={!canSaveCustom}
              style={[
                styles.createModalSaveBtn,
                canSaveCustom
                  ? { backgroundColor: c.brandPrimary }
                  : { backgroundColor: c.surfaceHigh },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Lưu bài tập"
            >
              <Text
                style={[
                  styles.createModalSaveText,
                  canSaveCustom
                    ? { color: c.onBrand }
                    : { color: c.textDisabled },
                ]}
              >
                Lưu bài tập
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  createModalContainer: {
    flex: 1,
  },
  createModalHeader: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 32,
  },
  createModalHeaderSpacer: {
    width: 44,
    height: 44,
  },
  createModalTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
    textAlign: 'center',
  },
  createModalCloseBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  createModalBody: {
    paddingHorizontal: 20,
    marginTop: 16,
    flex: 1,
  },
  createFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  createFieldLabel: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  createNameInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_500Medium',
    textAlign: 'right',
    marginLeft: 16,
    paddingVertical: 0,
  },
  createRightValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-end',
  },
  createNumberInput: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontWeight: '600',
    textAlign: 'right',
    minWidth: 32,
    paddingVertical: 0,
    paddingHorizontal: 4,
  },
  createFieldUnit: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_500Medium',
    minWidth: 32,
  },
  createRowDivider: {
    height: StyleSheet.hairlineWidth,
  },
  createModalFooter: {
    paddingHorizontal: 20,
  },
  createModalSaveBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createModalSaveText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
  },
});
