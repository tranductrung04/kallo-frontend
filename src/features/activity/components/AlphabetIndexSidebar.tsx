import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
                isSelected && styles.alphabetLetterActive,
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
    color: '#6E6983',
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontWeight: '600',
  },
  alphabetLetterActive: {
    color: '#B488FC',
    fontWeight: '800',
    fontSize: 12,
  },
  alphabetLetterDisabled: {
    opacity: 0.5,
  },
});
