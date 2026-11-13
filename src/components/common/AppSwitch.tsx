import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme';

export interface AppSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
  activeTrackColor?: string;
  inactiveTrackColor?: string;
  thumbColor?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  trackColor?: { false?: string; true?: string };
  size?: 'default' | 'small';
}

const DIMENSIONS = {
  default: {
    width: 52,
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 3,
    thumbSize: 24,
    thumbRadius: 12,
    travel: 22,
  },
  small: {
    width: 44,
    height: 26,
    borderRadius: 13,
    paddingHorizontal: 2.5,
    thumbSize: 21,
    thumbRadius: 10.5,
    travel: 18,
  },
};

export function AppSwitch({
  value,
  onValueChange,
  disabled = false,
  activeTrackColor,
  inactiveTrackColor,
  thumbColor = '#FFFFFF',
  accessibilityLabel,
  style,
  trackColor,
  size = 'default',
}: AppSwitchProps) {
  const theme = useTheme();
  const c = theme.colors;
  const isDark = theme.scheme === 'dark';

  const resolvedActive =
    activeTrackColor ?? trackColor?.true ?? (c.brandPrimary || '#8A5AEB');
  const resolvedInactive =
    inactiveTrackColor ??
    trackColor?.false ??
    (isDark ? 'rgba(255, 255, 255, 0.18)' : (c.surfaceBorder || '#E2E8F0'));

  const dim = DIMENSIONS[size];

  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, dim.travel],
  });

  const trackBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [resolvedInactive, resolvedActive],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      style={[disabled && styles.disabled, style]}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width: dim.width,
            height: dim.height,
            borderRadius: dim.borderRadius,
            paddingHorizontal: dim.paddingHorizontal,
            backgroundColor: trackBg,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: dim.thumbSize,
              height: dim.thumbSize,
              borderRadius: dim.thumbRadius,
              backgroundColor: thumbColor,
              transform: [{ translateX }],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

export const ToggleSwitch = AppSwitch;

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
  thumb: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2.5,
    elevation: 3,
  },
  disabled: {
    opacity: 0.5,
  },
});
