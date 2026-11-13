import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface AnimatedRadioProps {
  selected: boolean;
  activeColor?: string;
  inactiveColor?: string;
  size?: number;
}

export function AnimatedRadio({
  selected,
  activeColor = '#A78BFA',
  inactiveColor = '#473B6B',
  size = 24,
}: AnimatedRadioProps) {
  const dotScale = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    if (selected) {
      Animated.spring(dotScale, {
        toValue: 1,
        friction: 3.5,
        tension: 160,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(dotScale, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }).start();
    }
  }, [selected, dotScale]);

  const dotSize = Math.round(size * 0.5);

  return (
    <View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: selected ? activeColor : inactiveColor,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: activeColor,
            transform: [{ scale: dotScale }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {},
});
