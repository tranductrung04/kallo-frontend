import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

export function AuthLightBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          {/* Main vertical daylight vitality gradient */}
          <LinearGradient id="daylightLinearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#EDE9FA" stopOpacity={1} />
            <Stop offset="25%" stopColor="#F4F0FD" stopOpacity={1} />
            <Stop offset="65%" stopColor="#FAF8FE" stopOpacity={1} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={1} />
          </LinearGradient>

          {/* Top-right ambient glowing violet orb */}
          <RadialGradient id="ambientOrbTopRight" cx="80%" cy="10%" r="60%">
            <Stop offset="0%" stopColor="#B488FC" stopOpacity={0.22} />
            <Stop offset="45%" stopColor="#EDE5FF" stopOpacity={0.12} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>

          {/* Center-left soft ambient orb */}
          <RadialGradient id="ambientOrbLeft" cx="15%" cy="32%" r="50%">
            <Stop offset="0%" stopColor="#C4A1FD" stopOpacity={0.15} />
            <Stop offset="50%" stopColor="#EDE5FF" stopOpacity={0.06} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>

          {/* Bottom subtle ambient glow */}
          <RadialGradient id="ambientOrbBottom" cx="70%" cy="88%" r="55%">
            <Stop offset="0%" stopColor="#D8C2FC" stopOpacity={0.14} />
            <Stop offset="60%" stopColor="#FAF8FE" stopOpacity={0.05} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {/* Base Gradient Layer */}
        <Rect width="100%" height="100%" fill="url(#daylightLinearGrad)" />

        {/* Ambient Light Orbs for depth & vitality */}
        <Rect width="100%" height="100%" fill="url(#ambientOrbTopRight)" />
        <Rect width="100%" height="100%" fill="url(#ambientOrbLeft)" />
        <Rect width="100%" height="100%" fill="url(#ambientOrbBottom)" />
      </Svg>
    </View>
  );
}
