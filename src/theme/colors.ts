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
    canvasBase: '#12111A',
    surfaceMid: '#1C1929',
    surfaceHigh: '#252238',
    surfaceBorder: '#34304E',

    // Brand Accents
    brandPrimary: '#8E7CFF',
    brandSecondary: '#A78BFA',
    brandSoftTint: 'rgba(142, 124, 255, 0.15)',

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
    textSecondary: '#9E9AA7',
    textDisabled: '#5E5970',

    // Semantic States
    error: '#ffb4ab',
    onError: '#690005',
    onPrimary: '#FFFFFF',
    onBrandPrimary: '#FFFFFF',

    // ── Backward-compat aliases (Phase 3: will be removed) ──────────────────
    background: '#12111A',
    surface: '#1C1929',
    surfaceMuted: '#252238',
    text: '#FFFFFF',
    textMuted: '#9E9AA7',
    border: '#34304E',
    primary: '#8E7CFF',
    primaryPressed: '#c8bfff',
    primarySurface: 'rgba(142, 124, 255, 0.15)',
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
