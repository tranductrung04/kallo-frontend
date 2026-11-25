import React, { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '@/assets/images';
import { AppButton, AppText } from '@/components/common';
import { ChevronLeftIcon } from '@/components/icons';
import { useTheme } from '@/theme';
import { useHealthProfileDraft } from '../hooks/useHealthProfileDraft';
import { calculateBmi, bmiCategory } from '../utils/calculations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MIN_WEIGHT = 20;
const MAX_WEIGHT = 300;
const DEFAULT_TARGET = 61.0;
const STEP_WIDTH = 8;
const TOTAL_STEPS = Math.round((MAX_WEIGHT - MIN_WEIGHT) * 10) + 1;

interface TargetWeightSelectionScreenProps {
  navigation?: any;
  onNext?: (targetWeightKg: number) => void;
  onBack?: () => void;
  hideHeader?: boolean;
}

export function TargetWeightSelectionScreen({
  navigation,
  onNext,
  onBack,
  hideHeader = false,
}: TargetWeightSelectionScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const { draft, updateDraft } = useHealthProfileDraft();

  const currentWeight = useMemo(() => {
    const parsed = parseFloat(draft.weight);
    return !isNaN(parsed) && parsed > 0 ? parsed : 53.0;
  }, [draft.weight]);

  const initialVal = useMemo(() => {
    const parsed = parseFloat(draft.targetWeight);
    const isValidRange = !isNaN(parsed) && parsed >= MIN_WEIGHT && parsed <= MAX_WEIGHT;

    if (draft.goal === 'maintain') {
      return Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, parseFloat(currentWeight.toFixed(1))));
    }
    if (draft.goal === 'lose') {
      if (isValidRange && parsed < currentWeight) return parseFloat(parsed.toFixed(1));
      return Math.max(MIN_WEIGHT, parseFloat((currentWeight - 5.0).toFixed(1)));
    }
    if (draft.goal === 'gain') {
      if (isValidRange && parsed > currentWeight) return parseFloat(parsed.toFixed(1));
      return Math.min(MAX_WEIGHT, parseFloat((currentWeight + 5.0).toFixed(1)));
    }
    return isValidRange ? parseFloat(parsed.toFixed(1)) : DEFAULT_TARGET;
  }, [draft.targetWeight, draft.goal, currentWeight]);

  const [targetWeight, setTargetWeight] = useState<number>(initialVal);
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [weightInput, setWeightInput] = useState(initialVal.toFixed(1));
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const paddingHorizontal = (SCREEN_WIDTH - STEP_WIDTH) / 2;

  // Height for BMI calculation
  const heightCm = useMemo(() => {
    const parsed = parseFloat(draft.height);
    return !isNaN(parsed) && parsed > 0 ? parsed : 175;
  }, [draft.height]);

  const bmiVal = useMemo(() => {
    const rawBmi = calculateBmi(targetWeight, heightCm);
    return parseFloat(rawBmi.toFixed(1));
  }, [targetWeight, heightCm]);

  const category = useMemo(() => bmiCategory(bmiVal), [bmiVal]);

  const bmiMeta = useMemo(() => {
    if (bmiVal < 18.5) {
      return {
        badgeBg: theme.colors.macroCarbsStrong,
        badgeColor: theme.colors.onBrand,
        valueColor: theme.colors.macroCarbs,
        advice: 'Bạn đang thiếu cân đấy, cơ thể có thể bị suy nhược, mất cơ và rối loạn nội tiết. Hãy tăng cường dinh dưỡng nhé!',
      };
    }
    if (bmiVal < 23) {
      return {
        badgeBg: theme.colors.quickScanner,
        badgeColor: theme.colors.onBrand,
        valueColor: theme.colors.macroFiber,
        advice: 'Bạn đang ở mức cân nặng hợp lý. Hãy duy trì thói quen lành mạnh để bảo vệ sức khỏe lâu dài.',
      };
    }
    if (bmiVal < 25) {
      return {
        badgeBg: theme.colors.vipStreak,
        badgeColor: theme.colors.onBrand,
        valueColor: theme.colors.trackerWeight,
        advice: 'Mục tiêu này ở mức thừa cân nhẹ. Bạn có thể cân nhắc chọn mức cân gần vùng bình thường hơn.',
      };
    }
    return {
      badgeBg: theme.colors.statusDanger,
      badgeColor: theme.colors.onError,
      valueColor: theme.colors.macroProtein,
      advice: 'Mục tiêu này rơi vào vùng béo phì. Kallo khuyến nghị điều chỉnh mục tiêu an toàn hơn.',
    };
  }, [bmiVal, theme.colors]);

  const initialIndex = Math.round((initialVal - MIN_WEIGHT) * 10);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const computed = Math.round(offsetX / STEP_WIDTH) * 0.1 + MIN_WEIGHT;
    const clamped = Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, parseFloat(computed.toFixed(1))));
    if (clamped !== targetWeight) {
      setTargetWeight(clamped);
    }
  };

  const scrollToTargetWeight = (newWeight: number) => {
    const rounded = parseFloat(newWeight.toFixed(1));
    const clamped = Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, rounded));
    setIsEditingWeight(false);
    Keyboard.dismiss();
    setTargetWeight(clamped);
    const targetIndex = Math.round((clamped - MIN_WEIGHT) * 10);
    flatListRef.current?.scrollToOffset({
      offset: targetIndex * STEP_WIDTH,
      animated: true,
    });
  };

  const sanitizeWeightInput = (text: string) => {
    const normalized = text.replace(/,/g, '.').replace(/[^0-9.]/g, '');
    const dotIndex = normalized.indexOf('.');
    if (dotIndex === -1) return normalized.slice(0, 3);
    const intPart = normalized.slice(0, dotIndex).slice(0, 3);
    const decPart = normalized.slice(dotIndex + 1).replace(/\./g, '').slice(0, 1);
    return `${intPart}.${decPart}`;
  };

  const startEditingWeight = () => {
    setWeightInput(targetWeight.toFixed(1));
    setIsAllSelected(true);
    setIsEditingWeight(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const commitWeightInput = () => {
    const parsed = parseFloat(weightInput);
    const nextWeight = !isNaN(parsed)
      ? Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, parseFloat(parsed.toFixed(1))))
      : targetWeight;
    scrollToTargetWeight(nextWeight);
  };

  const handleNext = () => {
    let finalWeight = targetWeight;
    if (isEditingWeight) {
      const parsed = parseFloat(weightInput);
      if (!isNaN(parsed)) {
        finalWeight = Math.max(
          MIN_WEIGHT,
          Math.min(MAX_WEIGHT, parseFloat(parsed.toFixed(1)))
        );
      }
      scrollToTargetWeight(finalWeight);
    }

    updateDraft('targetWeight', finalWeight.toFixed(1));
    if (draft.goal === 'maintain') {
      updateDraft('weeklyRate', '0');
    } else if (!draft.weeklyRate || draft.weeklyRate === '0') {
      updateDraft('weeklyRate', '0.5');
    }

    if (onNext) {
      onNext(finalWeight);
    } else if (navigation?.navigate) {
      navigation.navigate('ActivityLevelSelection');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.() && navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  // Compare with current weight
  const isGain = targetWeight > currentWeight;
  const isLose = targetWeight < currentWeight;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: isDark ? '#120E29' : theme.colors.canvasBase,
        },
      ]}
    >
      {/* ── Top Bar ────────────────────────────────────────────── */}
      {!hideHeader && (
        <>
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
            >
              <ChevronLeftIcon
                size={26}
                color={isDark ? '#FFFFFF' : theme.colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* ── Progress Bar: 75% ────────────────────────────────── */}
          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor: isDark
                  ? '#272049'
                  : theme.colors.surfaceBorder,
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.colors.brandPrimary,
                  width: '75%',
                },
              ]}
            />
          </View>
        </>
      )}

      {/* ── Avatar & Speech Bubble Row ─────────────────────────── */}
      <View style={styles.bubbleRow}>
        <View
          style={[
            styles.avatarWrap,
            {
              backgroundColor: isDark ? '#2E2654' : '#EDE5FF',
              borderColor: isDark ? '#4A3D7E' : '#D4C7F8',
            },
          ]}
        >
          <Image
            source={images.mascotAvatar}
            style={styles.avatarImage}
            resizeMode="cover"
            accessibilityLabel="Mascot Kallo"
          />
        </View>
        <View
          style={[
            styles.bubble,
            !isDark && {
              borderWidth: 1,
              borderColor: theme.colors.surfaceBorder,
            },
          ]}
        >
          <View
            style={[
              styles.bubbleTail,
              !isDark && {
                borderLeftWidth: 1,
                borderBottomWidth: 1,
                borderColor: theme.colors.surfaceBorder,
              },
            ]}
          />
          <AppText style={styles.bubbleText}>
            Cân nặng mong muốn
          </AppText>
        </View>
      </View>

      {/* ── Value Readout & Current Weight Indicator ───────────── */}
      <View style={styles.valueContainer}>
        <View style={styles.readoutRow}>
          {isEditingWeight ? (
            <TextInput
              ref={inputRef}
              value={weightInput}
              onChangeText={(text) => {
                setWeightInput(sanitizeWeightInput(text));
                setIsAllSelected(false);
              }}
              onSelectionChange={(e) => {
                const { start, end } = e.nativeEvent.selection;
                setIsAllSelected(
                  weightInput.length > 0 && start === 0 && end === weightInput.length
                );
              }}
              onBlur={commitWeightInput}
              onSubmitEditing={commitWeightInput}
              keyboardType="decimal-pad"
              returnKeyType="done"
              maxLength={5}
              selectTextOnFocus
              autoFocus
              selectionColor={theme.colors.brandPrimary}
              accessibilityLabel="Nhập cân nặng mục tiêu theo kg"
              style={[
                styles.weightValue,
                styles.weightInput,
                {
                  color: isAllSelected
                    ? '#FFFFFF'
                    : isDark
                      ? '#FFFFFF'
                      : theme.colors.textPrimary,
                  borderBottomColor: theme.colors.brandPrimary,
                },
              ]}
            />
          ) : (
            <TouchableOpacity
              onPress={startEditingWeight}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel={`Cân nặng mục tiêu ${targetWeight.toFixed(1)} kg, nhấn để chỉnh sửa`}
            >
              <AppText
                style={[
                  styles.weightValue,
                  { color: isDark ? theme.colors.onBrand : theme.colors.textPrimary },
                ]}
              >
                {targetWeight.toFixed(1)}
              </AppText>
            </TouchableOpacity>
          )}
          <AppText
            style={[
              styles.weightUnit,
              { color: theme.colors.textPrimary },
            ]}
          >
            kg
          </AppText>

          {/* Current weight reference indicator */}
          <View style={styles.currentWeightTag}>
            <AppText
              style={[
                styles.currentWeightArrow,
                { color: isDark ? '#C5BFDE' : theme.colors.textSecondary },
              ]}
            >
              {isGain ? '◀◀' : isLose ? '▶▶' : '•'}
            </AppText>
            <AppText
              style={[
                styles.currentWeightText,
                { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
              ]}
            >
              {Math.round(currentWeight)}
            </AppText>
          </View>
        </View>
      </View>

      {/* ── Interactive Horizontal Ruler ──────────────────────── */}
      <View style={styles.rulerContainer}>
        {/* Fixed Center Purple Cursor Line */}
        <View
          style={[
            styles.centerCursor,
            { backgroundColor: theme.colors.brandPrimary },
          ]}
          pointerEvents="none"
        />

        <FlatList
          ref={flatListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          snapToInterval={STEP_WIDTH}
          decelerationRate="fast"
          data={Array.from({ length: TOTAL_STEPS }, (_, i) => i)}
          keyExtractor={(item) => String(item)}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: STEP_WIDTH,
            offset: STEP_WIDTH * index,
            index,
          })}
          contentContainerStyle={{ paddingHorizontal, paddingTop: 10 }}
          renderItem={({ index }) => {
            const tenths = Math.round(MIN_WEIGHT * 10) + index;
            const itemWeight = tenths / 10;
            const isWhole = tenths % 10 === 0;
            const isHalf = tenths % 5 === 0;
            const labelVal = tenths / 10;

            // Highlight region between current and target weight
            const isInDeltaRange = isGain
              ? itemWeight >= currentWeight && itemWeight <= targetWeight
              : isLose
                ? itemWeight <= currentWeight && itemWeight >= targetWeight
                : false;

            return (
              <View
                style={[
                  styles.tickWrapper,
                  isInDeltaRange && styles.tickWrapperHighlighted,
                ]}
              >
                <View style={styles.tickTrack}>
                  <View
                    style={[
                      styles.tick,
                      isWhole
                        ? [
                          styles.tickTen,
                          {
                            backgroundColor: isDark
                              ? '#C5BFE3'
                              : theme.colors.brandPrimary,
                          },
                        ]
                        : isHalf
                          ? [
                            styles.tickFive,
                            {
                              backgroundColor: isDark
                                ? '#776F9F'
                                : '#A6A1B8',
                            },
                          ]
                          : [
                            styles.tickOne,
                            {
                              backgroundColor: isDark
                                ? '#372F5B'
                                : '#D1CBDD',
                            },
                          ],
                    ]}
                  />
                </View>
                {isWhole ? (
                  <AppText
                    style={[
                      styles.tickLabel,
                      {
                        color: isDark
                          ? '#AEA6CC'
                          : theme.colors.textSecondary,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {labelVal}
                  </AppText>
                ) : null}
              </View>
            );
          }}
        />
      </View>

      {/* ── Projected BMI Card ─────────────────────────────────── */}
      <View style={styles.bmiCardWrap}>
        <View
          style={[
            styles.bmiCard,
            {
              backgroundColor: isDark ? '#1C1635' : theme.colors.surfaceMid,
              borderColor: isDark ? '#2D2350' : theme.colors.surfaceBorder,
            },
          ]}
        >
          <View style={styles.bmiHeaderRow}>
            <AppText
              style={[
                styles.bmiTitle,
                { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
              ]}
            >
              BMI của bạn:{' '}
            </AppText>
            <AppText style={[styles.bmiValue, { color: bmiMeta.valueColor }]}>
              {bmiVal.toFixed(1)}
            </AppText>
            <View style={[styles.bmiBadge, { backgroundColor: bmiMeta.badgeBg }]}>
              <AppText style={[styles.bmiBadgeText, { color: bmiMeta.badgeColor }]}>
                {category}
              </AppText>
            </View>
          </View>
          <AppText
            style={[
              styles.bmiAdvice,
              { color: isDark ? '#C7BFE0' : theme.colors.textSecondary },
            ]}
          >
            {bmiMeta.advice}
          </AppText>
        </View>

        {/* Nguồn tham khảo */}
        <TouchableOpacity
          onPress={() => setShowReferenceModal(true)}
          style={styles.referenceBtn}
          accessibilityRole="button"
          accessibilityLabel="Nguồn tham khảo BMI"
        >
          <AppText
            style={[
              styles.referenceText,
              { color: isDark ? '#FFFFFF' : theme.colors.brandPrimary },
            ]}
          >
            Nguồn tham khảo
          </AppText>
        </TouchableOpacity>
      </View>

      {/* ── Bottom Action Button ───────────────────────────────── */}
      <View style={[styles.bottomArea, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: theme.colors.brandAction,
              shadowColor: theme.colors.brandPrimary,
            },
          ]}
          onPress={handleNext}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Tiếp tục"
        >
          <AppText style={styles.buttonText}>Tiếp tục</AppText>
        </TouchableOpacity>
      </View>

      {/* ── Reference Modal ────────────────────────────────────── */}
      <Modal
        visible={showReferenceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReferenceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDark ? '#1E1838' : theme.colors.surfaceMid,
                borderColor: isDark ? '#3D3369' : theme.colors.surfaceBorder,
              },
            ]}
          >
            <AppText
              style={[
                styles.modalTitle,
                { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
              ]}
            >
              Tiêu chuẩn BMI Châu Á (WHO WPRO)
            </AppText>
            <AppText
              style={[
                styles.modalBody,
                { color: isDark ? '#C7BFE0' : theme.colors.textSecondary },
              ]}
            >
              • Dưới 18.5: Thiếu cân (cần tăng cường dinh dưỡng){'\n'}
              • 18.5 – 22.9: Bình thường (vóc dáng lý tưởng){'\n'}
              • 23.0 – 24.9: Thừa cân (tiền béo phì){'\n'}
              • Từ 25.0 trở lên: Béo phì (nguy cơ tim mạch & chuyển hóa)
            </AppText>
            <AppButton
              label="Đã hiểu"
              onPress={() => setShowReferenceModal(false)}
              style={{ marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120E29',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#272049',
    borderRadius: 2,
    marginHorizontal: 20,
    marginTop: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9D6CFA',
    borderRadius: 2,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2E2654',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#4A3D7E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 52,
    height: 52,
  },
  bubble: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexShrink: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  bubbleTail: {
    position: 'absolute',
    left: -6,
    top: 18,
    width: 14,
    height: 14,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  bubbleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  valueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
    marginBottom: 16,
  },
  readoutRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    position: 'relative',
  },
  weightValue: {
    fontSize: 54,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 62,
  },
  weightInput: {
    minWidth: 132,
    textAlign: 'center',
    borderBottomWidth: 2,
    paddingVertical: 0,
  },
  weightUnit: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  currentWeightTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 24,
    alignSelf: 'center',
  },
  currentWeightArrow: {
    fontSize: 14,
    color: '#C5BFDE',
    fontWeight: '700',
  },
  currentWeightText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rulerContainer: {
    position: 'relative',
    height: 110,
    justifyContent: 'center',
  },
  centerCursor: {
    position: 'absolute',
    top: 4,
    left: '50%',
    transform: [{ translateX: -1.5 }],
    width: 3,
    height: 62,
    backgroundColor: '#9D6CFA',
    borderRadius: 1.5,
    zIndex: 10,
    shadowColor: '#9D6CFA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  tickWrapper: {
    width: STEP_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 90,
  },
  tickTrack: {
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tickWrapperHighlighted: {
    backgroundColor: 'rgba(139, 92, 246, 0.22)',
  },
  tick: {
    borderRadius: 1,
  },
  tickTen: {
    width: 2,
    height: 46,
    backgroundColor: '#C5BFE3',
  },
  tickFive: {
    width: 2,
    height: 32,
    backgroundColor: '#776F9F',
  },
  tickOne: {
    width: 1.5,
    height: 20,
    backgroundColor: '#372F5B',
  },
  tickLabel: {
    marginTop: 6,
    width: 36,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: '#AEA6CC',
  },
  bmiCardWrap: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  bmiCard: {
    backgroundColor: '#1C1635',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2D2350',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  bmiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bmiTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bmiValue: {
    fontSize: 17,
    fontWeight: '800',
    marginRight: 8,
  },
  bmiBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  bmiBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bmiAdvice: {
    fontSize: 13,
    color: '#C7BFE0',
    lineHeight: 19,
  },
  referenceBtn: {
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 4,
  },
  referenceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  bottomArea: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  actionButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#9358F7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9358F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#1E1838',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#3D3369',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 14,
    color: '#C7BFE0',
    lineHeight: 22,
  },
});
