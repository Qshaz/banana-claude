import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Category } from '../constants/categories';

interface CustomCategoriesStore {
  customCategories: Category[];
  addCategory: (cat: Category) => void;
  removeCategory: (slug: string) => void;
}

export const useCustomCategories = create<CustomCategoriesStore>()(
  persist(
    (set) => ({
      customCategories: [],
      addCategory: (cat) =>
        set((s) => ({ customCategories: [...s.customCategories, cat] })),
      removeCategory: (slug) =>
        set((s) => ({
          customCategories: s.customCategories.filter((c) => c.slug !== slug),
        })),
    }),
    {
      name: 'hikmah-custom-categories',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
