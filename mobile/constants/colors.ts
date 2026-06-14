export const Colors = {
  PRIMARY: '#1C5D52',
  PRIMARY_LIGHT: '#2A7A6E',
  ACCENT: '#C9982D',
  BACKGROUND: '#FAF8F4',
  SURFACE: '#FFFFFF',
  TEXT: '#1A1A1A',
  TEXT_MUTED: '#6B7280',
  BORDER: '#E5E0D8',
  SUCCESS: '#4A8C70',
  ERROR: '#C0392B',

  // Additional utility colors
  ACCENT_LIGHT: '#F5EDD5',
  PRIMARY_ULTRA_LIGHT: '#EAF2F0',
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
  SHADOW: 'rgba(28, 93, 82, 0.12)',
} as const;

export type ColorKey = keyof typeof Colors;
