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
import { AnimatedCard } from '../components';
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
  const [selectedGender, setSelectedGender] = useState<Gender>(draft.gender || 'male');

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
    <View style={styles.contentWrap}>
      {/* ── Avatar & White Speech Bubble Row (Exactly like reference image) ── */}
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

      {/* ── 2 Minimalist Square Cards Side-by-Side (Centered in screen) ── */}
      <View style={styles.centerSection}>
        <View style={styles.cardsRow}>
          {/* Nữ (Female) */}
          <AnimatedCard
            selected={isFemale}
            onPress={() => setSelectedGender('female')}
            containerStyle={styles.cardContainer}
            style={styles.genderCard}
            selectedBorderColor="#9D6CFA"
            selectedBgColor="#260F53"
            unselectedBorderColor="#2D2A3F"
            unselectedBgColor="#2D2A3F"
            activeScale={0.96}
            accessibilityLabel="Giới tính Nữ"
            accessibilityRole="radio"
          >
            <View style={styles.cardContent}>
              {/* SVG Female Icon ♀ */}
              <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
                <Circle
                  cx="12"
                  cy="9.5"
                  r="5.5"
                  stroke={isFemale ? '#FFFFFF' : '#A09CAE'}
                  strokeWidth="2.2"
                />
                <Line
                  x1="12"
                  y1="15"
                  x2="12"
                  y2="21.5"
                  stroke={isFemale ? '#FFFFFF' : '#A09CAE'}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <Line
                  x1="8.5"
                  y1="18.2"
                  x2="15.5"
                  y2="18.2"
                  stroke={isFemale ? '#FFFFFF' : '#A09CAE'}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </Svg>

              <AppText
                style={[
                  styles.genderLabel,
                  isFemale && styles.genderLabelSelected,
                ]}
              >
                Nữ
              </AppText>
            </View>
          </AnimatedCard>

          {/* Nam (Male) */}
          <AnimatedCard
            selected={isMale}
            onPress={() => setSelectedGender('male')}
            containerStyle={styles.cardContainer}
            style={styles.genderCard}
            selectedBorderColor="#9D6CFA"
            selectedBgColor="#260F53"
            unselectedBorderColor="#2D2A3F"
            unselectedBgColor="#2D2A3F"
            activeScale={0.96}
            accessibilityLabel="Giới tính Nam"
            accessibilityRole="radio"
          >
            <View style={styles.cardContent}>
              {/* SVG Male Icon ♂ */}
              <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
                <Circle
                  cx="10"
                  cy="14"
                  r="5.5"
                  stroke={isMale ? '#FFFFFF' : '#A09CAE'}
                  strokeWidth="2.2"
                />
                <Line
                  x1="14"
                  y1="10"
                  x2="20"
                  y2="4"
                  stroke={isMale ? '#FFFFFF' : '#A09CAE'}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <Path
                  d="M15 4h5v5"
                  stroke={isMale ? '#FFFFFF' : '#A09CAE'}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>

              <AppText
                style={[
                  styles.genderLabel,
                  isMale && styles.genderLabelSelected,
                ]}
              >
                Nam
              </AppText>
            </View>
          </AnimatedCard>
        </View>
      </View>

      {/* ── Bottom Action Button ("Tiếp tục") ──────────────────── */}
      <View style={[styles.bottomArea, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleNext}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel="Tiếp tục"
        >
          <AppText style={styles.buttonText}>Tiếp tục</AppText>
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: '#0E091D',
  },
  innerContainer: {
    flex: 1,
  },
  contentWrap: {
    flex: 1,
    justifyContent: 'space-between',
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
    height: 5,
    backgroundColor: '#272049',
    borderRadius: 2.5,
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9D6CFA',
    borderRadius: 2.5,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 12,
  },
  avatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 22,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleTail: {
    position: 'absolute',
    left: -8,
    top: 22,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#FFFFFF',
  },
  bubbleText: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 22,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
  },
  genderCard: {
    width: '100%',
    height: 120,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  genderLabel: {
    fontSize: 16.5,
    fontWeight: '600',
    color: '#A09CAE',
  },
  genderLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bottomArea: {
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
