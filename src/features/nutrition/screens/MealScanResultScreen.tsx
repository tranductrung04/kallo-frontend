import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppText, EmptyStateView, LoadingOverlay, useAlert } from '@/components/common';
import { SquareCheckIcon, SquareIcon } from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { images } from '@/assets/images';
import { getApiErrorMessage, isUuid } from '@/services/api/apiUtils';
import { useNutrition } from '../NutritionProvider';
import { recognizeFoodV2Api, sendFoodFeedbackApi } from '../api';
import { prepareImageForUpload } from '../imageUploadUtils';
import { formatNumber } from '../utils';
import { MEAL_SLOTS, type MealSlot } from '../types';
import {
  normalizeFoodRecognitionResponse,
  type RecognitionItem,
  type RecognitionResponse,
} from '../scanTypes';
import { useTheme } from '@/theme';

const clamp = (value: number) => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
const clampFactor = (value: number) => Math.min(2, Math.max(0.5, value));
type Props = NativeStackScreenProps<RootStackParamList, 'MealScanResult'>;
type SelectedItem = { item: RecognitionItem; factor: number; name: string };

function getItemDisplayName(item: RecognitionItem): string {
  return item.foodName || item.className;
}

function getItemBaseGrams(item: RecognitionItem): number {
  return item.estimatedServingGrams ?? item.defaultServingGrams ?? 100;
}

export function MealScanResultScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { showAlert } = useAlert();
  const { addFoodLog, addFoodLogAsync } = useNutrition();
  const [response, setResponse] = useState<RecognitionResponse>();
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    setError(undefined);
    setImageLoaded(false);

    void (async () => {
      try {
        const prepared = await prepareImageForUpload(route.params.imageUri);
        const value = await recognizeFoodV2Api(prepared.uri, prepared.mimeType);
        if (!active) return;
        const next = normalizeFoodRecognitionResponse(value);
        setResponse(next);
        setSelected(
          next.items.map((item) => ({
            item,
            factor: 1,
            name: getItemDisplayName(item),
          }))
        );
      } catch (err) {
        if (!active) return;
        setError(
          getApiErrorMessage(
            err,
            'Không thể nhận diện ảnh lúc này. Bạn có thể thử lại hoặc tìm món thủ công.'
          )
        );
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [route.params.imageUri]);

  const loggableCount = selected.filter((entry) => Boolean(entry.item.foodId)).length;
  const unmappedCount = selected.length - loggableCount;

  const save = async () => {
    if (!selected.length || saving) return;

    const loggable = selected.filter((entry) => Boolean(entry.item.foodId));
    if (loggable.length === 0) {
      showAlert({
        title: 'Món chưa liên kết từ điển',
        message: 'Các món được chọn chưa có ID trong từ điển. Vui lòng tìm món thủ công để ghi nhật ký.',
        variant: 'warning',
        buttons: [
          {
            text: 'Tìm món thủ công',
            variant: 'primary',
            onPress: () => navigation.navigate('FoodSearch', { date: route.params.date, meal }),
          },
          { text: 'Đóng', variant: 'secondary' },
        ],
      });
      return;
    }

    setSaving(true);
    try {
      const createdLogs = await Promise.all(
        loggable.map(({ item, factor, name }) => {
          const baseGrams = getItemBaseGrams(item);
          const input = {
            date: route.params.date,
            meal,
            foodId: item.foodId!,
            foodName: name,
            grams: Math.max(1, Math.round(baseGrams * factor)),
            servingQuantity: factor,
            source: 'AI_PHOTO' as const,
            imageUri: response?.tempImageUrl ?? route.params.imageUri,
            tempImageKey: response?.tempImageKey || null,
            aiPredictedClassId: item.classId ?? null,
            aiConfidence: item.confidence,
            nutritionSnapshot: {
              calories: (item.caloriesPerServing ?? 0) * factor,
              protein: (item.proteinPerServing ?? 0) * factor,
              carbs: (item.carbsPerServing ?? 0) * factor,
              fat: (item.fatPerServing ?? 0) * factor,
            },
          };
          if (addFoodLogAsync) {
            return addFoodLogAsync(input);
          }
          addFoodLog(input);
          return Promise.resolve(undefined);
        })
      );

      if (feedbackConsent) {
        await Promise.allSettled(
          createdLogs
            .filter((log): log is NonNullable<typeof log> => Boolean(log && isUuid(log.id)))
            .map((log) => sendFoodFeedbackApi(log.id, { consented: true }))
        );
      }

      navigation.popToTop();
    } finally {
      setSaving(false);
    }
  };

  const hasItems = Boolean(response?.items.length);
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.flex}>
            <AppText variant="title">Kết quả nhận diện</AppText>
            <AppText color={theme.colors.textMuted}>
              Kiểm tra món và khẩu phần ước lượng trước khi lưu.
            </AppText>
          </View>
          <AppButton
            label="Chụp lại"
            variant="outline"
            onPress={() => navigation.replace('AIMealScan', { date: route.params.date, meal })}
          />
        </View>

        <View style={styles.preview}>
          <Image
            source={{ uri: route.params.imageUri }}
            style={styles.previewImage}
            resizeMode="contain"
            onLoad={(event) => {
              const nativeEvent = event.nativeEvent as
                | {
                    source?: { width?: number; height?: number };
                    target?: { naturalWidth?: number; naturalHeight?: number };
                  }
                | undefined;
              const target = (
                event as unknown as {
                  target?: { naturalWidth?: number; naturalHeight?: number };
                }
              )?.target;
              const width =
                nativeEvent?.source?.width ??
                nativeEvent?.target?.naturalWidth ??
                target?.naturalWidth;
              const height =
                nativeEvent?.source?.height ??
                nativeEvent?.target?.naturalHeight ??
                target?.naturalHeight;
              if (width && height) {
                setSourceSize({ width, height });
                setImageLoaded(true);
                return;
              }
              Image.getSize(
                route.params.imageUri,
                (w, h) => {
                  setSourceSize({ width: w || 1, height: h || 1 });
                  setImageLoaded(true);
                },
                () => {
                  setImageLoaded(true);
                }
              );
            }}
            onLayout={(event) =>
              setImageSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })
            }
          />
          {imageLoaded ? (
            <BoundingBoxes
              items={selected}
              width={imageSize.width}
              height={imageSize.height}
              sourceWidth={sourceSize.width}
              sourceHeight={sourceSize.height}
            />
          ) : null}
        </View>

        {loading ? (
          <AppCard style={styles.loadingCard}>
            <ActivityIndicator size="small" color={theme.colors.brandPrimary} />
            <AppText color={theme.colors.textSecondary}>
              AI đang phân tích món ăn trong ảnh...
            </AppText>
          </AppCard>
        ) : null}

        {error ? (
          <AppCard style={[styles.error, { borderColor: theme.colors.danger }]}>
            <AppText color={theme.colors.danger} accessibilityLiveRegion="polite">
              {error}
            </AppText>
            <View style={styles.errorActions}>
              <AppButton
                label="Thử lại"
                variant="outline"
                onPress={() => navigation.replace('MealScanResult', route.params)}
              />
              <AppButton
                label="Tìm món thủ công"
                onPress={() => navigation.navigate('FoodSearch', { date: route.params.date, meal })}
              />
            </View>
          </AppCard>
        ) : null}

        {!loading && !error && response && !hasItems ? (
          <AppCard style={styles.empty}>
            <Image source={images.mealScanNotFound} style={styles.emptyImage} resizeMode="contain" />
            <EmptyStateView
              title="Chưa nhận diện được món"
              message="Bạn có thể chụp lại hoặc tìm món thủ công."
            />
            <AppButton
              label="Tìm món thủ công"
              onPress={() => navigation.navigate('FoodSearch', { date: route.params.date, meal })}
            />
          </AppCard>
        ) : null}

        {hasItems ? (
          <>
            <AppText variant="heading">
              Món được phát hiện ({selected.length}/{response?.items.length})
            </AppText>
            {response?.items.map((item, index) => (
              <RecognitionCard
                key={`${item.classId}-${index}`}
                item={item}
                value={selected.find((entry) => entry.item === item)}
                onToggle={() =>
                  setSelected((current) =>
                    current.some((entry) => entry.item === item)
                      ? current.filter((entry) => entry.item !== item)
                      : [...current, { item, factor: 1, name: getItemDisplayName(item) }]
                  )
                }
                onFactorChange={(factor) =>
                  setSelected((current) =>
                    current.map((entry) => (entry.item === item ? { ...entry, factor } : entry))
                  )
                }
                onRename={(name) => {
                  setSelected((current) =>
                    current.map((entry) => (entry.item === item ? { ...entry, name } : entry))
                  );
                  setFeedbackVisible(true);
                }}
                onSearchManual={() =>
                  navigation.navigate('FoodSearch', { date: route.params.date, meal })
                }
              />
            ))}

            {unmappedCount > 0 ? (
              <AppText variant="caption" color={theme.colors.warning}>
                Có {unmappedCount} món chưa khớp từ điển hệ thống. Hãy tìm món thủ công nếu muốn ghi riêng.
              </AppText>
            ) : null}

            <AppText variant="heading">Lưu vào buổi ăn</AppText>
            <View style={styles.meals}>
              {MEAL_SLOTS.map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() => setMeal(item.key)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: meal === item.key }}
                  style={[
                    styles.meal,
                    {
                      borderColor:
                        meal === item.key ? theme.colors.brandPrimary : theme.colors.surfaceBorder,
                      backgroundColor:
                        meal === item.key
                          ? theme.scheme === 'dark'
                            ? 'rgba(158, 100, 247, 0.2)'
                            : '#EDE5FF'
                          : theme.scheme === 'dark'
                          ? theme.colors.surfaceMid
                          : '#FFFFFF',
                    },
                  ]}
                >
                  <AppText
                    color={
                      meal === item.key
                        ? theme.scheme === 'dark'
                          ? theme.colors.brandSecondary
                          : theme.colors.brandPrimary
                        : theme.colors.textPrimary
                    }
                  >
                    {item.label}
                  </AppText>
                </Pressable>
              ))}
            </View>

            <AppButton
              label={`Lưu ${selected.length} món vào nhật ký`}
              disabled={!selected.length}
              loading={saving}
              onPress={() => void save()}
              accessibilityLabel="Lưu món được nhận diện vào nhật ký"
            />
          </>
        ) : null}

        {feedbackVisible ? (
          <AppCard style={styles.feedback}>
            <Image source={images.mealScanFeedback} style={styles.feedbackImage} resizeMode="contain" />
            <AppText variant="bodyMedium">Góp ý nhận diện</AppText>
            <AppText color={theme.colors.textMuted}>
              Cho phép dùng ảnh đã sửa để cải thiện nhận diện AI trong tương lai.
            </AppText>
            <Pressable
              onPress={() => setFeedbackConsent((value) => !value)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: feedbackConsent }}
              style={styles.checkbox}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {feedbackConsent ? (
                  <SquareCheckIcon size={20} color={theme.colors.brandPrimary} />
                ) : (
                  <SquareIcon size={20} color={theme.colors.textMuted} />
                )}
                <AppText>Đồng ý đóng góp ảnh</AppText>
              </View>
            </Pressable>
            <AppButton label="Đóng" variant="ghost" onPress={() => setFeedbackVisible(false)} />
          </AppCard>
        ) : null}
      </ScrollView>
      <LoadingOverlay visible={saving} message="Đang lưu nhật ký" />
    </SafeAreaView>
  );
}

function BoundingBoxes({
  items,
  width,
  height,
  sourceWidth,
  sourceHeight,
}: {
  items: SelectedItem[];
  width: number;
  height: number;
  sourceWidth: number;
  sourceHeight: number;
}) {
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
        if (!box) return null;
        const x = clamp(box.x);
        const y = clamp(box.y);
        const right = clamp(box.x + box.w);
        const bottom = clamp(box.y + box.h);
        return (
          <React.Fragment key={`${item.classId}-${index}`}>
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

function RecognitionCard({
  item,
  value,
  onToggle,
  onFactorChange,
  onRename,
  onSearchManual,
}: {
  item: RecognitionItem;
  value?: SelectedItem;
  onToggle: () => void;
  onFactorChange: (factor: number) => void;
  onRename: (name: string) => void;
  onSearchManual: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const factor = value?.factor ?? 1;
  const displayName = getItemDisplayName(item);
  const baseGrams = getItemBaseGrams(item);
  const servingLabel = item.defaultServingName ?? 'phần';

  const nutrition = useMemo(
    () => ({
      calories: (item.caloriesPerServing ?? 0) * factor,
      protein: (item.proteinPerServing ?? 0) * factor,
      carbs: (item.carbsPerServing ?? 0) * factor,
      fat: (item.fatPerServing ?? 0) * factor,
    }),
    [factor, item.caloriesPerServing, item.proteinPerServing, item.carbsPerServing, item.fatPerServing]
  );

  return (
    <AppCard style={[styles.resultCard, !value && styles.unselected]}>
      <View style={styles.cardHeader}>
        <Pressable
          onPress={onToggle}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: Boolean(value) }}
          style={styles.check}
        >
          {value ? (
            <SquareCheckIcon size={22} color={theme.colors.brandPrimary} />
          ) : (
            <SquareIcon size={22} color={theme.colors.textMuted} />
          )}
        </Pressable>
        <View style={styles.flex}>
          <AppText variant="bodyMedium">{value?.name ?? displayName}</AppText>
          <AppText variant="caption" color={theme.colors.textSecondary}>
            {Math.round(item.confidence * 100)}% tin cậy · Ước lượng{' '}
            {formatNumber(baseGrams * factor)} g ({servingLabel})
          </AppText>
        </View>
        <AppButton
          label="Góp ý sai"
          variant="ghost"
          onPress={() =>
            onRename(value?.name === displayName ? `${displayName} (đã sửa)` : displayName)
          }
        />
      </View>

      {item.hasAllergyWarning ? (
        <AppText variant="caption" color={theme.colors.danger}>
          ⚠️ Cảnh báo dị ứng
          {item.allergicIngredients?.length
            ? `: ${item.allergicIngredients.map((a) => a.name).join(', ')}`
            : ''}
        </AppText>
      ) : null}

      {!item.foodId ? (
        <View style={styles.unmappedRow}>
          <AppText variant="caption" color={theme.colors.warning} style={styles.flex}>
            Chưa tự động khớp món trong từ điển
          </AppText>
          <AppButton label="Tìm món" variant="outline" onPress={onSearchManual} />
        </View>
      ) : null}

      <View style={styles.factorRow}>
        {[0.5, 1, 1.5, 2].map((option) => (
          <Pressable
            key={option}
            onPress={() => onFactorChange(clampFactor(option))}
            accessibilityRole="radio"
            accessibilityState={{ selected: factor === option }}
            style={[
              styles.factor,
              {
                borderColor:
                  factor === option ? theme.colors.brandPrimary : theme.colors.surfaceBorder,
                backgroundColor:
                  factor === option
                    ? theme.scheme === 'dark'
                      ? 'rgba(158, 100, 247, 0.2)'
                      : '#EDE5FF'
                    : theme.scheme === 'dark'
                    ? theme.colors.surfaceMid
                    : '#FFFFFF',
              },
            ]}
          >
            <AppText
              color={
                factor === option
                  ? theme.scheme === 'dark'
                    ? theme.colors.brandSecondary
                    : theme.colors.brandPrimary
                  : theme.colors.textPrimary
              }
            >
              {option}×
            </AppText>
          </Pressable>
        ))}
      </View>

      {value ? (
        <AppText variant="caption" color={theme.colors.textSecondary}>
          {formatNumber(nutrition.calories)} kcal · P {formatNumber(nutrition.protein, 1)} g · C{' '}
          {formatNumber(nutrition.carbs, 1)} g · F {formatNumber(nutrition.fat, 1)} g
        </AppText>
      ) : null}
    </AppCard>
  );
}

function createStyles(theme: any) {
  const c = theme.colors;
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.canvasBase },
    content: { padding: 16, gap: 14, paddingBottom: 36 },
    titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    flex: { flex: 1, gap: 4 },
    preview: {
      height: 300,
      backgroundColor: c.surfaceMid,
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
    },
    previewImage: { width: '100%', height: '100%' },
    loadingCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    error: { gap: 10 },
    errorActions: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
    empty: { alignItems: 'center', gap: 10 },
    emptyImage: { width: '100%', height: 130 },
    resultCard: { gap: 10 },
    unselected: { opacity: 0.65 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    check: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
    unmappedRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    factorRow: { flexDirection: 'row', gap: 8 },
    factor: {
      minHeight: 44,
      minWidth: 52,
      borderWidth: 1,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    meals: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    meal: {
      minHeight: 44,
      borderWidth: 1,
      borderRadius: 22,
      paddingHorizontal: 14,
      justifyContent: 'center',
    },
    feedback: { gap: 9 },
    feedbackImage: { width: '100%', height: 120 },
    checkbox: { minHeight: 44, justifyContent: 'center' },
  });
}
