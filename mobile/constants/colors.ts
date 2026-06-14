export const Colors = {
  // ── Backgrounds ──────────────────────────────────────────────
  BACKGROUND: '#F8F4EE',          // Cream Paper
  BACKGROUND_SECONDARY: '#F1EBE1', // Soft Parchment
  SURFACE: '#FCFAF7',             // Warm Ivory
  SURFACE_ELEVATED: '#F6F1E8',    // Linen

  // ── Text ─────────────────────────────────────────────────────
  TEXT: '#2C2722',                // Primary Text
  TEXT_SECONDARY: '#72685B',      // Secondary Text
  TEXT_MUTED: '#9A9084',          // Muted Text
  TEXT_ARABIC: '#3B342D',         // Arabic verse text

  // ── Dividers / Borders ───────────────────────────────────────
  BORDER: '#E5DDD2',
  DIVIDER: '#E7DED2',

  // ── Brand ────────────────────────────────────────────────────
  PRIMARY: '#6C7354',             // Olive Sage
  PRIMARY_LIGHT: '#8A9470',       // Dusty Moss
  PRIMARY_ULTRA_LIGHT: '#EEF0E8', // Derived light tint
  ACCENT: '#B59A63',              // Antique Brass
  ACCENT_LIGHT: '#F5EFDF',        // Derived brass tint

  // ── Status ───────────────────────────────────────────────────
  SUCCESS: '#6F8A5A',
  WARNING: '#C19A5B',
  ERROR: '#B36A5E',

  // ── Utility ──────────────────────────────────────────────────
  OVERLAY: 'rgba(44, 39, 34, 0.5)',
  SHADOW: 'rgba(44, 39, 34, 0.05)',

  // ── Journal badge backgrounds ─────────────────────────────────
  BADGE_PRIVATE: '#F3EFE8',
  BADGE_COMMUNITY: '#E8F0E2',
} as const;

export type ColorKey = keyof typeof Colors;
