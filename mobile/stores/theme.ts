import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
  setDark: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,
      toggle: () => set((s) => ({ isDark: !s.isDark })),
      setDark: (dark) => set({ isDark: dark }),
    }),
    {
      name: 'hikmah-theme',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
