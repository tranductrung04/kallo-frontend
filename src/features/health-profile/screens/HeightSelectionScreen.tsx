import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '@/assets/images';
import { AppText } from '@/components/common';
import { ChevronLeftIcon } from '@/components/icons';
import { useHealthProfileDraft } from '../hooks/useHealthProfileDraft';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MIN_HEIGHT = 100;
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
  const { draft, updateDraft } = useHealthProfileDraft();

  const initialVal = useMemo(() => {
    const parsed = parseInt(draft.height, 10);
    if (!isNaN(parsed) && parsed >= MIN_HEIGHT && parsed <= MAX_HEIGHT) {
      return parsed;
    }
    return DEFAULT_HEIGHT;
  }, [draft.height]);

  const [height, setHeight] = useState<number>(initialVal);
  const scrollRef = useRef<ScrollView>(null);
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

  const handleNext = () => {
    updateDraft('height', String(height));

    if (onNext) {
      onNext(height);
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
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
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
              <ChevronLeftIcon size={26} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* ── Progress Bar (~35%) ────────────────────────────────── */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '35%' }]} />
          </View>
        </>
      )}

      {/* ── Avatar & Speech Bubble Row ─────────────────────────── */}
      <View style={styles.bubbleRow}>
        <View style={styles.avatarWrap}>
          <Image
            source={images.mascotAvatar}
            style={styles.avatarImage}
            resizeMode="cover"
            accessibilityLabel="Mascot Kallo"
          />
        </View>
        <View style={styles.bubble}>
          <View style={styles.bubbleTail} />
          <AppText style={styles.bubbleText}>
            Chiều cao của bạn là...
          </AppText>
        </View>
      </View>

      {/* ── Height Value Display ───────────────────────────────── */}
      <View style={styles.valueContainer}>
        <AppText style={styles.heightValue}>{height}</AppText>
        <AppText style={styles.heightUnit}>cm</AppText>
      </View>

      {/* ── Interactive Horizontal Ruler ──────────────────────── */}
      <View style={styles.rulerContainer}>
        {/* Fixed Center Purple Cursor Line */}
        <View style={styles.centerCursor} pointerEvents="none" />

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
                <View
                  style={[
                    styles.tick,
                    isTen
                      ? styles.tickTen
                      : isFive
                      ? styles.tickFive
                      : styles.tickOne,
                  ]}
                />
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Bottom Action Button ───────────────────────────────── */}
      <View style={[styles.bottomArea, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.actionButton}
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
    top: 12,
    left: '50%',
    transform: [{ translateX: -1.5 }],
    width: 3,
    height: 85,
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
    alignItems: 'center',
    height: 100,
  },
  tickWrapper: {
    width: STEP_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  tick: {
    borderRadius: 1,
  },
  tickTen: {
    width: 2,
    height: 50,
    backgroundColor: '#C5BFE3',
  },
  tickFive: {
    width: 2,
    height: 34,
    backgroundColor: '#776F9F',
  },
  tickOne: {
    width: 1.5,
    height: 22,
    backgroundColor: '#372F5B',
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
