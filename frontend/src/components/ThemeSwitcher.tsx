import { MoonIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Theme } from '../App';

interface ButtonProps {
  setTheme: (theme: Theme) => any;
}

export default ({ setTheme }: ButtonProps) => {
  const [open, setOpen] = useState(false);

  const options = [
    {
      label: 'Light',
      action: () => setTheme('light'),
    },
    {
      label: 'Dark',
      action: () => setTheme('dark'),
    },
    {
      label: 'System',
      action: () => setTheme('system'),
    },
  ];

  const toggleOpen = () => setOpen((prevOpen) => !prevOpen);

  return (
    <div className="inline-flex items-center relative">
      <button
        onClick={toggleOpen}
        className="stroke-gray-neutral hover:stroke-gray-700 dark:hover:stroke-gray-400 rounded-lg p-2"
      >
        <MoonIcon className="h-6 stroke-inherit" />
      </button>
      {open && (
        <ul className="bg-light-foreground dark:bg-dark-midground shadow-md rounded-lg py-1 absolute left-12">
          {options.map((opt) => (
            <li
              className="cursor-pointer p-2 hover:bg-gray-neutral/20"
              key={opt.label}
              onClick={() => {
                opt.action();
                toggleOpen();
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
