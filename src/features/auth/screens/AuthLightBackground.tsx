import React from 'react';
import { StyleSheet, View } from 'react-native';

export function AuthLightBackground() {
  return (
    <View
      style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFFFF' }]}
      pointerEvents="none"
    />
  );
}
