// ─── Nocturne & Daylight Vitality — Elevation & Shadow System ───────────────
// DESIGN.md: "Dark Mode: progressive surface luminance + ambient colored glows
//             Light Mode: crisp white surface layering + soft tinted shadows"
// ─────────────────────────────────────────────────────────────────────────────

import type { ViewStyle } from 'react-native';

export const shadows = {
  dark: {
    // Level 1: Outer meal category groups, calorie summary wrapper
    // On dark: border conveys depth, not shadow
    level1: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    } satisfies ViewStyle,

    // Level 2: Floating cards, dialog drawers, nested list rows
    level2: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 5,
    } satisfies ViewStyle,

    // Radiant Glow: Active indicators — calorie ring, date pills, macro rings
    radiantGlow: {
      shadowColor: 'rgba(158, 100, 247, 0.28)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 8,
    } satisfies ViewStyle,

    // Accent Shadow: Active indicators on dark
    accentShadow: {
      shadowColor: 'rgba(158, 100, 247, 0.28)',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 8,
    } satisfies ViewStyle,

    // Primary CTA Button (on Dark: no shadow, uses surface luminescence)
    primaryButton: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    } satisfies ViewStyle,

    // Floating Button Glow: FAB (+) button per DESIGN.md L302
    floatingButtonGlow: {
      shadowColor: 'rgba(158, 100, 247, 0.40)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 10,
    } satisfies ViewStyle,

    // Bottom Bar (on Dark: border conveys depth)
    bottomBar: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    } satisfies ViewStyle,
  },

  light: {
    // Level 1: Primary meal cards, calorie summary — subtle ambient shadow
    level1: {
      shadowColor: 'rgba(19, 18, 27, 0.04)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 3,
    } satisfies ViewStyle,

    // Level 2: Floating popovers, toasts, elevated nested wells per DESIGN.md L272
    level2: {
      shadowColor: 'rgba(123, 79, 224, 0.08)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 6,
    } satisfies ViewStyle,

    // Radiant Glow: Active indicators on light per DESIGN.md L58
    radiantGlow: {
      shadowColor: 'rgba(123, 79, 224, 0.24)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 8,
    } satisfies ViewStyle,

    // Accent Shadow: Selected date pill, primary CTAs per DESIGN.md L274
    accentShadow: {
      shadowColor: 'rgba(123, 79, 224, 0.24)',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 8,
    } satisfies ViewStyle,

    // Primary CTA Shadow per DESIGN.md L295
    primaryButton: {
      shadowColor: 'rgba(123, 79, 224, 0.25)',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 6,
    } satisfies ViewStyle,

    // Floating Button Shadow: FAB (+) button per DESIGN.md L302
    floatingButtonGlow: {
      shadowColor: 'rgba(123, 79, 224, 0.35)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 10,
    } satisfies ViewStyle,

    // Bottom Bar: Subtle upward shadow per DESIGN.md L275
    bottomBar: {
      shadowColor: 'rgba(19, 18, 27, 0.04)',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 4,
    } satisfies ViewStyle,
  },

  // Backward-compat alias (Phase 3: will be removed)
  card: {
    shadowColor: 'rgba(19, 18, 27, 0.04)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 3,
  } satisfies ViewStyle,
} as const;
