import {useEffect, useState} from 'react';
import {create} from 'zustand';

type Theme = 'system' | 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  switchTo: (to: Theme) => void;
}

const useThemeState = create<ThemeState>((set, get) => ({
  theme: (localStorage.getItem('theme') as Theme) ?? 'system',
  switchTo: (newTheme) => set((state) => ({theme: newTheme})),
}));

const useTheme = () => {
  const [isSystemTheme, setIsSysTheme] = useState(false);

  const updateStoredTheme = (newTheme: Theme) => {
    if (newTheme === 'system') {
      setIsSysTheme(true);
      localStorage.removeItem('theme');
    } else {
      setIsSysTheme(false);
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

  useEffect(() => {
    updateStoredTheme(theme);
    console.log('theme', theme);
  }, [theme]);

  return {
    setTheme,
    theme,
    isSystemTheme,
  };
};

export {useTheme};
