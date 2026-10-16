import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppInput, AppText } from '@/components/common';
import { useTheme } from '@/theme';
import { formatNumber } from '../utils';

export function WeightTrackerCard({ weightKg, targetKg, onSave }: { weightKg?: number; targetKg: number; onSave: (weight: number) => void }) {
  const theme = useTheme();
  const [value, setValue] = useState('');
  const save = () => { const weight = Number(value); if (weight >= 20 && weight <= 300) { onSave(weight); setValue(''); } };
  return <AppCard style={styles.card} accessibilityLabel="Theo dõi cân nặng">
    <View style={styles.header}><View style={styles.title}><Image source={images.trackerWeight} style={styles.image} accessibilityLabel="Cân nặng" /><View><AppText variant="heading">Cân nặng</AppText><AppText variant="caption" color={theme.colors.textMuted}>Mục tiêu {formatNumber(targetKg, 1)} kg</AppText></View></View><AppText variant="display">{weightKg === undefined ? '--' : formatNumber(weightKg, 1)} <AppText variant="body">kg</AppText></AppText></View>
    <View style={styles.form}><AppInput value={value} onChangeText={setValue} placeholder="Nhập cân nặng hôm nay" keyboardType="decimal-pad" accessibilityLabel="Cân nặng hôm nay" /><AppButton label="Cập nhật" variant="outline" onPress={save} /></View>
  </AppCard>;
}
const styles = StyleSheet.create({ card: { gap: 12 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }, title: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }, image: { width: 34, height: 34, resizeMode: 'contain' }, form: { flexDirection: 'row', alignItems: 'center', gap: 8 } });
