import React, { useMemo } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { AppText } from '@/components/common';
import {
  BadgeCheckIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckIcon,
  CloseXIcon,
  CrownIcon,
  FlameIcon,
  LockClosedIcon,
  StarIcon,
  TargetIcon,
  TrophyIcon,
  UsersIcon,
} from '@/components/icons';
import { useTheme, type ThemeContextValue } from '@/theme';
import type { Badge } from '../types';
import { getBadgeVisualConfig } from '../utils';

interface BadgeDetailBottomSheetProps {
  visible: boolean;
  badge: Badge | null;
  onClose: () => void;
}

export function BadgeDetailBottomSheet({
  visible,
  badge,
  onClose,
}: BadgeDetailBottomSheetProps) {
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!badge) return null;

  const visuals = getBadgeVisualConfig(badge);

  const renderBadgeIcon = () => {
    const iconColor = badge.isUnlocked ? '#FFFFFF' : c.textDisabled;
    switch (visuals.iconName) {
      case 'book-open':
        return <BookOpenIcon size={52} color={iconColor} />;
      case 'flame':
        return <FlameIcon size={54} color={iconColor} />;
      case 'users':
        return <UsersIcon size={52} color={iconColor} />;
      case 'calendar':
        return <CalendarIcon size={50} color={iconColor} />;
      case 'crown':
        return <CrownIcon size={52} color={iconColor} />;
      case 'badge-check':
        return <BadgeCheckIcon size={52} color={iconColor} />;
      case 'trophy':
      default:
        return <TrophyIcon size={52} color={iconColor} />;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlayBackdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.sheetContainer, { backgroundColor: c.surfaceMid }]}>
              {/* Drag Handle */}
              <View style={[styles.dragHandle, { backgroundColor: c.surfaceBorder }]} />

              {/* Close Button Top Right */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.closeBtn, { backgroundColor: c.surfaceHigh }]}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Đóng chi tiết"
              >
                <CloseXIcon size={18} color={c.textSecondary} />
              </TouchableOpacity>

              {/* Sheet Inner Content Flow */}
              <View style={styles.sheetContent}>
                {/* Large Medallion (120px) with Glow & Radiance */}
                <View style={styles.medallionWrap}>
                  {/* Ambient Glow */}
                  <View
                    style={[
                      styles.ambientGlow,
                      {
                        backgroundColor: badge.isUnlocked
                          ? visuals.glowColor
                          : (theme.scheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'),
                      },
                    ]}
                  />

                  {/* Outer Medallion Ring */}
                  <View
                    style={[
                      styles.outerRing,
                      {
                        backgroundColor: badge.isUnlocked
                          ? visuals.primaryColor
                          : c.surfaceHigh,
                        borderColor: badge.isUnlocked ? '#FFFFFF' : c.surfaceBorder,
                      },
                    ]}
                  >
                    {/* Bevel Ring */}
                    <View
                      style={[
                        styles.bevelRing,
                        {
                          backgroundColor: badge.isUnlocked
                            ? visuals.secondaryColor
                            : c.surfaceHigh,
                          borderColor: badge.isUnlocked ? 'rgba(255, 255, 255, 0.4)' : c.surfaceBorder,
                        },
                      ]}
                    >
                      {/* Inner Canvas */}
                      <View
                        style={[
                          styles.innerCanvas,
                          {
                            backgroundColor: badge.isUnlocked
                              ? visuals.darkCanvasColor
                              : c.surfaceHigh,
                          },
                        ]}
                      >
                        {renderBadgeIcon()}
                      </View>
                    </View>
                  </View>

                  {/* Micro Sparkle Badge */}
                  {badge.isUnlocked && (
                    <View style={styles.sparklePin}>
                      <StarIcon size={12} color={visuals.secondaryColor} />
                    </View>
                  )}
                </View>

                {/* Title */}
                <AppText variant="headlineMd" color={c.textPrimary} style={styles.badgeTitle}>
                  {badge.title}
                </AppText>

                {/* Status Pill */}
                {badge.isUnlocked ? (
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor:
                          theme.scheme === 'dark'
                            ? 'rgba(22, 163, 74, 0.22)'
                            : '#DCFCE7',
                      },
                    ]}
                  >
                    <CheckIcon size={15} color="#16A34A" />
                    <AppText variant="labelMd" color="#16A34A" style={styles.boldText}>
                      Đã đạt
                    </AppText>
                  </View>
                ) : (
                  <View style={[styles.statusPill, { backgroundColor: c.surfaceHigh }]}>
                    <LockClosedIcon size={15} color={c.textSecondary} />
                    <AppText variant="labelMd" color={c.textSecondary} style={styles.boldText}>
                      Chưa đạt
                    </AppText>
                  </View>
                )}

                {/* Description */}
                <AppText variant="bodyMd" color={c.textSecondary} style={styles.descText}>
                  {badge.description}
                </AppText>

                {/* Info Grid (2 Cards) */}
                <View style={styles.infoGridRow}>
                  {/* Card 1: Điều kiện */}
                  <View style={[styles.infoCard, { backgroundColor: c.surfaceHigh }]}>
                    <View style={[styles.infoIconBox, { backgroundColor: c.brandSoftTint }]}>
                      <TargetIcon size={18} color={c.brandPrimary} />
                    </View>
                    <AppText variant="labelSm" color={c.textSecondary} style={styles.infoCardLabel}>
                      ĐIỀU KIỆN
                    </AppText>
                    <AppText
                      variant="labelMd"
                      color={c.textPrimary}
                      style={styles.boldText}
                      numberOfLines={1}
                    >
                      {visuals.condition}
                    </AppText>
                  </View>

                  {/* Card 2: Phần thưởng */}
                  <View
                    style={[
                      styles.infoCard,
                      {
                        backgroundColor: c.vipStreakBg,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.infoIconBox,
                        {
                          backgroundColor:
                            theme.scheme === 'dark'
                              ? 'rgba(217, 119, 6, 0.3)'
                              : 'rgba(166, 89, 0, 0.15)',
                        },
                      ]}
                    >
                      <StarIcon size={18} color={c.vipStreak} />
                    </View>
                    <AppText variant="labelSm" color={c.vipStreak} style={styles.infoCardLabel}>
                      PHẦN THƯỞNG
                    </AppText>
                    <AppText
                      variant="labelSm"
                      color={c.vipStreak}
                      style={{ fontWeight: '700' }}
                      numberOfLines={1}
                    >
                      +{badge.points || 20} đ
                    </AppText>
                  </View>
                </View>

                {/* Footer Info Text */}
                <View style={styles.footerNoteWrap}>
                  <AppText variant="bodySm" color={c.textSecondary}>
                    {badge.isUnlocked
                      ? `Đạt ngày ${badge.unlockedAt || '12/11/2026'}`
                      : 'Tiếp tục rèn luyện để mở khóa huy hiệu'}
                  </AppText>

                  <View style={[styles.permanentBadgePill, { backgroundColor: c.surfaceMuted }]}>
                    <BadgeCheckIcon size={14} color={c.brandPrimary} />
                    <AppText variant="labelSm" color={c.textPrimary} style={{ flexShrink: 1 }}>
                      Huy hiệu đã đạt sẽ được lưu giữ vĩnh viễn trên hồ sơ của bạn.
                    </AppText>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function createStyles(theme: ThemeContextValue) {
  const { colors: c } = theme;
  const isDark = theme.scheme === 'dark';

  return StyleSheet.create({
    overlayBackdrop: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(19, 18, 27, 0.45)',
      justifyContent: 'flex-end',
    },
    sheetContainer: {
      width: '100%',
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 36,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -6 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 16,
      position: 'relative',
    },
    dragHandle: {
      width: 44,
      height: 5,
      borderRadius: 3,
      alignSelf: 'center',
      marginBottom: 12,
    },
    closeBtn: {
      position: 'absolute',
      top: 14,
      right: 18,
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
    sheetContent: {
      alignItems: 'center',
      width: '100%',
    },
    medallionWrap: {
      width: 120,
      height: 120,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      marginVertical: 8,
    },
    ambientGlow: {
      position: 'absolute',
      width: 120,
      height: 120,
      borderRadius: 60,
      opacity: 0.8,
    },
    outerRing: {
      width: 108,
      height: 108,
      borderRadius: 54,
      borderWidth: 3,
      padding: 3,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#D97706',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 5,
    },
    bevelRing: {
      width: '100%',
      height: '100%',
      borderRadius: 50,
      borderWidth: 2,
      padding: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerCanvas: {
      width: '100%',
      height: '100%',
      borderRadius: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sparklePin: {
      position: 'absolute',
      top: 2,
      right: 4,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#FEF08A',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    badgeTitle: {
      fontWeight: '700',
      marginTop: 6,
      marginBottom: 6,
    },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 16,
      marginBottom: 12,
    },
    descText: {
      textAlign: 'center',
      lineHeight: 22,
      maxWidth: 300,
      marginBottom: 18,
    },
    infoGridRow: {
      flexDirection: 'row',
      width: '100%',
      gap: 12,
      marginBottom: 18,
    },
    infoCard: {
      flex: 1,
      padding: 14,
      borderRadius: 18,
      alignItems: 'flex-start',
      gap: 4,
    },
    infoIconBox: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    infoCardLabel: {
      fontSize: 10,
      letterSpacing: 0.5,
      fontWeight: '600',
    },
    footerNoteWrap: {
      alignItems: 'center',
      gap: 8,
      width: '100%',
      marginBottom: 20,
    },
    permanentBadgePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      width: '100%',
    },
    closeActionBtn: {
      width: '100%',
      paddingVertical: 14,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    boldText: {
      fontWeight: '700',
    },
  });
}
