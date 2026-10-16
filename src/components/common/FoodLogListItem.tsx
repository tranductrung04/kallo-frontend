// ─── FoodLogListItem — Nocturne & Daylight Vitality ──────────────────────────
// DESIGN.md: "Food Log List Items"
//   48x48px rounded food thumbnail (rounded-md)
//   Dish name: headlineSm + textPrimary
//   Portion: bodySm + textSecondary
//   Calories right: labelLg
//   Container: surfaceHigh (dark) / nested #F8F7FC or #FFFFFF (light)
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme';
import { AppText } from './AppText';

export type FoodLogListItemProps = {
  name: string;
  portion: string;        // e.g. "250 g"
  calories: number;       // display as integer
  thumbnail?: ImageSourcePropType;
  onPress?: () => void;
  onDelete?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function FoodLogListItem({
  name,
  portion,
  calories,
  thumbnail,
  onPress,
  onDelete,
  style,
  testID,
}: FoodLogListItemProps) {
  const theme = useTheme();

  const containerBg = theme.scheme === 'dark'
    ? theme.colors.surfaceHigh
    : theme.colors.surfaceHigh; // F1EFF9 in light

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${portion}, ${calories} kcal`}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: containerBg,
          borderColor: theme.colors.surfaceBorder,
        },
        pressed && onPress && styles.pressed,
        style,
      ]}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailWrapper}>
        {thumbnail ? (
          <Image
            source={thumbnail}
            style={styles.thumbnail}
            resizeMode="cover"
            accessibilityLabel={`Ảnh ${name}`}
          />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailPlaceholder, { backgroundColor: theme.colors.surfaceBorder }]}>
            <AppText variant="labelMd" color={theme.colors.textSecondary} align="center">🍽</AppText>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <AppText variant="headlineSm" color={theme.colors.textPrimary} numberOfLines={1}>
          {name}
        </AppText>
        <AppText variant="bodySm" color={theme.colors.textSecondary}>
          {portion}
        </AppText>
      </View>

      {/* Calories + optional delete */}
      <View style={styles.right}>
        <AppText variant="labelLg" color={theme.colors.textPrimary}>
          {Math.round(calories)} kcal
        </AppText>
        {onDelete && (
          <Pressable
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel={`Xóa ${name}`}
            style={styles.deleteBtn}
          >
            <AppText variant="bodySm" color={theme.colors.error}>Xóa</AppText>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 12, // rounded-md per DESIGN.md
    borderWidth: 1,
  },
  thumbnailWrapper: {
    borderRadius: 12, // rounded-md
    overflow: 'hidden',
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  thumbnailPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
  deleteBtn: {
    minWidth: 44,
    minHeight: 28,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85 },
});
