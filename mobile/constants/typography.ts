import { Platform } from 'react-native';

// Loaded via @expo-google-fonts packages in _layout.tsx
export const Fonts = {
  HEADING_SEMIBOLD: 'PlayfairDisplay_600SemiBold',
  HEADING_MEDIUM: 'PlayfairDisplay_500Medium',
  // Avenir Next is an iOS system font — no package needed
  BODY: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'System',
  BODY_MEDIUM: Platform.OS === 'ios' ? 'AvenirNext-Medium' : 'System',
  BODY_DEMIBOLD: Platform.OS === 'ios' ? 'AvenirNext-DemiBold' : 'System',
  ARABIC: 'NotoNaskhArabic_400Regular',
} as const;

export const Typography = {
  appTitle:  { fontFamily: Fonts.HEADING_SEMIBOLD, fontSize: 44, lineHeight: 52 },
  h1:        { fontFamily: Fonts.HEADING_SEMIBOLD, fontSize: 32, lineHeight: 40 },
  h2:        { fontFamily: Fonts.HEADING_MEDIUM,   fontSize: 24, lineHeight: 32 },
  h3:        { fontFamily: Fonts.HEADING_MEDIUM,   fontSize: 20, lineHeight: 28 },
  bodyLarge: { fontFamily: Fonts.BODY,             fontSize: 18, lineHeight: 30 },
  body:      { fontFamily: Fonts.BODY,             fontSize: 16, lineHeight: 28 },
  secondary: { fontFamily: Fonts.BODY,             fontSize: 14, lineHeight: 22 },
  caption:   { fontFamily: Fonts.BODY,             fontSize: 12, lineHeight: 18 },
  button:    { fontFamily: Fonts.BODY_MEDIUM,      fontSize: 16, lineHeight: 20 },
  arabicVerse: {
    fontFamily: Fonts.ARABIC,
    fontSize: 28,
    lineHeight: 52,
    textAlign: 'right' as const,
  },
  arabicLabel: {
    fontFamily: Fonts.ARABIC,
    fontSize: 14,
    lineHeight: 22,
  },
} as const;

// Spacing (8pt grid)
export const Spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

// Border radii
export const Radii = {
  card: 24,
  button: 20,
  pill: 999,
  verseCard: 28,
  badge: 12,
} as const;
