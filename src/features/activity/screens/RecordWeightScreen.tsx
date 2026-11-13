import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { RootStackParamList } from '@/navigation/types';
import { CalendarIcon, CloseXIcon, PlusIcon } from '@/components/icons';
import { MonthCalendarModal } from '@/components/common/MonthCalendarModal';
import { todayKey } from '@/features/nutrition/utils';
import { useNutrition } from '@/features/nutrition/NutritionProvider';

import { useTheme } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'RecordWeight'>;

// Large Picture/Image Placeholder SVG matching the filled rounded glyph in the reference
function PhotoPlaceholderIcon({ size = 76, color, bgColor }: { size?: number; color: string; bgColor: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Outer rounded squircle body */}
      <Rect x="2" y="4" width="60" height="56" rx="16" fill={color} />
      {/* Sun circle cutout */}
      <Circle cx="20" cy="20" r="6" fill={bgColor} />
      {/* Mountain hills cutout */}
      <Path
        d="M2 46 C12 36, 20 34, 28 41 C36 48, 44 38, 54 44 C58 46, 60 49, 62 52 L62 50 C62 55.5 57.5 60 52 60 L12 60 C6.5 60 2 55.5 2 50 Z"
        fill={bgColor}
      />
    </Svg>
  );
}

export function RecordWeightScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors: c } = theme;
  const { state: nutritionState, addWeight } = useNutrition();

  const weightLogs = nutritionState.weightLogs || [];
  const initialWeightVal =
    route.params?.initialWeight ??
    (weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weightKg : 50);

  const [weight, setWeight] = useState(initialWeightVal);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [recordDate, setRecordDate] = useState<string>(route.params?.date || todayKey());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isDirectInputVisible, setIsDirectInputVisible] = useState(false);
  const [manualInputVal, setManualInputVal] = useState(String(initialWeightVal));

  // Date format e.g. "24 / 10 / 2026"
  const formattedDate = useMemo(() => {
    try {
      const parts = recordDate.split('-');
      if (parts.length === 3) {
        return `${parts[2]} / ${parts[1]} / ${parts[0]}`;
      }
    } catch {}
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    return `${d} / ${m} / ${y}`;
  }, [recordDate]);

  const targetWeight = 60; // 60Kg target from reference

  const handleDecrease = () => {
    setWeight((prev) => Math.max(20, Number((prev - 0.5).toFixed(1))));
  };

  const handleIncrease = () => {
    setWeight((prev) => Math.min(300, Number((prev + 0.5).toFixed(1))));
  };

  const handleAddPhoto = () => {
    Alert.alert('Thêm ảnh chụp', 'Chọn nguồn ảnh', [
      { text: 'Chụp ảnh mới', onPress: () => Alert.alert('Thông báo', 'Đã chụp ảnh tiến trình') },
      { text: 'Chọn từ thư viện', onPress: () => Alert.alert('Thông báo', 'Đã chọn ảnh từ thư viện') },
      { text: 'Hủy', style: 'cancel' },
    ]);
  };

  const handleConfirmManualWeight = () => {
    const parsed = parseFloat(manualInputVal.replace(',', '.'));
    if (!isNaN(parsed) && parsed >= 20 && parsed <= 300) {
      setWeight(Number(parsed.toFixed(1)));
    }
    setIsDirectInputVisible(false);
  };

  const handleSave = () => {
    addWeight(recordDate, weight);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: c.canvasBase, paddingTop: Math.max(12, insets.top) }]}>
      <StatusBar
        barStyle={theme.scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={c.canvasBase}
      />

      {/* ── Header ────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerPlaceholder} />
        <Text style={[styles.headerTitle, { color: c.textPrimary }]}>Ghi lại cân nặng</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Đóng"
        >
          <CloseXIcon size={22} color={c.textPrimary} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Photo Placeholder Box ─────────────────────────── */}
        <View style={styles.photoSection}>
          <TouchableOpacity
            style={[styles.photoBox, { backgroundColor: c.surfaceHigh }]}
            onPress={handleAddPhoto}
            activeOpacity={0.8}
            accessibilityLabel="Thêm ảnh chụp"
            accessibilityRole="button"
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photoPreview} resizeMode="cover" />
            ) : (
              <PhotoPlaceholderIcon size={76} color={c.surfaceBorder} bgColor={c.surfaceHigh} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addPhotoBtn}
            onPress={handleAddPhoto}
            activeOpacity={0.8}
          >
            <PlusIcon size={16} color={c.brandSecondary} strokeWidth={2.5} />
            <Text style={[styles.addPhotoBtnText, { color: c.brandSecondary }]}>Thêm ảnh chụp</Text>
          </TouchableOpacity>
        </View>

        {/* ── Current Weight Label & Target ──────────────────── */}
        <Text style={[styles.currentWeightHeading, { color: c.textPrimary }]}>Cân nặng hiện tại</Text>
        <Text style={[styles.targetWeightSubtitle, { color: c.textSecondary }]}>Mục tiêu: {targetWeight}Kg</Text>

        {/* ── Stepper Row: (-) 50 Kg (+) ────────────────────── */}
        <View style={styles.stepperRow}>
          <TouchableOpacity
            style={[styles.stepperCircleBtn, { backgroundColor: c.surfaceHigh }]}
            onPress={handleDecrease}
            activeOpacity={0.7}
            accessibilityLabel="Giảm cân nặng"
            accessibilityRole="button"
          >
            <Text style={[styles.stepperMinusText, { color: c.textPrimary }]}>−</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.weightDisplay}
            onPress={() => {
              setManualInputVal(String(weight));
              setIsDirectInputVisible(true);
            }}
            activeOpacity={0.8}
            accessibilityLabel="Nhập cân nặng trực tiếp"
            accessibilityRole="button"
          >
            <Text style={[styles.weightNumberText, { color: c.textPrimary }]}>
              {weight}{' '}
              <Text style={[styles.weightUnitText, { color: c.textPrimary }]}>Kg</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stepperCircleBtn, { backgroundColor: c.surfaceHigh }]}
            onPress={handleIncrease}
            activeOpacity={0.7}
            accessibilityLabel="Tăng cân nặng"
            accessibilityRole="button"
          >
            <Text style={[styles.stepperPlusText, { color: c.textPrimary }]}>+</Text>
          </TouchableOpacity>
        </View>

        {/* ── Date Row: Ngày cân | 24 / 10 / 2026 [calendar] ─── */}
        <TouchableOpacity
          style={[styles.dateRow, { borderBottomColor: c.surfaceBorder }]}
          onPress={() => setIsCalendarVisible(true)}
          activeOpacity={0.7}
          accessibilityLabel="Chọn ngày cân"
          accessibilityRole="button"
        >
          <Text style={[styles.dateLabel, { color: c.textSecondary }]}>Ngày cân</Text>

          <View style={styles.dateValueGroup}>
            <Text style={[styles.dateValueText, { color: c.textPrimary }]}>{formattedDate}</Text>
            <CalendarIcon size={18} color={c.textPrimary} />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Bottom Save Button: Lưu cân nặng ──────────────── */}
      <View style={[styles.footer, { paddingBottom: Math.max(20, insets.bottom + 12) }]}>
        <TouchableOpacity
          style={[
            styles.saveBtn,
            {
              backgroundColor: c.brandPrimary,
              shadowColor: c.brandPrimary,
            },
          ]}
          onPress={handleSave}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Lưu cân nặng"
        >
          <Text style={[styles.saveBtnText, { color: c.onBrand }]}>Lưu cân nặng</Text>
        </TouchableOpacity>
      </View>

      {/* ── Date Picker Modal ─────────────────────────────── */}
      <MonthCalendarModal
        visible={isCalendarVisible}
        date={recordDate}
        onSelectDate={(newDate) => {
          setRecordDate(newDate);
          setIsCalendarVisible(false);
        }}
        onClose={() => setIsCalendarVisible(false)}
      />

      {/* ── Direct Weight Input Modal ───────────────────────── */}
      <Modal
        visible={isDirectInputVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDirectInputVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setIsDirectInputVisible(false)} />
          <View style={[styles.directInputCard, { backgroundColor: c.surfaceMid }]}>
            <Text style={[styles.directInputTitle, { color: c.textPrimary }]}>Nhập cân nặng (Kg)</Text>
            <TextInput
              style={[styles.directInputField, { backgroundColor: c.surfaceHigh, color: c.textPrimary }]}
              value={manualInputVal}
              onChangeText={setManualInputVal}
              keyboardType="decimal-pad"
              autoFocus
              selectTextOnFocus
              maxLength={5}
            />
            <View style={styles.directInputBtnRow}>
              <TouchableOpacity
                style={[styles.directInputCancelBtn, { backgroundColor: c.surfaceHigh }]}
                onPress={() => setIsDirectInputVisible(false)}
              >
                <Text style={[styles.directInputCancelText, { color: c.textSecondary }]}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.directInputSaveBtn, { backgroundColor: c.brandPrimary }]}
                onPress={handleConfirmManualWeight}
              >
                <Text style={[styles.directInputSaveText, { color: c.onBrand }]}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerPlaceholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  photoBox: {
    width: 136,
    height: 136,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  addPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
  },
  addPhotoBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  currentWeightHeading: {
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  targetWeightSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    marginBottom: 44,
  },
  stepperCircleBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperMinusText: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 28,
  },
  stepperPlusText: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  weightDisplay: {
    minWidth: 150,
    alignItems: 'center',
  },
  weightNumberText: {
    fontSize: 42,
    fontWeight: '800',
  },
  weightUnitText: {
    fontSize: 28,
    fontWeight: '700',
  },
  dateRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  dateLabel: {
    fontSize: 15.5,
    fontWeight: '500',
  },
  dateValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateValueText: {
    fontSize: 15.5,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  saveBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  directInputCard: {
    width: 280,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  directInputTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  directInputField: {
    width: 140,
    height: 48,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  directInputBtnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  directInputCancelBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directInputCancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  directInputSaveBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directInputSaveText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
