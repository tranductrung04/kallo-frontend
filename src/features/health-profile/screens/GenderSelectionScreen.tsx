import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { images } from '@/assets/images';
import { AppText } from '@/components/common';
import { ChevronLeftIcon } from '@/components/icons';
import { AnimatedCard, AnimatedRadio } from '../components';
import { useHealthProfileDraft } from '../hooks/useHealthProfileDraft';
import type { Gender } from '../types';

interface GenderSelectionScreenProps {
  navigation?: any;
  onNext?: (gender: Gender) => void;
  onBack?: () => void;
  hideHeader?: boolean;
}

export function GenderSelectionScreen({
  navigation,
  onNext,
  onBack,
  hideHeader = false,
}: GenderSelectionScreenProps) {
  const insets = useSafeAreaInsets();
  const { draft, updateDraft } = useHealthProfileDraft();
  const [selectedGender, setSelectedGender] = useState<Gender>(draft.gender || 'female');

  const handleNext = () => {
    updateDraft('gender', selectedGender);

    if (onNext) {
      onNext(selectedGender);
    } else if (navigation?.navigate) {
      navigation.navigate('HeightSelection');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.() && navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const isFemale = selectedGender === 'female';
  const isMale = selectedGender === 'male';

  const content = (
    <>
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
            Giới tính của bạn là...
          </AppText>
        </View>
      </View>

      {/* ── 2 Square Cards Side-by-Side ─────────────────────────── */}
      <View style={styles.cardsRow}>
        {/* Nữ - Pink accent with custom SVG */}
        <AnimatedCard
          selected={isFemale}
          onPress={() => setSelectedGender('female')}
          style={styles.squareCard}
          selectedBorderColor="#F43F5E"
          selectedBgColor="#2A1226"
          unselectedBorderColor="#2E2352"
          unselectedBgColor="#1A1433"
          activeScale={0.95}
          accessibilityLabel="Giới tính Nữ"
          accessibilityRole="radio"
        >
          <View style={styles.cardInner}>
            {/* Top Right Radio Indicator */}
            <View style={styles.radioTopRight}>
              <AnimatedRadio selected={isFemale} activeColor="#F43F5E" size={20} />
            </View>

            {/* SVG Female Icon in Circular Wrap */}
            <View
              style={[
                styles.iconCircle,
                isFemale ? styles.femaleCircleSelected : styles.circleUnselected,
              ]}
            >
              <Svg width={38} height={38} viewBox="0 0 24 24" fill="none">
                <Circle
                  cx="12"
                  cy="9.5"
                  r="5.5"
                  stroke={isFemale ? '#FB7185' : '#716894'}
                  strokeWidth="2.4"
                />
                <Line
                  x1="12"
                  y1="15"
                  x2="12"
                  y2="21.5"
                  stroke={isFemale ? '#FB7185' : '#716894'}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <Line
                  x1="8.5"
                  y1="18.2"
                  x2="15.5"
                  y2="18.2"
                  stroke={isFemale ? '#FB7185' : '#716894'}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </Svg>
            </View>

            {/* Label */}
            <AppText
              style={[
                styles.genderLabel,
                isFemale ? styles.femaleLabelSelected : styles.labelUnselected,
              ]}
            >
              Nữ
            </AppText>
          </View>
        </AnimatedCard>

        {/* Nam - Blue accent with custom SVG */}
        <AnimatedCard
          selected={isMale}
          onPress={() => setSelectedGender('male')}
          style={styles.squareCard}
          selectedBorderColor="#0284C7"
          selectedBgColor="#0D223E"
          unselectedBorderColor="#2E2352"
          unselectedBgColor="#1A1433"
          activeScale={0.95}
          accessibilityLabel="Giới tính Nam"
          accessibilityRole="radio"
        >
          <View style={styles.cardInner}>
            {/* Top Right Radio Indicator */}
            <View style={styles.radioTopRight}>
              <AnimatedRadio selected={isMale} activeColor="#0284C7" size={20} />
            </View>

            {/* SVG Male Icon in Circular Wrap */}
            <View
              style={[
                styles.iconCircle,
                isMale ? styles.maleCircleSelected : styles.circleUnselected,
              ]}
            >
              <Svg width={38} height={38} viewBox="0 0 24 24" fill="none">
                <Circle
                  cx="10"
                  cy="14"
                  r="5.5"
                  stroke={isMale ? '#38BDF8' : '#716894'}
                  strokeWidth="2.4"
                />
                <Line
                  x1="14"
                  y1="10"
                  x2="20"
                  y2="4"
                  stroke={isMale ? '#38BDF8' : '#716894'}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <Path
                  d="M15 4h5v5"
                  stroke={isMale ? '#38BDF8' : '#716894'}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>

            {/* Label */}
            <AppText
              style={[
                styles.genderLabel,
                isMale ? styles.maleLabelSelected : styles.labelUnselected,
              ]}
            >
              Nam
            </AppText>
          </View>
        </AnimatedCard>
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
    </>
  );

  if (hideHeader) {
    return <View style={styles.innerContainer}>{content}</View>;
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Top Bar ────────────────────────────────────────────── */}
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

      {/* ── Progress Bar (~20%) ────────────────────────────────── */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: '20%' }]} />
      </View>

      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120E29',
  },
  innerContainer: {
    flex: 1,
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
    height: 6,
    backgroundColor: '#272049',
    borderRadius: 3,
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9D6CFA',
    borderRadius: 3,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#302657',
    borderWidth: 2,
    borderColor: '#9D6CFA',
    overflow: 'hidden',
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  bubble: {
    flex: 1,
    backgroundColor: '#241B42',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#382D61',
  },
  bubbleTail: {
    position: 'absolute',
    left: -8,
    top: 18,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#241B42',
  },
  bubbleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
  },
  squareCard: {
    flex: 1,
    height: 175,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  radioTopRight: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  femaleCircleSelected: {
    backgroundColor: 'rgba(244, 63, 94, 0.18)',
  },
  maleCircleSelected: {
    backgroundColor: 'rgba(2, 132, 199, 0.18)',
  },
  circleUnselected: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  genderLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  femaleLabelSelected: {
    color: '#FDA4AF',
  },
  maleLabelSelected: {
    color: '#BAE6FD',
  },
  labelUnselected: {
    color: '#E2E8F0',
  },
  bottomArea: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  actionButton: {
    backgroundColor: '#9D6CFA',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9D6CFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
