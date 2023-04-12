import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Theme } from '../App';
import { useTheme } from '../hooks/useTheme';

export default () => {
  const [open, setOpen] = useState(false);

  //FIXME: Icon always shows sun for system theme
  const { theme, themeName, setTheme } = useTheme();

  const options = [
    {
      icon: <SunIcon className="h-full" />,
      label: 'Light',
      action: () => setTheme('light'),
      active: themeName === 'light',
    },
    {
      icon: <MoonIcon className="h-full" />,
      label: 'Dark',
      action: () => setTheme('dark'),
      active: themeName === 'dark',
    },
    {
      icon: <ComputerDesktopIcon className="h-full" />,
      label: 'System',
      action: () => setTheme('system'),
      active: themeName === 'system',
    },
  ];

  // useEffect(() => {
  //   console.log('themeName', themeName);
  // }, [themeName]);
  // useEffect(() => {
  //   console.log('theme', theme);
  // }, [theme]);

  const toggleOpen = () => setOpen((prevOpen) => !prevOpen);

  return (
    <div className="inline-flex items-center relative">
      <button
        onClick={toggleOpen}
        className="stroke-gray-neutral hover:stroke-gray-700 dark:hover:stroke-gray-400 rounded-lg p-2"
      >
        <div className="h-6">
          {theme === 'light' ? (
            <MoonIcon className="stroke-inherit h-full" />
          ) : (
            <SunIcon className="stroke-inherit h-full" />
          )}
        </div>
      </button>
      {open && (
        <ul className="bg-light-foreground dark:bg-dark-midground shadow-md rounded-lg absolute left-12 py-1">
          {options.map((opt) => (
            <li key={opt.label}>
              <button
                className={`p-2 hover:bg-gray-neutral/20 w-full flex items-center gap-2 ${
                  opt.active &&
                  'border-2 border-brand-green dark:text-brand-green rounded-md'
                }`}
                onClick={() => {
                  opt.action();
                  toggleOpen();
                }}
              >
                <div className="h-4">{opt.icon}</div>
                <span>{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
