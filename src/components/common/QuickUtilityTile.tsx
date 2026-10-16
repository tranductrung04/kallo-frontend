// ─── QuickUtilityTile — Nocturne & Daylight Vitality ─────────────────────────
// DESIGN.md: "Quick Utility Tiles (Search, Barcode, AI Magic, Voice)"
//   4-column balanced grid dock, gutter 16px, rounded-lg (16px)
//   Each tile has theme-calibrated background, glyph icon
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme';
import { AppText } from './AppText';

export type QuickTileVariant = 'search' | 'barcode' | 'aiScan' | 'voice';

interface TileConfig {
  dark: { bg: string; glyph: string };
  light: { bg: string; border: string; glyph: string };
  label: string;
  icon: string;
}

const TILE_CONFIG: Record<QuickTileVariant, TileConfig> = {
  search: {
    dark: { bg: '#FBBF24', glyph: '#12111A' },
    light: { bg: '#FEF3C7', border: '#FDE68A', glyph: '#D97706' },
    label: 'Tìm kiếm',
    icon: '🔍',
  },
  barcode: {
    dark: { bg: '#38BDF8', glyph: '#12111A' },
    light: { bg: '#E0F2FE', border: '#BAE6FD', glyph: '#0284C7' },
    label: 'Mã vạch',
    icon: '▦',
  },
  aiScan: {
    dark: { bg: '#22C55E', glyph: '#12111A' },
    light: { bg: '#DCFCE7', border: '#BBF7D0', glyph: '#16A34A' },
    label: 'Quét AI',
    icon: '✦',
  },
  voice: {
    dark: { bg: '#FB7185', glyph: '#12111A' },
    light: { bg: '#FFE4E6', border: '#FECDD3', glyph: '#E11D48' },
    label: 'Giọng nói',
    icon: '🎙',
  },
};

export type QuickUtilityTileProps = {
  variant: QuickTileVariant;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  disabled?: boolean;
};

export function QuickUtilityTile({
  variant,
  onPress,
  style,
  testID,
  disabled,
}: QuickUtilityTileProps) {
  const theme = useTheme();
  const config = TILE_CONFIG[variant];
  const isDark = theme.scheme === 'dark';

  const bg = isDark ? config.dark.bg : config.light.bg;
  const glyphColor = isDark ? config.dark.glyph : config.light.glyph;
  const borderColor = isDark ? 'transparent' : config.light.border;
  const borderWidth = isDark ? 0 : 1;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={config.label}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: bg, borderColor, borderWidth },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <AppText style={[styles.icon, { color: glyphColor }]}>{config.icon}</AppText>
      <AppText variant="labelSm" color={glyphColor} align="center">{config.label}</AppText>
    </Pressable>
  );
}

/** 4-column grid of all 4 quick utility tiles */
export function QuickUtilityGrid({
  onSearch,
  onBarcode,
  onAIScan,
  onVoice,
  style,
}: {
  onSearch?: () => void;
  onBarcode?: () => void;
  onAIScan?: () => void;
  onVoice?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.grid, style]}>
      <QuickUtilityTile variant="search" onPress={onSearch ?? (() => undefined)} style={styles.gridItem} />
      <QuickUtilityTile variant="barcode" onPress={onBarcode ?? (() => undefined)} style={styles.gridItem} />
      <QuickUtilityTile variant="aiScan" onPress={onAIScan ?? (() => undefined)} style={styles.gridItem} />
      <QuickUtilityTile variant="voice" onPress={onVoice ?? (() => undefined)} style={styles.gridItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16, // rounded-lg per DESIGN.md
    minHeight: 70,
    paddingVertical: 10,
    paddingHorizontal: 6,
    gap: 6,
  },
  icon: {
    fontSize: 24,
    lineHeight: 28,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  disabled: { opacity: 0.5 },
  grid: {
    flexDirection: 'row',
    gap: 16, // gutter per DESIGN.md
  },
  gridItem: {
    flex: 1,
  },
});
