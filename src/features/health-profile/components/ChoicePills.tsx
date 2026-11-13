import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/common';
import { useTheme } from '@/theme';

interface ChoicePillsProps {
  options: Array<[string, string]>;
  value: string;
  values?: string[];
  multi?: boolean;
  onChange: (value: string) => void;
}

export function ChoicePills({ options, value, values, multi, onChange }: ChoicePillsProps) {
  const theme = useTheme();

  return (
    <View style={styles.pills}>
      {options.map(([key, label]) => {
        const selected = multi ? Boolean(values?.includes(key)) : value === key;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[
              styles.pill,
              {
                borderColor: selected ? theme.colors.primary : theme.colors.border,
                backgroundColor: selected ? theme.colors.primarySurface : theme.colors.surface,
              },
            ]}
          >
            <AppText color={selected ? theme.colors.primaryPressed : theme.colors.text}>
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  pills: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  pill: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
