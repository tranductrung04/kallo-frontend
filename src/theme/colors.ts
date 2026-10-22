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
    brandPrimary: '#7B4FE0',
    brandAction: '#7B4FE0',
    brandSecondary: '#9163EA',
    brandSoftTint: '#EDE5FF',

    // Metabolic & Macro Semantic
    macroProtein: '#EF4444',
    macroProteinStrong: '#DC2626',
    macroCarbs: '#2563EB',
    macroCarbsStrong: '#1D4ED8',
    macroFats: '#D97706',
    macroFatsStrong: '#EAB308',
    macroSalt: '#CA8A04',
    macroSugar: '#0284C7',
    macroFiber: '#16A34A',
    macroFiberSoft: '#86EFAC',
    macroFiberStrong: '#15803D',

    // Utility & Tracking
    quickScanner: '#16A34A',
    vipStreak: '#D97706',
    trackerWater: '#0891B2',
    trackerBurn: '#DC2626',
    trackerWeight: '#D97706',

    // Premium / Upgrade CTA
    upgradeAccent: '#FACC15',
    onUpgradeAccent: '#261C02',

    // Status Signals
    statusWarning: '#C2410C',
    statusDanger: '#D92D20',

    // Progress & Layering
    progressTrack: '#ECE9F6',
    tabBar: 'rgba(255, 255, 255, 0.92)',
    overlay: 'rgba(19, 18, 27, 0.45)',
    glow: 'rgba(123, 79, 224, 0.24)',
    glowStrong: 'rgba(123, 79, 224, 0.35)',

    // Text & Foreground
    onBrand: '#FFFFFF',
    onQuickTile: '#13121B',
    textPrimary: '#13121B',
    textSecondary: '#645F77',
    textDisabled: '#A6A1B8',

    // Semantic States (aligned with status)
    error: '#D92D20',
    onError: '#FFFFFF',
    onPrimary: '#FFFFFF',
    onBrandPrimary: '#FFFFFF',

    // ── Backward-compat aliases (Phase 3: will be removed) ──────────────────
    background: '#F8F7FC',
    surface: '#FFFFFF',
    surfaceMuted: '#F1EFF9',
    text: '#13121B',
    textMuted: '#645F77',
    border: '#E4E0F0',
    primary: '#7B4FE0',
    primaryPressed: '#6A42C8',
    primarySurface: '#EDE5FF',
    calorieIn: '#EF4444',
    calorieBurned: '#D97706',
    protein: '#EF4444',
    carbs: '#2563EB',
    fat: '#D97706',
    salt: '#CA8A04',
    sugar: '#0284C7',
    fiber: '#16A34A',
    water: '#0891B2',
    streak: '#D97706',
    warning: '#C2410C',
    danger: '#D92D20',
  },

  dark: {
    // Canvas & Surfaces (Nocturne Vitality)
    canvasBase: '#0D0B14',
    surfaceMid: '#181524',
    surfaceHigh: '#221D34',
    surfaceBorder: '#322B48',

    // Brand Accents
    brandPrimary: '#9E64F7',
    brandAction: '#8B57E8',
    brandSecondary: '#B488FC',
    brandSoftTint: 'rgba(158, 100, 247, 0.15)',

    // Metabolic & Macro Semantic
    macroProtein: '#FF6B6B',
    macroProteinStrong: '#FF5252',
    macroCarbs: '#3B82F6',
    macroCarbsStrong: '#1D4ED8',
    macroFats: '#FBBF24',
    macroFatsStrong: '#EAB308',
    macroSalt: '#FDE68A',
    macroSugar: '#38BDF8',
    macroFiber: '#4ADE80',
    macroFiberSoft: '#86EFAC',
    macroFiberStrong: '#15803D',

    // Utility & Tracking
    quickScanner: '#22C55E',
    vipStreak: '#F59E0B',
    trackerWater: '#22D3EE',
    trackerBurn: '#F87171',
    trackerWeight: '#FBBF24',

    // Premium / Upgrade CTA
    upgradeAccent: '#FDE047',
    onUpgradeAccent: '#261C02',

    // Status Signals
    statusWarning: '#FB923C',
    statusDanger: '#FF5A5F',

    // Progress & Layering
    progressTrack: '#221D34',
    tabBar: 'rgba(20, 17, 30, 0.90)',
    overlay: 'rgba(13, 11, 20, 0.75)',
    glow: 'rgba(158, 100, 247, 0.28)',
    glowStrong: 'rgba(158, 100, 247, 0.40)',

    // Text & Foreground (Solid colors per DESIGN.md L195)
    onBrand: '#FFFFFF',
    onQuickTile: '#0D0B14',
    textPrimary: '#FFFFFF',
    textSecondary: '#9E9AA7',
    textDisabled: '#5E5970',

    // Semantic States (aligned with status)
    error: '#FF5A5F',
    onError: '#FFFFFF',
    onPrimary: '#FFFFFF',
    onBrandPrimary: '#FFFFFF',

    // ── Backward-compat aliases (Phase 3: will be removed) ──────────────────
    background: '#0D0B14',
    surface: '#181524',
    surfaceMuted: '#221D34',
    text: '#FFFFFF',
    textMuted: '#9E9AA7',
    border: '#322B48',
    primary: '#9E64F7',
    primaryPressed: '#7A4AD8',
    primarySurface: 'rgba(158, 100, 247, 0.15)',
    calorieIn: '#FF6B6B',
    calorieBurned: '#F59E0B',
    protein: '#FF6B6B',
    carbs: '#3B82F6',
    fat: '#FBBF24',
    salt: '#FDE68A',
    sugar: '#38BDF8',
    fiber: '#4ADE80',
    water: '#22D3EE',
    streak: '#F59E0B',
    warning: '#FB923C',
    danger: '#FF5A5F',
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type ColorTokens = (typeof colors)[ColorScheme];
