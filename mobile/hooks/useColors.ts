import { LightColors, DarkColors, type AppColors } from '../constants/colors';
import { useThemeStore } from '../stores/theme';

export function useColors(): AppColors {
  const isDark = useThemeStore((s) => s.isDark);
  return isDark ? DarkColors : LightColors;
}
