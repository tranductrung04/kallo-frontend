import React from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { AppText } from '@/components/common';
import { useTheme } from '@/theme';

interface IntroStepProps {
  image?: ImageSourcePropType;
  title: string;
  text: string;
  renderIllustration?: () => React.ReactNode;
}

export function IntroStep({
  image,
  title,
  text,
  renderIllustration,
}: IntroStepProps) {
  const theme = useTheme();

  return (
    <View style={styles.intro}>
      {renderIllustration ? (
        <View style={styles.customIllustrationContainer}>
          {renderIllustration()}
        </View>
      ) : image ? (
        <Image
          source={image}
          style={styles.stepImage}
          resizeMode="contain"
          accessibilityLabel={title}
        />
      ) : null}
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
  customIllustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
});
