import { useEffect } from 'react';
import { Theme, useThemeState } from './zustand';

const useTheme = () => {
  const updateStoredTheme = (newTheme: Theme) => {
    if (newTheme === 'system') {
      localStorage.removeItem('theme');
    } else {
      localStorage.theme = newTheme;
    }

    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
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
