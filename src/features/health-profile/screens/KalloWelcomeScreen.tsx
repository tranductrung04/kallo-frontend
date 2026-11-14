import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/common';
import { ChevronLeftIcon, MoonIcon, SunIcon } from '@/components/icons';
import { ChampionMascotRNPro } from '@/features/onboarding/components';
import { useTheme } from '@/theme';

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
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const { width, height } = useWindowDimensions();

  // Tính toán kích thước mascot responsive dựa trên chiều rộng và chiều cao màn hình
  const mascotSize = Math.min(width * 0.76, height * 0.38, 320);

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
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: isDark ? '#120E29' : theme.colors.canvasBase,
        },
      ]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* ── Top Bar ────────────────────────────────────────────── */}
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

        <View style={styles.topBarSpacer} />

        <TouchableOpacity
          onPress={theme.toggleScheme}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel={
            isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'
          }
          style={styles.themeToggleBtn}
        >
          {isDark ? (
            <SunIcon size={20} color="#FACC15" />
          ) : (
            <MoonIcon size={20} color={theme.colors.brandPrimary} />
          )}
        </TouchableOpacity>
      </View>

      {/* ── Speech Bubble ──────────────────────────────────────── */}
      <View style={styles.bubbleContainer}>
        <View
          style={[
            styles.bubble,
            !isDark && {
              borderWidth: 1,
              borderColor: theme.colors.surfaceBorder,
            },
          ]}
        >
          <AppText style={styles.bubbleText}>
            Xin chào! Mình là Kallo - từ hôm nay,{'\n'}mình sẽ đồng hành cùng bạn
          </AppText>
        </View>
        <View
          style={[
            styles.bubbleTail,
            !isDark && {
              borderRightWidth: 1,
              borderBottomWidth: 1,
              borderColor: theme.colors.surfaceBorder,
            },
          ]}
        />
      </View>

      {/* ── Mascot Center (SVG Vector & Animation tương tác 100% Native Driver) ──── */}
      <View style={styles.mascotArea}>
        <ChampionMascotRNPro
          size={mascotSize}
          mode="idle"
          interactive={true}
          accessibilityLabel="Linh vật Kallo năng động"
        />
      </View>

      {/* ── Bottom Action ──────────────────────────────────────── */}
      <View style={[styles.bottomArea, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.brandAction },
          ]}
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
  topBarSpacer: {
    flex: 1,
  },
  themeToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    paddingHorizontal: 20,
    minHeight: 280,
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
