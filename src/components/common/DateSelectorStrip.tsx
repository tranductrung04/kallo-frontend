// ─── DateSelectorStrip — Nocturne & Daylight Vitality ────────────────────────
// DESIGN.md: "Date Selector Strip"
//   Horizontal scrollable row: T2 → CN
//   Default: transparent BG, textSecondary
//   Selected: brandPrimary pill, white text + glow (dark) / shadow (light)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme';
import { AppText } from './AppText';

export type DateSelectorItem = {
  key: string;       // date key e.g. "2026-10-16"
  dayLabel: string;  // e.g. "T5"
  dateLabel: string; // e.g. "16"
};

export type DateSelectorStripProps = {
  dates: DateSelectorItem[];
  selectedKey: string;
  onChange: (key: string) => void;
  testID?: string;
};

export function DateSelectorStrip({
  dates,
  selectedKey,
  onChange,
  testID,
}: DateSelectorStripProps) {
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const scrollRef = useRef<ScrollView>(null);

  // Auto-scroll to selected item
  useEffect(() => {
    const idx = dates.findIndex((d) => d.key === selectedKey);
    if (idx > 0 && scrollRef.current) {
      scrollRef.current.scrollTo({ x: idx * 68, animated: true });
    }
  }, [selectedKey, dates]);

  return (
    <ScrollView
      ref={scrollRef}
      testID={testID}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      accessibilityLabel="Chọn ngày"
    >
      {dates.map((item) => {
        const selected = item.key === selectedKey;

        const containerStyle = selected
          ? [
              styles.day,
              styles.daySelected,
              { backgroundColor: theme.colors.brandAction },
              // Glow for dark / shadow for light per DESIGN.md L328
              isDark
                ? {
                    shadowColor: theme.colors.glow,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 10,
                    elevation: 6,
                  }
                : {
                    shadowColor: 'rgba(123, 79, 224, 0.25)',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 1,
                    shadowRadius: 12,
                    elevation: 5,
                  },
            ]
          : [styles.day, { backgroundColor: 'transparent' }];

        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            accessibilityRole="button"
            accessibilityLabel={`Chọn ${item.dayLabel} ngày ${item.dateLabel}`}
            accessibilityState={{ selected }}
            style={({ pressed }) => [
              ...containerStyle,
              pressed && styles.pressed,
            ]}
          >
            <AppText
              variant="labelSm"
              color={selected ? '#FFFFFF' : theme.colors.textSecondary}
            >
              {item.dayLabel}
            </AppText>
            <AppText
              variant="labelMd"
              color={selected ? '#FFFFFF' : theme.colors.textPrimary}
            >
              {item.dateLabel}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/** Helper: generate 7-day strip centered on today (or given date) */
export function buildWeekDates(centerDate: string): DateSelectorItem[] {
  const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const base = new Date(centerDate);
  // Start from Monday of current week
  const dayOfWeek = base.getDay();
  const monday = new Date(base);
  monday.setDate(base.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = d.toISOString().split('T')[0]!;
    return {
      key,
      dayLabel: DAY_LABELS[d.getDay()] ?? '',
      dateLabel: String(d.getDate()),
    };
  });
}

const styles = StyleSheet.create({
  content: {
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  day: {
    width: 52,
    minHeight: 60,
    borderRadius: 9999, // pill geometry per DESIGN.md
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 8,
  },
  daySelected: {
    // brandPrimary background applied inline
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.96 }] },
});

// Separate container for the day label row visual
export function _DateDotIndicator({ active }: { active: boolean }) {
  const theme = useTheme();
  return (
    <View
      style={{
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: active ? theme.colors.brandPrimary : 'transparent',
        marginTop: 2,
      }}
    />
  );
}
