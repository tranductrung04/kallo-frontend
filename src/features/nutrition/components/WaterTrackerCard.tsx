import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppInput, AppText, ProgressBar } from '@/components/common';
import { useTheme } from '@/theme';
import { formatNumber } from '../utils';

export function WaterTrackerCard({ amountMl, goalMl, onAdd }: { amountMl: number; goalMl: number; onAdd: (amount: number) => void }) {
  const theme = useTheme();
  const [custom, setCustom] = useState('');
  const submit = () => { const amount = Number(custom); if (amount > 0 && amount <= 5000) { onAdd(amount); setCustom(''); } };
  return <AppCard accessibilityLabel="Theo dõi nước uống hôm nay" style={styles.card}>
    <View style={styles.header}><View style={styles.title}><Image source={images.trackerDroplet} style={styles.droplet} accessibilityLabel="Nước uống" /><View><AppText variant="heading">Nước uống</AppText><AppText variant="caption" color={theme.colors.textMuted}>{formatNumber(amountMl)} / {formatNumber(goalMl)} ml</AppText></View></View><AppText variant="heading" color={theme.colors.water}>{Math.round((amountMl / Math.max(goalMl, 1)) * 100)}%</AppText></View>
    <ProgressBar value={amountMl / Math.max(goalMl, 1)} color={theme.colors.water} />
    <View style={styles.cups}>{[0, 1, 2, 3, 4, 5].map((index) => <Image key={index} source={index < Math.ceil(amountMl / 250) ? images.waterCup : images.trackerFillEmpty} style={styles.cup} accessibilityLabel={index < Math.ceil(amountMl / 250) ? 'Cốc nước đã uống' : 'Cốc nước chưa uống'} />)}</View>
    <View style={styles.actions}><AppButton label="+ 250 ml" variant="secondary" onPress={() => onAdd(250)} accessibilityLabel="Thêm 250 ml nước" /><View style={styles.custom}><View style={styles.customField}><AppInput value={custom} onChangeText={setCustom} placeholder="ml khác" keyboardType="number-pad" accessibilityLabel="Lượng nước tùy chỉnh" /></View><AppButton label="Thêm" variant="outline" onPress={submit} /></View></View>
  </AppCard>;
}
const styles = StyleSheet.create({ card: { gap: 12 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, title: { flexDirection: 'row', alignItems: 'center', gap: 10 }, droplet: { width: 28, height: 28, resizeMode: 'contain' }, cups: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }, cup: { width: 34, height: 42, resizeMode: 'contain' }, actions: { gap: 8 }, custom: { flexDirection: 'row', alignItems: 'center', gap: 8 }, customField: { flex: 1 } });
