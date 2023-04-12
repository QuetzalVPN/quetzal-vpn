import { create } from 'zustand';

type Theme = 'system' | 'light' | 'dark';

interface CurrentPageState {
  currentPage: number;
  move: (to: number) => void;
}

interface ThemeState {
  theme: Theme;
  switchTo: (to: Theme) => void;
}

const useCurrentPage = create<CurrentPageState>((set) => ({
  currentPage: 0,
  move: (to) => set((state) => ({ currentPage: to })),
}));

const useThemeState = create<ThemeState>((set, get) => ({
  theme: localStorage.theme ?? 'system',
  switchTo: (newTheme) => set((state) => ({ theme: newTheme })),
}));

export { useCurrentPage, useThemeState };
export type { Theme };
