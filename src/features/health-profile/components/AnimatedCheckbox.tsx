import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface AnimatedCheckboxProps {
  selected: boolean;
  activeColor?: string;
  inactiveColor?: string;
  checkColor?: string;
  size?: number;
}

export function AnimatedCheckbox({
  selected,
  activeColor = '#9D6CFA',
  inactiveColor = '#3D3161',
  checkColor = '#FFFFFF',
  size = 24,
}: AnimatedCheckboxProps) {
  const checkScale = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    if (selected) {
      Animated.spring(checkScale, {
        toValue: 1,
        friction: 3.5,
        tension: 160,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(checkScale, {
        toValue: 0,
        duration: 130,
        useNativeDriver: true,
      }).start();
    }
  }, [selected, checkScale]);

  return (
    <View
      style={[
        styles.box,
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.28),
          borderColor: selected ? activeColor : inactiveColor,
          backgroundColor: selected ? activeColor : 'transparent',
        },
      ]}
    >
      <Animated.View style={{ transform: [{ scale: checkScale }] }}>
        <Svg
          width={Math.round(size * 0.65)}
          height={Math.round(size * 0.65)}
          viewBox="0 0 24 24"
          fill="none"
        >
          <Path
            d="M5 13l4 4L19 7"
            stroke={checkColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
