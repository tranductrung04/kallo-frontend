// ─── Nocturne & Daylight Vitality — Typography Scale ────────────────────────
// Font: Plus Jakarta Sans (loaded via @expo-google-fonts/plus-jakarta-sans)
// DESIGN.md: "exceptional clarity on high-DPI smartphone displays,
//             crisp Vietnamese diacritical legibility"
// ─────────────────────────────────────────────────────────────────────────────

import type { TextStyle } from 'react-native';

const fontFamily = {
  regular: 'PlusJakartaSans_400Regular',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const typography = {
  // ── Metric Big Numbers (Calorie dials, Dashboard headers) ─────────────────
  dataDisplay: {
    fontFamily: fontFamily.extraBold,
    fontSize: 44,
    lineHeight: 48,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  } satisfies TextStyle,

  // ── Screen Titles (Onboarding, Goal summaries) ────────────────────────────
  headlineXl: {
    fontFamily: fontFamily.extraBold,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '800',
  } satisfies TextStyle,

  headlineXlMobile: {
    fontFamily: fontFamily.extraBold,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '800',
  } satisfies TextStyle,

  // ── Modal & Report Headers ─────────────────────────────────────────────────
  headlineLg: {
    fontFamily: fontFamily.bold,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700',
  } satisfies TextStyle,

  // ── Section Headers (Dashboard summaries) ─────────────────────────────────
  headlineMd: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
  } satisfies TextStyle,

  headlineSm: {
    fontFamily: fontFamily.semiBold,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
  } satisfies TextStyle,

  // ── Body & Captions ────────────────────────────────────────────────────────
  bodyLg: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } satisfies TextStyle,

  bodyMd: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  } satisfies TextStyle,

  bodySm: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  } satisfies TextStyle,

  // ── Labels & Micro-data (buttons, chips, tab bar) ─────────────────────────
  labelLg: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  } satisfies TextStyle,

  labelMd: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  } satisfies TextStyle,

  labelSm: {
    fontFamily: fontFamily.semiBold,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.4,
  } satisfies TextStyle,

  // ── Backward-compat aliases (Phase 3: will be removed) ───────────────────
  display: {
    fontFamily: fontFamily.extraBold,
    fontSize: 44,
    lineHeight: 48,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  } satisfies TextStyle,
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700',
  } satisfies TextStyle,
  heading: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
  } satisfies TextStyle,
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } satisfies TextStyle,
  bodyMedium: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  } satisfies TextStyle,
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  } satisfies TextStyle,
  label: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  } satisfies TextStyle,
} as const;

export type TypographyVariant = keyof typeof typography;
