import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '@/assets/images';
import { AppText } from '@/components/common';
import { ChevronLeftIcon } from '@/components/icons';

interface KalloWelcomeScreenProps {
  navigation?: any;
  onNext?: () => void;
  onBack?: () => void;
}

export function KalloWelcomeScreen({
  navigation,
  onNext,
  onBack,
}: KalloWelcomeScreenProps) {
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (navigation?.navigate) {
      navigation.navigate('HealthProfileWizard');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.() && navigation.canGoBack()) {
      navigation.goBack();
    }
  };

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

      {/* ── Speech Bubble ──────────────────────────────────────── */}
      <View style={styles.bubbleContainer}>
        <View style={styles.bubble}>
          <AppText style={styles.bubbleText}>
            Xin chào! Mình là Kallo - từ hôm nay,{'\n'}mình sẽ đồng hành cùng bạn
          </AppText>
        </View>
        <View style={styles.bubbleTail} />
      </View>

      {/* ── Mascot Center ──────────────────────────────────────── */}
      <View style={styles.mascotArea}>
        <Image
          source={images.onboardingMascot}
          style={styles.mascotImage}
          resizeMode="contain"
          accessibilityLabel="Linh vật Kallo"
        />
      </View>

      {/* ── Bottom Action ──────────────────────────────────────── */}
      <View style={[styles.bottomArea, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleNext}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Chào Kallo nha!"
        >
          <AppText style={styles.buttonText}>Chào Kallo nha!</AppText>
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
  bubbleContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 8,
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 22,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  bubbleText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 25,
    textAlign: 'left',
  },
  bubbleTail: {
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginTop: -8,
  },
  mascotArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    minHeight: 280,
  },
  mascotImage: {
    width: '100%',
    height: '85%',
    maxHeight: 380,
  },
  bottomArea: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  actionButton: {
    height: 56,
    backgroundColor: '#9358F7',
    borderRadius: 28,
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
