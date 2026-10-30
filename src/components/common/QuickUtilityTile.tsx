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
import {
  QuickSearchIcon,
  QuickBarcodeIcon,
  QuickSparklesIcon,
  QuickVoiceIcon,
} from '@/components/icons';
import { AppText } from './AppText';

export type QuickTileVariant = 'search' | 'barcode' | 'aiScan' | 'voice';

export interface TileConfig {
  dark: { bg: string; glyph: string };
  light: { bg: string; border: string; glyph: string };
  label: string;
}

export const TILE_CONFIG: Record<QuickTileVariant, TileConfig> = {
  search: {
    dark: { bg: '#FBBF24', glyph: '#12111A' },
    light: { bg: '#FEF3C7', border: '#FDE68A', glyph: '#D97706' },
    label: 'Tìm kiếm',
  },
  barcode: {
    dark: { bg: '#38BDF8', glyph: '#12111A' },
    light: { bg: '#E0F2FE', border: '#BAE6FD', glyph: '#0284C7' },
    label: 'Mã vạch',
  },
  aiScan: {
    dark: { bg: '#22C55E', glyph: '#12111A' },
    light: { bg: '#DCFCE7', border: '#BBF7D0', glyph: '#16A34A' },
    label: 'Quét AI',
  },
  voice: {
    dark: { bg: '#FB7185', glyph: '#12111A' },
    light: { bg: '#FFE4E6', border: '#FECDD3', glyph: '#E11D48' },
    label: 'Giọng nói',
  },
};

export type QuickUtilityTileProps = {
  variant: QuickTileVariant;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  disabled?: boolean;
  showLabel?: boolean;
};

export function QuickUtilityTile({
  variant,
  onPress,
  style,
  testID,
  disabled,
  showLabel = false,
}: QuickUtilityTileProps) {
  const theme = useTheme();
  const config = TILE_CONFIG[variant];
  const isDark = theme.scheme === 'dark';

  const bg = isDark ? config.dark.bg : config.light.bg;
  const glyphColor = isDark ? theme.colors.onQuickTile : config.light.glyph;
  const borderColor = isDark ? 'transparent' : config.light.border;
  const borderWidth = isDark ? 0 : 1;

  const renderIcon = () => {
    switch (variant) {
      case 'search':
        return <QuickSearchIcon size={26} color={glyphColor} />;
      case 'barcode':
        return <QuickBarcodeIcon size={26} color={glyphColor} />;
      case 'aiScan':
        return <QuickSparklesIcon size={28} color={glyphColor} />;
      case 'voice':
        return <QuickVoiceIcon size={26} color={glyphColor} cutoutColor={bg} />;
      default:
        return null;
    }
  };

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={config.label}
      style={({ pressed }) => [
        styles.tile,
        showLabel ? styles.tileWithLabel : styles.tileCompact,
        { backgroundColor: bg, borderColor, borderWidth },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {renderIcon()}
      {showLabel && (
        <AppText variant="labelSm" color={glyphColor} align="center">
          {config.label}
        </AppText>
      )}
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
  tileStyle,
  showLabel = false,
}: {
  onSearch?: () => void;
  onBarcode?: () => void;
  onAIScan?: () => void;
  onVoice?: () => void;
  style?: StyleProp<ViewStyle>;
  tileStyle?: StyleProp<ViewStyle>;
  showLabel?: boolean;
}) {
  return (
    <View style={[styles.grid, style]}>
      <QuickUtilityTile variant="search" onPress={onSearch ?? (() => undefined)} showLabel={showLabel} style={[styles.gridItem, tileStyle]} />
      <QuickUtilityTile variant="barcode" onPress={onBarcode ?? (() => undefined)} showLabel={showLabel} style={[styles.gridItem, tileStyle]} />
      <QuickUtilityTile variant="aiScan" onPress={onAIScan ?? (() => undefined)} showLabel={showLabel} style={[styles.gridItem, tileStyle]} />
      <QuickUtilityTile variant="voice" onPress={onVoice ?? (() => undefined)} showLabel={showLabel} style={[styles.gridItem, tileStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16, // rounded-lg per DESIGN.md
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 4,
  },
  tileCompact: {
    height: 52,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  tileWithLabel: {
    minHeight: 70,
    paddingVertical: 10,
    paddingHorizontal: 6,
    gap: 6,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  disabled: {
    opacity: 0.5,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  gridItem: {
    flex: 1,
  },
});
