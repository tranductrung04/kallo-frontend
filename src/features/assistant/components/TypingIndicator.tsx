import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface TypingIndicatorProps {
  color?: string;
  size?: number;
}

export function TypingIndicator({ color = '#6366F1', size = 7 }: TypingIndicatorProps) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createDotAnimation = (anim: Animated.Value, delay: number) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 320,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 320,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.delay(280),
          ])
        ),
      ]);
    };

    const anim1 = createDotAnimation(dot1, 0);
    const anim2 = createDotAnimation(dot2, 160);
    const anim3 = createDotAnimation(dot3, 320);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, [dot1, dot2, dot3]);

  const renderDot = (anim: Animated.Value, key: string) => {
    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -5],
    });
    const opacity = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.35, 1],
    });
    const scale = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.85, 1.15],
    });

    return (
      <Animated.View
        key={key}
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            opacity,
            transform: [{ translateY }, { scale }],
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel="Đang soạn tin nhắn">
      {renderDot(dot1, 'dot1')}
      {renderDot(dot2, 'dot2')}
      {renderDot(dot3, 'dot3')}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 2,
    minHeight: 20,
  },
  dot: {},
});
