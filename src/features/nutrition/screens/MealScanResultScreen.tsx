import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppText, EmptyStateView, LoadingOverlay } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { images } from '@/assets/images';
import { useNutrition } from '../NutritionProvider';
import { recognizeFood } from '../api';
import { formatNumber } from '../utils';
import { MEAL_SLOTS, type MealSlot } from '../types';
import type { RecognitionItem, RecognitionResponse } from '../scanTypes';
import { useTheme } from '@/theme';

const clamp = (value: number) => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
const clampFactor = (value: number) => Math.min(2, Math.max(0.5, value));
type Props = NativeStackScreenProps<RootStackParamList, 'MealScanResult'>;
type SelectedItem = { item: RecognitionItem; factor: number; name: string };

function responseBody(value: RecognitionResponse | { data?: RecognitionResponse }): RecognitionResponse {
  if ('items' in value) return value;
  return value.data ?? { items: [] };
}

export function MealScanResultScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { addFoodLog } = useNutrition();
  const [response, setResponse] = useState<RecognitionResponse>();
  const [error, setError] = useState<string>();
  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const [meal, setMeal] = useState<MealSlot>(route.params.meal);
  const [saving, setSaving] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackConsent, setFeedbackConsent] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
  const [sourceSize, setSourceSize] = useState({ width: 1, height: 1 });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    void recognizeFood(route.params.imageUri).then((value) => {
      if (!active) return;
      const next = responseBody(value as RecognitionResponse | { data?: RecognitionResponse });
      setResponse(next);
      setSelected(next.items.map((item) => ({ item, factor: 1, name: item.class_name })));
    }).catch(() => { if (active) setError('Không thể nhận diện ảnh lúc này. Bạn có thể thử lại hoặc tìm món thủ công.'); });
    return () => { active = false; };
  }, [route.params.imageUri]);

  const save = () => {
    if (!selected.length || saving) return;
    setSaving(true);
    selected.forEach(({ item, factor, name }) => addFoodLog({
      date: route.params.date,
      meal,
      foodId: `ai-${item.class_id}`,
      foodName: name,
      grams: Math.max(1, item.portion.grams * factor),
      source: 'AI_PHOTO',
      imageUri: route.params.imageUri,
      aiConfidence: item.confidence,
      nutritionSnapshot: {
        calories: item.nutrition.calories * factor,
        protein: item.nutrition.protein_g * factor,
        carbs: item.nutrition.carbs_g * factor,
        fat: item.nutrition.fat_g * factor,
      },
    }));
    setTimeout(() => { setSaving(false); navigation.popToTop(); }, 150);
  };

  const hasItems = Boolean(response?.items.length);
  return <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}><ScrollView contentContainerStyle={styles.content}>
    <View style={styles.titleRow}><View style={styles.flex}><AppText variant="title">Kết quả nhận diện</AppText><AppText color={theme.colors.textMuted}>Kiểm tra món và khẩu phần ước lượng trước khi lưu.</AppText></View><AppButton label="Chụp lại" variant="outline" onPress={() => navigation.replace('AIMealScan', { date: route.params.date, meal })} /></View>
    <View style={styles.preview}><Image source={{ uri: route.params.imageUri }} style={styles.previewImage} resizeMode="contain" onLoad={(event) => { const { width, height } = event.nativeEvent.source; setSourceSize({ width, height }); setImageLoaded(true); }} onLayout={(event) => setImageSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })} />{imageLoaded ? <BoundingBoxes items={selected} width={imageSize.width} height={imageSize.height} sourceWidth={sourceSize.width} sourceHeight={sourceSize.height} /> : null}</View>
    {error ? <AppCard style={[styles.error, { borderColor: theme.colors.danger }]}><AppText color={theme.colors.danger} accessibilityLiveRegion="polite">{error}</AppText><AppButton label="Thử lại" variant="outline" onPress={() => navigation.replace('MealScanResult', route.params)} /></AppCard> : null}
    {!error && response && !hasItems ? <AppCard style={styles.empty}><Image source={images.mealScanNotFound} style={styles.emptyImage} resizeMode="contain" /><EmptyStateView title="Chưa nhận diện được món" message="Bạn có thể chụp lại hoặc tìm món thủ công." /><AppButton label="Tìm món thủ công" onPress={() => navigation.navigate('FoodSearch', { date: route.params.date, meal })} /></AppCard> : null}
    {hasItems ? <>
      <AppText variant="heading">Món được phát hiện ({selected.length}/{response?.items.length})</AppText>
      {response?.items.map((item, index) => <RecognitionCard key={`${item.class_id}-${index}`} item={item} value={selected.find((entry) => entry.item === item)} onToggle={() => setSelected((current) => current.some((entry) => entry.item === item) ? current.filter((entry) => entry.item !== item) : [...current, { item, factor: 1, name: item.class_name }])} onFactorChange={(factor) => setSelected((current) => current.map((entry) => entry.item === item ? { ...entry, factor } : entry))} onRename={(name) => { setSelected((current) => current.map((entry) => entry.item === item ? { ...entry, name } : entry)); setFeedbackVisible(true); }} />)}
      <AppText variant="heading">Lưu vào buổi ăn</AppText><View style={styles.meals}>{MEAL_SLOTS.map((item) => <Pressable key={item.key} onPress={() => setMeal(item.key)} accessibilityRole="radio" accessibilityState={{ selected: meal === item.key }} style={[styles.meal, { borderColor: meal === item.key ? theme.colors.brandPrimary : theme.colors.surfaceBorder, backgroundColor: meal === item.key ? (theme.scheme === 'dark' ? 'rgba(158, 100, 247, 0.2)' : '#EDE5FF') : (theme.scheme === 'dark' ? theme.colors.surfaceMid : '#FFFFFF') }]}><AppText color={meal === item.key ? (theme.scheme === 'dark' ? theme.colors.brandSecondary : theme.colors.brandPrimary) : theme.colors.textPrimary}>{item.label}</AppText></Pressable>)}</View>
      <AppButton label={`Lưu ${selected.length} món vào nhật ký`} disabled={!selected.length} loading={saving} onPress={save} accessibilityLabel="Lưu món được nhận diện vào nhật ký" />
    </> : null}
    {feedbackVisible ? <AppCard style={styles.feedback}><Image source={images.mealScanFeedback} style={styles.feedbackImage} resizeMode="contain" /><AppText variant="bodyMedium">Góp ý nhận diện</AppText><AppText color={theme.colors.textMuted}>Cho phép dùng ảnh đã sửa để cải thiện nhận diện trong tương lai.</AppText><Pressable onPress={() => setFeedbackConsent((value) => !value)} accessibilityRole="checkbox" accessibilityState={{ checked: feedbackConsent }} style={styles.checkbox}><AppText>{feedbackConsent ? '☑' : '□'} Đồng ý đóng góp ảnh</AppText></Pressable><AppButton label="Đóng" variant="ghost" onPress={() => setFeedbackVisible(false)} /></AppCard> : null}
    </ScrollView><LoadingOverlay visible={saving} message="Đang lưu nhật ký" />
  </SafeAreaView>;
}

function BoundingBoxes({ items, width, height, sourceWidth, sourceHeight }: { items: SelectedItem[]; width: number; height: number; sourceWidth: number; sourceHeight: number }) {
  const theme = useTheme();
  const scale = Math.min(width / Math.max(1, sourceWidth), height / Math.max(1, sourceHeight));
  const renderedWidth = sourceWidth * scale;
  const renderedHeight = sourceHeight * scale;
  const offsetX = (width - renderedWidth) / 2;
  const offsetY = (height - renderedHeight) / 2;
  return (
    <Svg pointerEvents="none" style={StyleSheet.absoluteFill} width={width} height={height}>
      {items.map(({ item, name }, index) => {
        const box = item.bbox;
        const x = clamp(box.x);
        const y = clamp(box.y);
        const right = clamp(box.x + box.w);
        const bottom = clamp(box.y + box.h);
        return (
          <React.Fragment key={`${item.class_id}-${index}`}>
            <Rect
              x={offsetX + x * renderedWidth}
              y={offsetY + y * renderedHeight}
              width={Math.max(0, right - x) * renderedWidth}
              height={Math.max(0, bottom - y) * renderedHeight}
              fill="transparent"
              stroke={theme.colors.quickScanner}
              strokeWidth={3}
            />
            <SvgText
              x={offsetX + x * renderedWidth + 4}
              y={offsetY + y * renderedHeight + 18}
              fill={theme.colors.onBrand}
              fontSize="13"
              stroke={theme.colors.canvasBase}
              strokeWidth="0.5"
            >
              {`${name} ${Math.round(item.confidence * 100)}%`}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

function RecognitionCard({ item, value, onToggle, onFactorChange, onRename }: { item: RecognitionItem; value?: SelectedItem; onToggle: () => void; onFactorChange: (factor: number) => void; onRename: (name: string) => void }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const factor = value?.factor ?? 1;
  const nutrition = useMemo(() => ({ calories: item.nutrition.calories * factor, protein: item.nutrition.protein_g * factor, carbs: item.nutrition.carbs_g * factor, fat: item.nutrition.fat_g * factor }), [factor, item.nutrition]);
  return <AppCard style={[styles.resultCard, !value && styles.unselected]}><View style={styles.cardHeader}><Pressable onPress={onToggle} accessibilityRole="checkbox" accessibilityState={{ checked: Boolean(value) }} style={styles.check}><AppText color={theme.colors.textPrimary}>{value ? '☑' : '□'}</AppText></Pressable><View style={styles.flex}><AppText variant="bodyMedium">{value?.name ?? item.class_name}</AppText><AppText variant="caption" color={theme.colors.textSecondary}>{Math.round(item.confidence * 100)}% tin cậy · Ước lượng {formatNumber(item.portion.grams * factor)} g ({item.portion.unit})</AppText></View><AppButton label="Đổi tên" variant="ghost" onPress={() => onRename(value?.name === item.class_name ? `${item.class_name} (đã sửa)` : item.class_name)} /></View><View style={styles.factorRow}>{[0.5, 1, 1.5, 2].map((option) => <Pressable key={option} onPress={() => onFactorChange(clampFactor(option))} accessibilityRole="radio" accessibilityState={{ selected: factor === option }} style={[styles.factor, { borderColor: factor === option ? theme.colors.brandPrimary : theme.colors.surfaceBorder, backgroundColor: factor === option ? (theme.scheme === 'dark' ? 'rgba(158, 100, 247, 0.2)' : '#EDE5FF') : (theme.scheme === 'dark' ? theme.colors.surfaceMid : '#FFFFFF') }]}><AppText color={factor === option ? (theme.scheme === 'dark' ? theme.colors.brandSecondary : theme.colors.brandPrimary) : theme.colors.textPrimary}>{option}×</AppText></Pressable>)}</View>{value ? <AppText variant="caption" color={theme.colors.textSecondary}>{formatNumber(nutrition.calories)} kcal · P {formatNumber(nutrition.protein, 1)} g · C {formatNumber(nutrition.carbs, 1)} g · F {formatNumber(nutrition.fat, 1)} g</AppText> : null}</AppCard>;
}

function createStyles(theme: any) {
  const c = theme.colors;
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.canvasBase },
    content: { padding: 16, gap: 14, paddingBottom: 36 },
    titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    flex: { flex: 1, gap: 4 },
    preview: { height: 300, backgroundColor: c.surfaceMid, borderRadius: 16, overflow: 'hidden', position: 'relative' },
    previewImage: { width: '100%', height: '100%' },
    error: { gap: 10 },
    empty: { alignItems: 'center', gap: 10 },
    emptyImage: { width: '100%', height: 130 },
    resultCard: { gap: 10 },
    unselected: { opacity: 0.65 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    check: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
    factorRow: { flexDirection: 'row', gap: 8 },
    factor: { minHeight: 44, minWidth: 52, borderWidth: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    meals: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    meal: { minHeight: 44, borderWidth: 1, borderRadius: 22, paddingHorizontal: 14, justifyContent: 'center' },
    feedback: { gap: 9 },
    feedbackImage: { width: '100%', height: 120 },
    checkbox: { minHeight: 44, justifyContent: 'center' }
  });
}

