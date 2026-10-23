import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface AnimatedCardProps {
  selected?: boolean;
  onPress: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  selectedBorderColor?: string;
  selectedBgColor?: string;
  unselectedBorderColor?: string;
  unselectedBgColor?: string;
  activeScale?: number;
  accessibilityLabel?: string;
  accessibilityRole?: any;
}

export function AnimatedCard({
  selected = false,
  onPress,
  children,
  style,
  selectedBorderColor = '#A78BFA',
  selectedBgColor = '#241945',
  unselectedBorderColor = '#2E2254',
  unselectedBgColor = '#1A1433',
  activeScale = 0.965,
  accessibilityLabel,
  accessibilityRole = 'button',
}: AnimatedCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const selectPulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse when selected becomes true
  useEffect(() => {
    if (selected) {
      Animated.sequence([
        Animated.timing(selectPulseAnim, {
          toValue: 1.025,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.spring(selectPulseAnim, {
          toValue: 1,
          friction: 4,
          tension: 140,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selected, selectPulseAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: activeScale,
      friction: 5,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 140,
      useNativeDriver: true,
    }).start();
  };

  const dynamicStyle: ViewStyle = {
    borderColor: selected ? selectedBorderColor : unselectedBorderColor,
    backgroundColor: selected ? selectedBgColor : unselectedBgColor,
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View
        style={[
          styles.card,
          dynamicStyle,
          style,
          {
            transform: [
              { scale: Animated.multiply(scaleAnim, selectPulseAnim) },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
});
