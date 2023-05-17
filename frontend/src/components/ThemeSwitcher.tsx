import {ComputerDesktopIcon, MoonIcon, SunIcon,} from '@heroicons/react/24/outline';
import {useState} from 'react';
import {useTheme} from '../hooks/useTheme';
import NavButton from './NavButton';

export default () => {
  const [open, setOpen] = useState(false);

  const {theme, isSystemTheme, setTheme} = useTheme();

  const options = [
    {
      icon: <SunIcon className="h-full"/>,
      label: 'Light',
      action: () => setTheme('light'),
      active: !isSystemTheme && theme === 'light',
    },
    {
      icon: <MoonIcon className="h-full"/>,
      label: 'Dark',
      action: () => setTheme('dark'),
      active: !isSystemTheme && theme === 'dark',
    },
    {
      icon: <ComputerDesktopIcon className="h-full"/>,
      label: 'System',
      action: () => setTheme('system'),
      active: isSystemTheme,
    },
  ];

  const toggleOpen = () => setOpen((prevOpen) => !prevOpen);

  return (
    <div className="relative">
      <NavButton onClick={toggleOpen}>
        <div className="h-6">
          {theme === 'light' ? (
            <SunIcon className="stroke-inherit h-full"/>
          ) : (
            <MoonIcon className="stroke-inherit h-full"/>
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
