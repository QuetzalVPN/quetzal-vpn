import { useEffect } from 'react';
import { create } from 'zustand';

type Theme = 'system' | 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  switchTo: (to: Theme) => void;
}

const useThemeState = create<ThemeState>((set, get) => ({
  theme: (localStorage.getItem('theme') as Theme) ?? 'system',
  switchTo: (newTheme) => set((state) => ({ theme: newTheme })),
}));

const useTheme = () => {
  const updateStoredTheme = (newTheme: Theme) => {
    if (newTheme === 'system') {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', newTheme);
    }

    if (
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  };

  const [theme, setTheme] = useThemeState((state) => [
    state.theme,
    state.switchTo,
  ]);

  const [themeName, setThemeName] = useThemeState((state) => [
    state.theme,
    state.switchTo,
  ]);

  useEffect(() => {
    updateStoredTheme(theme);
    setThemeName(theme);
  }, [theme]);

  return {
    setTheme,
    theme,
    themeName,
  };
};

export { useTheme };
