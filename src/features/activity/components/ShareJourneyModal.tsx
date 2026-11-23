import React from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { CloseXIcon, QrCodeIcon } from '@/components/icons';
import { useTheme } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type ShareJourneyModalProps = {
  visible: boolean;
  onClose: () => void;
  initialWeight?: number;
  currentWeight?: number;
  startDate?: string;
  currentDate?: string;
};

// Silhouette of a person matching the design
function PersonSilhouetteSvg({
  size = 76,
  color = 'rgba(255, 255, 255, 0.22)',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size * 0.52} height={size} viewBox="0 0 40 80" fill="none">
      {/* Head */}
      <Circle cx="20" cy="14" r="8.5" fill={color} />
      {/* Silhouette body */}
      <Path
        d="M12 28 C7 28 6 36 8 48 C9 58 11 68 12 72 C13 74 15 74 16 71 L17 49 L23 49 L24 71 C25 74 27 74 28 72 C29 68 31 58 32 48 C34 36 33 28 28 28 Z"
        fill={color}
      />
    </Svg>
  );
}

export function ShareJourneyModal({
  visible,
  onClose,
  initialWeight,
  currentWeight,
  startDate,
  currentDate,
}: ShareJourneyModalProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors: c } = theme;
  const isAppDark = theme.scheme === 'dark';
  const isLightTemplate = !isAppDark;

  const handleShare = async () => {
    try {
      const shareMessage =
        currentWeight && initialWeight
          ? `Tôi đang theo dõi hành trình cân nặng (${initialWeight}kg → ${currentWeight}kg) cùng Kallo! Tải ứng dụng Kallo ngay.`
          : `Tôi đang theo dõi hành trình sức khỏe và vóc dáng cùng Kallo! Tải ứng dụng Kallo ngay.`;

      await Share.share({
        message: shareMessage,
        title: 'Chia sẻ hành trình Kallo',
      });
    } catch {
      // User dismissed share dialog or platform cancelled
    }
  };

  const cardWidth = Math.min(SCREEN_WIDTH - 48, 340);
  const cardHeight = Math.round(cardWidth * 1.34);

  // Dynamic Theme Colors for the Modal Chrome
  const modalBg = isAppDark ? '#100C1A' : c.canvasBase;
  const topBarTextColor = isAppDark ? '#FFFFFF' : c.textPrimary;
  const subtitleColor = isAppDark ? '#8A849F' : c.textSecondary;
  const bottomBtnBg = isAppDark ? '#201A36' : c.brandPrimary;
  const bottomBtnTextColor = isAppDark ? '#9E97B5' : '#FFFFFF';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: modalBg,
            paddingTop: Math.max(12, insets.top),
            paddingBottom: Math.max(16, insets.bottom),
          },
        ]}
      >
        <StatusBar
          barStyle={isAppDark ? 'light-content' : 'dark-content'}
          backgroundColor={modalBg}
        />

        {/* ── Top Bar ────────────────────────────────────────── */}
        <View style={styles.topBar}>
          <View style={styles.topBarSpacer} />
          <Text style={[styles.topBarTitle, { color: topBarTextColor }]}>
            Chia sẻ hành trình
          </Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
            accessibilityRole="button"
            accessibilityLabel="Đóng"
          >
            <CloseXIcon size={22} color={topBarTextColor} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        {/* ── Subtitle ──────────────────────────────────────── */}
        <Text style={[styles.subtitle, { color: subtitleColor }]}>
          CHỌN MỘT TEMPLATE BẠN THÍCH
        </Text>

        {/* ── Template Card Preview ──────────────────────────── */}
        <View style={styles.previewContainer}>
          <View
            style={[
              styles.cardWrapper,
              {
                width: cardWidth,
                height: cardHeight,
                backgroundColor: isLightTemplate ? '#FFFFFF' : '#1C172E',
                borderColor: isLightTemplate ? '#E5E0F8' : 'rgba(255, 255, 255, 0.08)',
              },
            ]}
          >
            {/* Organic background shapes inside the card */}
            <Svg
              style={StyleSheet.absoluteFill}
              width={cardWidth}
              height={cardHeight}
              viewBox={`0 0 ${cardWidth} ${cardHeight}`}
            >
              <Circle
                cx={cardWidth * 0.85}
                cy={cardHeight * 0.28}
                r={cardWidth * 0.45}
                fill={
                  isLightTemplate
                    ? 'rgba(123, 79, 224, 0.06)'
                    : 'rgba(123, 79, 224, 0.08)'
                }
              />
              <Circle
                cx={cardWidth * 0.15}
                cy={cardHeight * 0.55}
                r={cardWidth * 0.4}
                fill={
                  isLightTemplate
                    ? 'rgba(167, 123, 245, 0.05)'
                    : 'rgba(167, 123, 245, 0.05)'
                }
              />
            </Svg>

            {/* Top Logo: kallo */}
            <Text
              style={[
                styles.cardHeaderLogo,
                { color: isLightTemplate ? '#7B4FE0' : '#A77BF5' },
              ]}
            >
              kallo
            </Text>

            {/* Center Content: Two Transformation Cards */}
            <View style={styles.transformationRow}>
              {/* Card 1: Before / Start */}
              <View
                style={[
                  styles.personCard,
                  {
                    backgroundColor: isLightTemplate
                      ? '#F5F2FD'
                      : 'rgba(255, 255, 255, 0.07)',
                    borderColor: isLightTemplate
                      ? '#E8E2FA'
                      : 'rgba(255, 255, 255, 0.06)',
                  },
                ]}
              >
                <View style={styles.silhouetteWrapper}>
                  <PersonSilhouetteSvg
                    size={82}
                    color={
                      isLightTemplate
                        ? 'rgba(123, 79, 224, 0.28)'
                        : 'rgba(255, 255, 255, 0.22)'
                    }
                  />
                </View>
                <View
                  style={[
                    styles.metricPill,
                    {
                      backgroundColor: isLightTemplate
                        ? '#FFFFFF'
                        : 'rgba(16, 12, 26, 0.88)',
                      borderColor: isLightTemplate ? '#E8E3FA' : 'transparent',
                      borderWidth: isLightTemplate ? 1 : 0,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.metricWeightText,
                      { color: isLightTemplate ? '#1C172E' : '#FFFFFF' },
                    ]}
                  >
                    {initialWeight ? `${initialWeight} kg` : '- kg'}
                  </Text>
                  <Text
                    style={[
                      styles.metricDateText,
                      { color: isLightTemplate ? '#736B8E' : '#8A849F' },
                    ]}
                  >
                    {startDate || 'dd/MM/YYYY'}
                  </Text>
                </View>
              </View>

              {/* Card 2: After / Current */}
              <View
                style={[
                  styles.personCard,
                  styles.personCardOffset,
                  {
                    backgroundColor: isLightTemplate
                      ? '#F5F2FD'
                      : 'rgba(255, 255, 255, 0.07)',
                    borderColor: isLightTemplate
                      ? '#E8E2FA'
                      : 'rgba(255, 255, 255, 0.06)',
                  },
                ]}
              >
                <View style={styles.silhouetteWrapper}>
                  <PersonSilhouetteSvg
                    size={82}
                    color={
                      isLightTemplate
                        ? 'rgba(123, 79, 224, 0.28)'
                        : 'rgba(255, 255, 255, 0.22)'
                    }
                  />
                </View>
                <View
                  style={[
                    styles.metricPill,
                    {
                      backgroundColor: isLightTemplate
                        ? '#FFFFFF'
                        : 'rgba(16, 12, 26, 0.88)',
                      borderColor: isLightTemplate ? '#E8E3FA' : 'transparent',
                      borderWidth: isLightTemplate ? 1 : 0,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.metricWeightText,
                      { color: isLightTemplate ? '#1C172E' : '#FFFFFF' },
                    ]}
                  >
                    {currentWeight ? `${currentWeight} kg` : '- kg'}
                  </Text>
                  <Text
                    style={[
                      styles.metricDateText,
                      { color: isLightTemplate ? '#736B8E' : '#8A849F' },
                    ]}
                  >
                    {currentDate || 'dd/MM/YYYY'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Bottom Purple Banner */}
            <View style={styles.bottomBanner}>
              <Text style={styles.bannerLogoText}>kallo</Text>

              <Text style={styles.bannerInstructionText}>
                Nhấn và giữ mã QR{'\n'}để tải ứng dụng
              </Text>

              <View style={styles.qrCodeBadge}>
                <QrCodeIcon size={34} color="#000000" />
              </View>
            </View>
          </View>

          {/* ── Pagination Dots ──────────────────────────────── */}
          <View style={styles.paginationRow}>
            <View
              style={[
                styles.paginationDot,
                !isLightTemplate && styles.paginationDotActive,
              ]}
            />
            <View
              style={[
                styles.paginationDot,
                isLightTemplate && styles.paginationDotActive,
              ]}
            />
          </View>
        </View>

        {/* ── Bottom Action Button ───────────────────────────── */}
        <TouchableOpacity
          style={[styles.bottomShareBtn, { backgroundColor: bottomBtnBg }]}
          onPress={handleShare}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Chia sẻ thành quả"
        >
          <Text
            style={[styles.bottomShareBtnText, { color: bottomBtnTextColor }]}
          >
            Chia sẻ thành quả
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  topBarSpacer: {
    width: 40,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  cardWrapper: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'space-between',
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeaderLogo: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    marginTop: 4,
  },
  transformationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  personCard: {
    width: 124,
    height: 172,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  personCardOffset: {
    marginLeft: 10,
  },
  silhouetteWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricPill: {
    width: '86%',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  metricWeightText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  metricDateText: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans_500Medium',
    marginTop: 2,
  },
  bottomBanner: {
    height: 70,
    backgroundColor: '#7B4FE0',
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerLogoText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
  },
  bannerInstructionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 15,
    maxWidth: 124,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  qrCodeBadge: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(123, 79, 224, 0.25)',
  },
  paginationDotActive: {
    backgroundColor: '#7B4FE0',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bottomShareBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  bottomShareBtnText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
