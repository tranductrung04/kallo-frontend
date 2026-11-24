import React, { useMemo } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { AppText } from '@/components/common';
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  BookOpenIcon,
  CalendarIcon,
  CrownIcon,
  FlameIcon,
  StarIcon,
  TrophyIcon,
  UsersIcon,
} from '@/components/icons';
import { useTheme, type ThemeContextValue } from '@/theme';
import type { Badge } from '../types';
import { getBadgeVisualConfig } from '../utils';

interface BadgeCelebrationModalProps {
  visible: boolean;
  badge: Badge | null;
  onClose: () => void;
  onViewBadge?: (badge: Badge) => void;
}

export function BadgeCelebrationModal({
  visible,
  badge,
  onClose,
  onViewBadge,
}: BadgeCelebrationModalProps) {
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!badge) return null;

  const visuals = getBadgeVisualConfig(badge);

  const renderBadgeIcon = () => {
    switch (visuals.iconName) {
      case 'flame':
        return (
          <View style={styles.flameWithNum}>
            <FlameIcon size={46} color="#FFFFFF" />
            <AppText variant="labelSm" color="#FFFFFF" style={styles.streakNumberText}>
              7
            </AppText>
          </View>
        );
      case 'book-open':
        return <BookOpenIcon size={46} color="#FFFFFF" />;
      case 'users':
        return <UsersIcon size={46} color="#FFFFFF" />;
      case 'calendar':
        return <CalendarIcon size={44} color="#FFFFFF" />;
      case 'crown':
        return <CrownIcon size={46} color="#FFFFFF" />;
      case 'badge-check':
        return <BadgeCheckIcon size={46} color="#FFFFFF" />;
      case 'trophy':
      default:
        return <TrophyIcon size={46} color="#FFFFFF" />;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Floating Confetti Elements */}
        <View style={styles.confettiWrap} pointerEvents="none">
          <View style={[styles.confettiDot, styles.dot1, { backgroundColor: c.brandAction }]} />
          <View style={[styles.confettiChip, styles.chip1, { backgroundColor: c.vipStreak }]} />
          <View style={[styles.confettiDot, styles.dot2, { backgroundColor: c.brandSecondary }]} />
          <View style={[styles.confettiChip, styles.chip2, { backgroundColor: c.vipStreak }]} />
          <View style={[styles.confettiDot, styles.dot3, { backgroundColor: c.brandPrimary }]} />
          <View style={[styles.confettiChip, styles.chip3, { backgroundColor: c.brandAction }]} />
        </View>

        {/* Celebration Card */}
        <View style={[styles.card, { backgroundColor: c.surfaceMid }]}>
          {/* Ambient Glow behind badge */}
          <View
            style={[
              styles.ambientGlow,
              {
                backgroundColor: visuals.glowColor,
              },
            ]}
          />

          {/* Top Pill Chip */}
          <View style={[styles.topPill, { backgroundColor: c.brandSoftTint }]}>
            <BadgeCheckIcon size={14} color={c.brandSecondary} />
            <AppText variant="labelSm" color={c.brandSecondary} style={styles.topPillText}>
              HUY HIỆU MỚI!
            </AppText>
          </View>

          {/* Hero Medallion (140px) */}
          <View style={styles.medallionWrap}>
            {/* Radiating Rays SVG */}
            <Svg width={140} height={140} viewBox="0 0 140 140" style={styles.radiatingSvg}>
              <Circle
                cx={70}
                cy={70}
                r={64}
                stroke={visuals.primaryColor}
                strokeWidth={2}
                strokeDasharray="4 6"
                fill="none"
                opacity={0.35}
              />
              <Path
                d="M70 4L70 16M70 124L70 136M4 70L16 70M124 70L136 70M23 23L32 32M108 108L117 117M23 117L32 108M108 32L117 23"
                stroke={visuals.primaryColor}
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.35}
              />
            </Svg>

            {/* Outer Medallion Plate */}
            <View
              style={[
                styles.outerMedallion,
                {
                  backgroundColor: visuals.primaryColor,
                  borderColor: '#FFFFFF',
                },
              ]}
            >
              {/* Inner Faceted Disc */}
              <View
                style={[
                  styles.innerDisc,
                  {
                    backgroundColor: visuals.secondaryColor,
                  },
                ]}
              >
                {renderBadgeIcon()}
              </View>
            </View>

            {/* Sparkle Micro-Badges */}
            <View style={[styles.microSparkle1, { backgroundColor: c.surfaceMid }]}>
              <StarIcon size={12} color={c.vipStreak} />
            </View>
            <View style={[styles.microSparkle2, { backgroundColor: c.surfaceMid }]}>
              <StarIcon size={10} color={c.brandSecondary} />
            </View>
          </View>

          {/* Main Headline & Subtitle */}
          <AppText variant="headlineLg" color={c.textPrimary} style={styles.headlineTitle}>
            {badge.title}
          </AppText>
          <AppText variant="bodyMd" color={c.textSecondary} align="center" style={styles.subtitleText}>
            {badge.description}
          </AppText>

          {/* Reward Pill */}
          <View
            style={[
              styles.rewardPill,
              {
                backgroundColor:
                  theme.scheme === 'dark'
                    ? 'rgba(217, 119, 6, 0.22)'
                    : '#FFDCC3',
              },
            ]}
          >
            <StarIcon size={18} color={c.vipStreak} />
            <AppText variant="labelLg" color={c.vipStreak} style={styles.boldText}>
              +{badge.points || 20} điểm rèn luyện
            </AppText>
          </View>

          {/* Action Buttons (Stacked) */}
          <View style={styles.actionButtonsCol}>
            <TouchableOpacity
              activeOpacity={0.88}
              style={[styles.primaryActionBtn, { backgroundColor: c.brandAction }]}
              onPress={() => {
                onClose();
                if (onViewBadge) onViewBadge(badge);
              }}
            >
              <AppText variant="labelLg" color="#FFFFFF" style={styles.boldText}>
                Xem huy hiệu
              </AppText>
              <ArrowRightIcon size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.dismissBtn}
              onPress={onClose}
            >
              <AppText variant="labelLg" color={c.textSecondary}>
                Để sau
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(theme: ThemeContextValue) {
  const { colors: c } = theme;
  const isDark = theme.scheme === 'dark';

  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(28, 26, 36, 0.55)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    confettiWrap: {
      ...StyleSheet.absoluteFill,
    },
    confettiDot: {
      position: 'absolute',
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    confettiChip: {
      position: 'absolute',
      width: 12,
      height: 7,
      borderRadius: 2,
    },
    dot1: { top: '18%', left: '12%' },
    chip1: { top: '22%', right: '16%', transform: [{ rotate: '45deg' }] },
    dot2: { top: '28%', left: '22%' },
    chip2: { top: '15%', right: '28%', transform: [{ rotate: '12deg' }] },
    dot3: { top: '32%', right: '10%' },
    chip3: { top: '35%', left: '8%', transform: [{ rotate: '-12deg' }] },

    card: {
      width: '100%',
      maxWidth: 340,
      borderRadius: 24,
      padding: 24,
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 28,
      elevation: 12,
    },
    ambientGlow: {
      position: 'absolute',
      top: -30,
      width: 200,
      height: 200,
      borderRadius: 100,
      opacity: 0.8,
    },
    topPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 16,
      marginBottom: 16,
      zIndex: 2,
    },
    topPillText: {
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    medallionWrap: {
      width: 140,
      height: 140,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      marginVertical: 4,
      zIndex: 2,
    },
    radiatingSvg: {
      position: 'absolute',
    },
    outerMedallion: {
      width: 108,
      height: 108,
      borderRadius: 54,
      borderWidth: 3,
      padding: 4,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#D97706',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 6,
    },
    innerDisc: {
      width: '100%',
      height: '100%',
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    flameWithNum: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    streakNumberText: {
      fontWeight: '800',
      fontSize: 16,
      lineHeight: 18,
      marginTop: -8,
    },
    microSparkle1: {
      position: 'absolute',
      top: 10,
      right: 12,
      borderRadius: 12,
      padding: 3,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    microSparkle2: {
      position: 'absolute',
      bottom: 12,
      left: 14,
      borderRadius: 10,
      padding: 3,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    headlineTitle: {
      fontWeight: '700',
      marginTop: 14,
      marginBottom: 6,
      zIndex: 2,
    },
    subtitleText: {
      maxWidth: 260,
      lineHeight: 22,
      marginBottom: 16,
      zIndex: 2,
    },
    rewardPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginBottom: 20,
      zIndex: 2,
    },
    actionButtonsCol: {
      width: '100%',
      gap: 8,
      zIndex: 2,
    },
    primaryActionBtn: {
      width: '100%',
      height: 48,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      shadowColor: c.brandAction,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 3,
    },
    dismissBtn: {
      width: '100%',
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    boldText: {
      fontWeight: '700',
    },
  });
}
