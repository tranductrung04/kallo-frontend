import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppText } from '@/components/common';
import { AppInput } from '@/components/common/AppInput';
import { ChevronLeftIcon, LockClosedIcon } from '@/components/icons';
import { useTheme } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'HealthMetrics'>;

type Metric = {
  id: string;
  label: string;
  unit: string;
  locked: boolean;
};

const METRICS: Metric[] = [
  { id: 'weight', label: 'Cân nặng', unit: 'kg', locked: false },
  { id: 'bodyFat', label: 'Tỉ lệ mỡ', unit: '%', locked: false },
  { id: 'muscle', label: 'Khối lượng cơ', unit: '%', locked: true },
  { id: 'neck', label: 'Vòng cổ', unit: 'cm', locked: true },
  { id: 'chest', label: 'Vòng ngực', unit: 'cm', locked: true },
  { id: 'arm', label: 'Bắp tay', unit: 'cm', locked: true },
  { id: 'waist', label: 'Vòng eo', unit: 'cm', locked: false },
  { id: 'hip', label: 'Vòng hông', unit: 'cm', locked: true },
  { id: 'glute', label: 'Vòng mông', unit: 'cm', locked: true },
  { id: 'thigh', label: 'Bắp đùi', unit: 'cm', locked: true },
];

const LOCK_BG = '#F59E0B'; // yellow/gold lock badge

export function HealthMetricsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors: c } = theme;

  const [values, setValues] = useState<Record<string, string>>(
    METRICS.reduce((acc, m) => ({ ...acc, [m.id]: '0' }), {})
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const unlocked = METRICS.filter((m) => !m.locked);
  const hasValue = unlocked.some((m) => parseFloat(values[m.id]) > 0);

  const openEdit = (id: string) => {
    setEditValue(values[id]);
    setEditingId(id);
  };

  const saveEdit = () => {
    const parsed = parseFloat(editValue);
    if (!Number.isFinite(parsed) || parsed < 0) return;
    setValues((prev) => ({ ...prev, [editingId!]: String(parsed) }));
    setEditingId(null);
  };

  const handleSave = () => {
    if (!hasValue) return;
    navigation.goBack();
  };

  return (
    <View style={[styles.safe, { backgroundColor: c.canvasBase, paddingTop: Math.max(12, insets.top) }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backBtn}
        >
          <ChevronLeftIcon size={22} color={c.textPrimary} strokeWidth={2.2} />
        </Pressable>
        <AppText variant="headlineMd" color={c.textPrimary} style={styles.date}>
          17 thg 11
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      <AppText variant="headlineLg" style={styles.title} color={c.textPrimary}>
        Nhập chỉ số sức khỏe
      </AppText>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {METRICS.map((m) => (
          <View key={m.id} style={styles.row}>
            <AppText variant="bodyLg" color={c.textPrimary} style={styles.label}>
              {m.label}
            </AppText>
            {m.locked ? (
              <View style={styles.lockedBadge}>
                <LockClosedIcon size={14} color="#FFFFFF" strokeWidth={1.8} />
              </View>
            ) : (
              <Pressable
                onPress={() => openEdit(m.id)}
                accessibilityLabel={`Chỉnh sửa ${m.label}`}
                accessibilityRole="button"
              >
                <View style={styles.valueWrap}>
                  <AppText variant="bodyLg" color={c.textPrimary} style={styles.value}>
                    {values[m.id]}
                  </AppText>
                  <AppText variant="bodyLg" color={c.textSecondary} style={styles.unit}>
                    {m.unit}
                  </AppText>
                </View>
              </Pressable>
            )}
          </View>
        ))}

        <View style={styles.guideRow}>
          <View style={styles.questionBadge}>
            <AppText variant="bodyMd" color="#FFFFFF" style={styles.questionText}>
              ?
            </AppText>
          </View>
          <Pressable onPress={() => navigation.navigate('MeasurementGuide')} style={styles.guideLink}>
            <AppText variant="bodyMd" color={c.brandPrimary} style={styles.guideText}>
              Hướng dẫn đo các chỉ số
            </AppText>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          label="Lưu chỉ số"
          variant="primary"
          disabled={!hasValue}
          onPress={handleSave}
          style={styles.saveBtn}
        />
      </View>

      {/* Edit modal */}
      <Modal
        visible={editingId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingId(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setEditingId(null)} />
          <View style={[styles.modalCard, { backgroundColor: c.surfaceMid }]}>
            <AppText variant="headlineMd" color={c.textPrimary} style={styles.modalTitle}>
              Nhập giá trị
            </AppText>
            <AppInput
              label={METRICS.find((m) => m.id === editingId)?.label}
              value={editValue}
              onChangeText={setEditValue}
              keyboardType="decimal-pad"
              autoFocus
              style={styles.modalInput}
            />
            <View style={styles.modalBtnRow}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: c.surfaceHigh }]}
                onPress={() => setEditingId(null)}
              >
                <AppText variant="labelLg" color={c.textSecondary} align="center">
                  Hủy
                </AppText>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: c.brandPrimary }]}
                onPress={saveEdit}
              >
                <AppText variant="labelLg" color={c.onBrand} align="center">
                  Xác nhận
                </AppText>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: { width: 44 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: themeBorder(),
  },
  label: {},
  lockedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: LOCK_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueWrap: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  value: {},
  unit: {},
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 10,
  },
  questionBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: { fontSize: 16, fontWeight: '700', lineHeight: 28 },
  guideLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  guideText: { fontWeight: '600' },
  footer: { paddingHorizontal: 16, paddingVertical: 12 },
  saveBtn: { borderRadius: 9999 },
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalCard: {
    width: '88%',
    maxWidth: 300,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: { marginBottom: 16, textAlign: 'center' },
  modalInput: { width: '100%', marginBottom: 20 },
  modalBtnRow: { flexDirection: 'row', gap: 10, width: '100%' },
  modalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function themeBorder() {
  return '#322B48';
}
