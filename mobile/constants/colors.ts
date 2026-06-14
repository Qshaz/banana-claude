export const LightColors = {
  // ── Backgrounds ──────────────────────────────────────────────
  BACKGROUND: '#F8F4EE',           // Cream Paper
  BACKGROUND_SECONDARY: '#F1EBE1', // Soft Parchment
  SURFACE: '#FCFAF7',              // Warm Ivory
  SURFACE_ELEVATED: '#F6F1E8',     // Linen

  // ── Text ─────────────────────────────────────────────────────
  TEXT: '#2C2722',
  TEXT_SECONDARY: '#72685B',
  TEXT_MUTED: '#9A9084',
  TEXT_ARABIC: '#3B342D',

  // ── Dividers / Borders ───────────────────────────────────────
  BORDER: '#E5DDD2',
  DIVIDER: '#E7DED2',

  // ── Brand ────────────────────────────────────────────────────
  PRIMARY: '#6C7354',              // Olive Sage
  PRIMARY_LIGHT: '#8A9470',        // Dusty Moss
  PRIMARY_ULTRA_LIGHT: '#EEF0E8',
  ACCENT: '#B59A63',               // Antique Brass
  ACCENT_LIGHT: '#F5EFDF',

  // ── Status ───────────────────────────────────────────────────
  SUCCESS: '#6F8A5A',
  WARNING: '#C19A5B',
  ERROR: '#B36A5E',

  // ── Utility ──────────────────────────────────────────────────
  OVERLAY: 'rgba(44, 39, 34, 0.5)',
  SHADOW: 'rgba(44, 39, 34, 0.08)',

  // ── Journal badge backgrounds ─────────────────────────────────
  BADGE_PRIVATE: '#F3EFE8',
  BADGE_COMMUNITY: '#E8F0E2',
} as const;

export const DarkColors = {
  // ── Backgrounds ──────────────────────────────────────────────
  BACKGROUND: '#1A1D13',           // Deep Olive Night
  BACKGROUND_SECONDARY: '#20241A', // Dark Moss
  SURFACE: '#242818',              // Dark Surface
  SURFACE_ELEVATED: '#2C3020',     // Elevated Dark

  // ── Text ─────────────────────────────────────────────────────
  TEXT: '#F2EDE6',                 // Warm Cream
  TEXT_SECONDARY: '#B8B0A6',
  TEXT_MUTED: '#7D7669',
  TEXT_ARABIC: '#EDE5DC',

  // ── Dividers / Borders ───────────────────────────────────────
  BORDER: '#323626',
  DIVIDER: '#2B2F1E',

  // ── Brand ────────────────────────────────────────────────────
  PRIMARY: '#8A9470',              // Lighter moss for dark bg
  PRIMARY_LIGHT: '#A8B08C',
  PRIMARY_ULTRA_LIGHT: '#252A1A',
  ACCENT: '#C9A96E',               // Slightly lighter brass
  ACCENT_LIGHT: '#2A2214',

  // ── Status ───────────────────────────────────────────────────
  SUCCESS: '#7BA668',
  WARNING: '#C9A96E',
  ERROR: '#C47A72',

  // ── Utility ──────────────────────────────────────────────────
  OVERLAY: 'rgba(0, 0, 0, 0.65)',
  SHADOW: 'rgba(0, 0, 0, 0.4)',

  // ── Journal badge backgrounds ─────────────────────────────────
  BADGE_PRIVATE: '#252A1A',
  BADGE_COMMUNITY: '#1A2414',
} as const;

export type AppColors = typeof LightColors;
export type ColorKey = keyof AppColors;

// Kept for any legacy imports that haven't been migrated yet
export const Colors = LightColors;
