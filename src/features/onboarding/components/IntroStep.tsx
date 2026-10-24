import React from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { AppText } from '@/components/common';
import { useTheme } from '@/theme';

interface IntroStepProps {
  image: ImageSourcePropType;
  title: string;
  text: string;
}

export function IntroStep({ image, title, text }: IntroStepProps) {
  const theme = useTheme();

  return (
    <View style={styles.intro}>
      <Image
        source={image}
        style={styles.stepImage}
        resizeMode="contain"
        accessibilityLabel={title}
      />
      <AppText variant="title" align="center">
        {title}
      </AppText>
      <AppText align="center" color={theme.colors.textMuted}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  stepImage: {
    width: '100%',
    height: 180,
  },
});
