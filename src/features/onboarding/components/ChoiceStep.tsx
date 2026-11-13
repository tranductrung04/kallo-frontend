import React from 'react';
import { Image, Pressable, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { AppText } from '@/components/common';
import { useTheme } from '@/theme';

interface ChoiceStepProps {
  title: string;
  options: Array<[string, ImageSourcePropType, string]>;
  value: string;
  onChange: (value: string) => void;
}

export function ChoiceStep({ title, options, value, onChange }: ChoiceStepProps) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <AppText variant="heading">{title}</AppText>
      <View style={styles.choiceGrid}>
        {options.map(([key, image, label]) => {
          const isSelected = value === key;
          return (
            <Pressable
              key={key}
              onPress={() => onChange(key)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.choice,
                {
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  backgroundColor: isSelected ? theme.colors.primarySurface : theme.colors.surface,
                },
              ]}
            >
              <Image
                source={image}
                style={styles.choiceImage}
                resizeMode="contain"
                accessibilityLabel={label}
              />
              <AppText
                align="center"
                color={isSelected ? theme.colors.primaryPressed : theme.colors.text}
              >
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 14,
  },
  choiceGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  choice: {
    flex: 1,
    minWidth: 96,
    borderWidth: 1,
    borderColor: '#D8E5DD',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    gap: 8,
  },
  choiceImage: {
    width: 72,
    height: 72,
  },
});
