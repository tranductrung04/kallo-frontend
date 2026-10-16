// ─── Nocturne & Daylight Vitality — Spacing & Radii ─────────────────────────
// DESIGN.md: "Mobile viewport ergonomics with native safe-area compliance"
// ─────────────────────────────────────────────────────────────────────────────

export const spacing = {
  xs: 4,    // 0.25rem (space-xs)
  sm: 8,    // 0.5rem  (space-sm)
  md: 16,   // 1rem    (space-md / gutter between sibling card tiles)
  lg: 20,   // 1.25rem (space-lg / horizontal screen padding)
  xl: 28,   // 1.75rem (space-xl)
  xxl: 48,  // kept for backward compat
  gutter: 16,  // separation between multi-column card tiles
  margin: 20,  // horizontal screen padding on phones
} as const;

export const radii = {
  sm: 4,      // 0.25rem
  DEFAULT: 8, // 0.5rem
  md: 12,     // 0.75rem
  lg: 16,     // 1rem  — standard cards, modals, meal containers
  xl: 24,     // 1.5rem — buttons, chips, date-selector pills
  full: 9999, // pill — primary CTAs, progress trackers, floating FAB
  // Backward-compat aliases
  pill: 9999,
} as const;
