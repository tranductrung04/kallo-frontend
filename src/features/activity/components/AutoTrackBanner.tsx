import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { images } from '@/assets/images';

export type AutoTrackBannerProps = {
  onPress: () => void;
};

export function AutoTrackBanner({ onPress }: AutoTrackBannerProps) {
  return (
    <View style={styles.autoTrackSection}>
      <Text style={styles.sectionHeaderTitle}>THEO DÕI TỰ ĐỘNG</Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={styles.healthBannerCard}
        accessibilityRole="button"
        accessibilityLabel="Kết nối Google Health"
      >
        <View style={styles.healthIconContainer}>
          <Image
            source={images.healthConnectIcon}
            style={styles.healthIconImg}
            resizeMode="contain"
          />
        </View>
        <View style={styles.healthTextCol}>
          <Text style={styles.healthCardTitle}>
            Kết nối Google Health để Wao tự theo dõi calo hoạt động cho bạn.
          </Text>
          <Text style={styles.healthConnectLink}>Kết nối</Text>
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
    color: '#8E8A9E',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  healthBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A1F56',
    borderRadius: 16,
    padding: 16,
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
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    lineHeight: 20,
  },
  healthConnectLink: {
    color: '#B488FC',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700',
    marginTop: 8,
  },
});
