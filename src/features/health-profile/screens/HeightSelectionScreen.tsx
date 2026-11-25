import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '@/assets/images';
import { AppText } from '@/components/common';
import { ChevronLeftIcon } from '@/components/icons';
import { useTheme } from '@/theme';
import { useHealthProfileDraft } from '../hooks/useHealthProfileDraft';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MIN_HEIGHT = 50;
const MAX_HEIGHT = 250;
const DEFAULT_HEIGHT = 160;
const STEP_WIDTH = 12;

interface HeightSelectionScreenProps {
  navigation?: any;
  onNext?: (heightCm: number) => void;
  onBack?: () => void;
  hideHeader?: boolean;
}

export function HeightSelectionScreen({
  navigation,
  onNext,
  onBack,
  hideHeader = false,
}: HeightSelectionScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const { draft, updateDraft } = useHealthProfileDraft();

  const initialVal = useMemo(() => {
    const parsed = parseInt(draft.height, 10);
    if (!isNaN(parsed) && parsed >= MIN_HEIGHT && parsed <= MAX_HEIGHT) {
      return parsed;
    }
    return DEFAULT_HEIGHT;
  }, [draft.height]);

  const [height, setHeight] = useState<number>(initialVal);
  const [isEditingHeight, setIsEditingHeight] = useState(false);
  const [heightInput, setHeightInput] = useState(String(initialVal));
  const [isAllSelected, setIsAllSelected] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const hasInitialized = useRef(false);

  const paddingHorizontal = (SCREEN_WIDTH - STEP_WIDTH) / 2;

  useEffect(() => {
    if (!hasInitialized.current && scrollRef.current) {
      hasInitialized.current = true;
      const initialOffset = (initialVal - MIN_HEIGHT) * STEP_WIDTH;
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: initialOffset, animated: false });
      }, 50);
    }
  }, [initialVal]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const computed = Math.round(offsetX / STEP_WIDTH) + MIN_HEIGHT;
    const clamped = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, computed));
    if (clamped !== height) {
      setHeight(clamped);
    }
  };

  const scrollToHeight = (newHeight: number) => {
    const clamped = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));
    setIsEditingHeight(false);
    Keyboard.dismiss();
    setHeight(clamped);
    scrollRef.current?.scrollTo({
      x: (clamped - MIN_HEIGHT) * STEP_WIDTH,
      animated: true,
    });
  };

  const startEditingHeight = () => {
    setHeightInput(String(height));
    setIsAllSelected(true);
    setIsEditingHeight(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const commitHeightInput = () => {
    const parsed = parseInt(heightInput, 10);
    const nextHeight = !isNaN(parsed)
      ? Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, parsed))
      : height;
    scrollToHeight(nextHeight);
  };

  const handleNext = () => {
    let finalHeight = height;
    if (isEditingHeight) {
      const parsed = parseInt(heightInput, 10);
      if (!isNaN(parsed)) {
        finalHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, parsed));
      }
      setIsEditingHeight(false);
      setHeight(finalHeight);
      Keyboard.dismiss();
    }
    updateDraft('height', String(finalHeight));

    if (onNext) {
      onNext(finalHeight);
    } else if (navigation?.navigate) {
      navigation.navigate('CurrentWeightSelection');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.() && navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const totalSteps = MAX_HEIGHT - MIN_HEIGHT + 1;
  const tickItems = useMemo(() => Array.from({ length: totalSteps }, (_, i) => MIN_HEIGHT + i), [totalSteps]);

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

          {/* ── Progress Bar (~35%) ────────────────────────────────── */}
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
                  width: '35%',
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
            Chiều cao của bạn là...
          </AppText>
        </View>
      </View>

      {/* ── Height Value Display ───────────────────────────────── */}
      <View style={styles.valueContainer}>
        {isEditingHeight ? (
          <TextInput
            ref={inputRef}
            value={heightInput}
            onChangeText={(text) => {
              const digits = text.replace(/[^0-9]/g, '');
              setHeightInput(digits);
              setIsAllSelected(false);
            }}
            onSelectionChange={(e) => {
              const { start, end } = e.nativeEvent.selection;
              setIsAllSelected(
                heightInput.length > 0 && start === 0 && end === heightInput.length
              );
            }}
            onBlur={commitHeightInput}
            onSubmitEditing={commitHeightInput}
            keyboardType="number-pad"
            returnKeyType="done"
            maxLength={3}
            selectTextOnFocus
            autoFocus
            selectionColor={theme.colors.brandPrimary}
            accessibilityLabel="Nhập chiều cao theo cm"
            style={[
              styles.heightValue,
              styles.heightInput,
              {
                color: isAllSelected
                  ? '#FFFFFF'
                  : isDark
                    ? theme.colors.onBrand
                    : theme.colors.textPrimary,
                borderBottomColor: theme.colors.brandPrimary,
              },
            ]}
          />
        ) : (
          <TouchableOpacity
            onPress={startEditingHeight}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel={`Chiều cao hiện tại ${height} cm, nhấn để chỉnh sửa`}
          >
            <AppText
              style={[
                styles.heightValue,
                { color: isDark ? theme.colors.onBrand : theme.colors.textPrimary },
              ]}
            >
              {height}
            </AppText>
          </TouchableOpacity>
        )}
        <AppText
          style={[
            styles.heightUnit,
            { color: isDark ? theme.colors.onBrand : theme.colors.textPrimary },
          ]}
        >
          cm
        </AppText>
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

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          snapToInterval={STEP_WIDTH}
          decelerationRate="fast"
          contentContainerStyle={[styles.rulerScrollContent, { paddingHorizontal }]}
        >
          {tickItems.map((val) => {
            const isTen = val % 10 === 0;
            const isFive = val % 5 === 0;

            return (
              <View key={val} style={styles.tickWrapper}>
                <View style={styles.tickTrack}>
                  <View
                    style={[
                      styles.tick,
                      isTen
                        ? [
                          styles.tickTen,
                          {
                            backgroundColor: isDark
                              ? '#C5BFE3'
                              : theme.colors.brandPrimary,
                          },
                        ]
                        : isFive
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
                {isTen ? (
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
                    {val}
                  </AppText>
                ) : null}
              </View>
            );
          })}
        </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: 100,
    marginBottom: 20,
  },
  heightValue: {
    fontSize: 56,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 64,
  },
  heightInput: {
    minWidth: 112,
    textAlign: 'center',
    borderBottomWidth: 2,
    paddingVertical: 0,
  },
  heightUnit: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  rulerContainer: {
    position: 'relative',
    height: 120,
    justifyContent: 'center',
    marginTop: 10,
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
  rulerScrollContent: {
    alignItems: 'flex-start',
    height: 100,
    paddingTop: 10,
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
});
