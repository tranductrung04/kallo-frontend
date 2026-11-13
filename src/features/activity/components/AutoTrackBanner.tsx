import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { images } from '@/assets/images';
import { useTheme } from '@/theme';

export type AutoTrackBannerProps = {
  onPress: () => void;
};

export function AutoTrackBanner({ onPress }: AutoTrackBannerProps) {
  const { colors: c } = useTheme();

  return (
    <View style={styles.autoTrackSection}>
      <Text style={[styles.sectionHeaderTitle, { color: c.textSecondary }]}>THEO DÕI TỰ ĐỘNG</Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[styles.healthBannerCard, { backgroundColor: c.surfaceHigh, borderColor: c.surfaceBorder }]}
        accessibilityRole="button"
        accessibilityLabel="Kết nối Google Health"
      >
        <View style={[styles.healthIconContainer, { backgroundColor: c.surfaceMid }]}>
          <Image
            source={images.healthConnectIcon}
            style={styles.healthIconImg}
            resizeMode="contain"
          />
        </View>
        <View style={styles.healthTextCol}>
          <Text style={[styles.healthCardTitle, { color: c.textPrimary }]}>
            Kết nối Google Health để Wao tự theo dõi calo hoạt động cho bạn.
          </Text>
          <Text style={[styles.healthConnectLink, { color: c.brandSecondary }]}>Kết nối</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  autoTrackSection: {
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  healthBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  healthIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthIconImg: {
    width: 36,
    height: 36,
  },
  healthTextCol: {
    flex: 1,
    marginLeft: 14,
  },
  healthCardTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    lineHeight: 20,
  },
  healthConnectLink: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
    marginTop: 8,
  },
});
