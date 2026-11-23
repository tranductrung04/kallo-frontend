import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { images } from '@/assets/images';
import { useTheme } from '@/theme';
import { useActivity } from '../ActivityProvider';

export type AutoTrackBannerProps = {
  onPress: () => void;
};

export function AutoTrackBanner({ onPress }: AutoTrackBannerProps) {
  const { colors: c } = useTheme();
  const { state } = useActivity();

  const isIos = Platform.OS === 'ios';
  const providerKey = isIos ? 'appleHealth' : 'healthConnect';
  const providerName = isIos ? 'Apple Health' : 'Google Health Connect';
  const providerLogo = isIos ? images.appleHealthIcon : images.healthConnectIcon;
  const isConnected = state.syncStatus[providerKey] === 'CONNECTED';

  return (
    <View style={styles.autoTrackSection}>
      <Text style={[styles.sectionHeaderTitle, { color: c.textSecondary }]}>THEO DÕI TỰ ĐỘNG</Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[styles.healthBannerCard, { backgroundColor: c.surfaceHigh, borderColor: c.surfaceBorder }]}
        accessibilityRole="button"
        accessibilityLabel={`Kết nối ${providerName}`}
      >
        <View style={[styles.healthIconContainer, { backgroundColor: c.surfaceMid }]}>
          <Image
            source={providerLogo}
            style={styles.healthIconImg}
            resizeMode="contain"
          />
        </View>
        <View style={styles.healthTextCol}>
          <Text style={[styles.healthCardTitle, { color: c.textPrimary }]}>
            {isConnected
              ? `Đã liên kết ${providerName}. Kallo tự động đồng bộ bước chân & calo.`
              : `Kết nối ${providerName} để Kallo tự theo dõi calo hoạt động cho bạn.`}
          </Text>
          <Text
            style={[
              styles.healthConnectLink,
              { color: isConnected ? c.quickScanner : c.brandSecondary },
            ]}
          >
            {isConnected ? 'Quản lý đồng bộ' : 'Kết nối'}
          </Text>
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
