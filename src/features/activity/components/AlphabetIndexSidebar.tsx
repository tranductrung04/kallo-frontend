import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme';

export type AlphabetIndexSidebarProps = {
  alphabet: string[];
  selectedLetter: string;
  hasItemsMap: Record<string, boolean>;
  onSelectLetter: (letter: string) => void;
};

export function AlphabetIndexSidebar({
  alphabet,
  selectedLetter,
  hasItemsMap,
  onSelectLetter,
}: AlphabetIndexSidebarProps) {
  const { colors: c } = useTheme();

  return (
    <View style={styles.alphabetIndex}>
      {alphabet.map((letter) => {
        const hasItems = !!hasItemsMap[letter];
        const isSelected = selectedLetter === letter;
        return (
          <TouchableOpacity
            key={letter}
            onPress={() => hasItems && onSelectLetter(letter)}
            hitSlop={{ top: 2, bottom: 2, left: 6, right: 6 }}
            style={styles.alphabetLetterBtn}
            accessibilityRole="button"
            accessibilityLabel={`Chữ cái ${letter}`}
          >
            <Text
              style={[
                styles.alphabetLetterText,
                { color: c.textSecondary },
                isSelected && { color: c.brandSecondary, fontWeight: '800', fontSize: 12 },
                !hasItems && styles.alphabetLetterDisabled,
              ]}
            >
              {letter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  alphabetIndex: {
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 4,
    paddingVertical: 10,
  },
  alphabetLetterBtn: {
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alphabetLetterText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontWeight: '600',
  },
  alphabetLetterDisabled: {
    opacity: 0.4,
  },
});
