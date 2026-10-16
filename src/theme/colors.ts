// ─── Nocturne & Daylight Vitality — Semantic Token System ───────────────────
// DESIGN.md: "Palette is engineered around adaptive depth layers"
// 3-layer depth: canvas-base → surface-mid → surface-high
// ─────────────────────────────────────────────────────────────────────────────

export const colors = {
  light: {
    // Canvas & Surfaces (Daylight Vitality)
    canvasBase: '#F8F7FC',
    surfaceMid: '#FFFFFF',
    surfaceHigh: '#F1EFF9',
    surfaceBorder: '#E4E0F0',

    // Brand Accents
    brandPrimary: '#6C56F5',
    brandSecondary: '#8B5CF6',
    brandSoftTint: '#EBE7FF',

    // Metabolic & Macro Semantic
    macroProtein: '#EF4444',
    macroProteinStrong: '#DC2626',
    macroCarbs: '#2563EB',
    macroFats: '#D97706',
    macroFatsStrong: '#EAB308',

    // Utility
    quickScanner: '#16A34A',
    vipStreak: '#D97706',

    // Text & Foreground
    textPrimary: '#13121B',
    textSecondary: '#645F77',
    textDisabled: '#A6A1B8',

    // Semantic States
    error: '#ba1a1a',
    onError: '#ffffff',
    onPrimary: '#FFFFFF',
    onBrandPrimary: '#FFFFFF',

    // ── Backward-compat aliases (Phase 3: will be removed) ──────────────────
    background: '#F8F7FC',
    surface: '#FFFFFF',
    surfaceMuted: '#F1EFF9',
    text: '#13121B',
    textMuted: '#645F77',
    border: '#E4E0F0',
    primary: '#6C56F5',
    primaryPressed: '#5d48ca',
    primarySurface: '#EBE7FF',
    calorieIn: '#EF4444',
    calorieBurned: '#D97706',
    protein: '#EF4444',
    carbs: '#2563EB',
    fat: '#D97706',
    water: '#0284C7',
    streak: '#D97706',
    warning: '#D97706',
    danger: '#ba1a1a',
  },

  dark: {
    // Canvas & Surfaces (Nocturne Vitality)
    canvasBase: '#0D0B14',
    surfaceMid: '#181524',
    surfaceHigh: '#221D34',
    surfaceBorder: '#322B48',

    // Brand Accents
    brandPrimary: '#9E64F7',
    brandSecondary: '#B488FC',
    brandSoftTint: 'rgba(158, 100, 247, 0.15)',

    // Metabolic & Macro Semantic
    macroProtein: '#FF6B6B',
    macroProteinStrong: '#FF5252',
    macroCarbs: '#3B82F6',
    macroFats: '#FBBF24',
    macroFatsStrong: '#EAB308',

    // Utility
    quickScanner: '#22C55E',
    vipStreak: '#F59E0B',

    // Text & Foreground
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.72)',
    textDisabled: 'rgba(255, 255, 255, 0.26)',

    // Semantic States
    error: '#ffb4ab',
    onError: '#690005',
    onPrimary: '#FFFFFF',
    onBrandPrimary: '#FFFFFF',

    // ── Backward-compat aliases (Phase 3: will be removed) ──────────────────
    background: '#0D0B14',
    surface: '#181524',
    surfaceMuted: '#221D34',
    text: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.72)',
    border: '#322B48',
    primary: '#9E64F7',
    primaryPressed: '#8A4FE2',
    primarySurface: 'rgba(158, 100, 247, 0.15)',
    calorieIn: '#FF6B6B',
    calorieBurned: '#F59E0B',
    protein: '#FF6B6B',
    carbs: '#3B82F6',
    fat: '#FBBF24',
    water: '#38BDF8',
    streak: '#F59E0B',
    warning: '#FBBF24',
    danger: '#ffb4ab',
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type ColorTokens = (typeof colors)[ColorScheme];
