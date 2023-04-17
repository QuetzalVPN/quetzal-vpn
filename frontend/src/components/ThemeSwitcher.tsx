import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Theme } from '../App';
import { useTheme } from '../hooks/useTheme';
import NavButton from './NavButton';

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

  const toggleOpen = () => setOpen((prevOpen) => !prevOpen);

  return (
    <div className="relative">
      <NavButton>
        <div className="h-6" onClick={toggleOpen}>
          {theme === 'light' ? (
            <MoonIcon className="stroke-inherit h-full" />
          ) : (
            <SunIcon className="stroke-inherit h-full" />
          )}
        </div>
      </NavButton>
      {open && (
        <ul className="bg-light-foreground dark:bg-dark-midground shadow-md rounded-lg absolute top-0 left-12 py-1">
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
