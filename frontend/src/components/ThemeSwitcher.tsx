import {ComputerDesktopIcon, MoonIcon, SunIcon,} from '@heroicons/react/24/outline';
import {useState} from 'react';
import {useTheme} from '../hooks/useTheme';
import NavButton from './NavButton';
import {Menu, Transition} from "@headlessui/react";

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
    <Menu as={'div'} className='relative inline-block'>
      <Menu.Button as={NavButton}>
        <div className="h-6">
          {theme === 'light' ? (
            <SunIcon className="stroke-inherit h-full"/>
          ) : (
            <MoonIcon className="stroke-inherit h-full"/>
          )}
        </div>
      </Menu.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
      <Menu.Items className='absolute z-50 right-14 -bottom-8 sm:left-12 sm:-top-12 rounded-lg bg-light-midground dark:bg-dark-midground overflow-hidden'>
        {options.map((opt) =>
          <Menu.Item key={opt.label}>
            {({active}) => (
              <button
                className={`p-2 ${active ? 'bg-gray-neutral/20' : ''} w-full flex items-center gap-2 ${
                  opt.active && 'border-2 border-brand-green dark:text-brand-green rounded-md'
                }`}
                onClick={opt.action}
              >
                <div className="h-4">{opt.icon}</div>
                <span>{opt.label}</span>
              </button>
            )}
          </Menu.Item>)}
      </Menu.Items>
        </Transition>
    </Menu>
    // <div className="relative">
    //   <NavButton onClick={toggleOpen}>
    //     <div className="h-6">
    //       {theme === 'light' ? (
    //         <SunIcon className="stroke-inherit h-full"/>
    //       ) : (
    //         <MoonIcon className="stroke-inherit h-full"/>
    //       )}
    //     </div>
    //   </NavButton>
    //   {open && (
    //     <ul className="bg-light-foreground dark:bg-dark-midground shadow-md rounded-lg absolute top-0 left-12 py-1">
    //       {options.map((opt) => (
    //         <li key={opt.label}>
    //           <button
    //             className={`p-2 hover:bg-gray-neutral/20 w-full flex items-center gap-2 ${
    //               opt.active &&
    //               'border-2 border-brand-green dark:text-brand-green rounded-md'
    //             }`}
    //             onClick={() => {
    //               opt.action();
    //               toggleOpen();
    //             }}
    //           >
    //             <div className="h-4">{opt.icon}</div>
    //             <span>{opt.label}</span>
    //           </button>
    //         </li>
    //       ))}
    //     </ul>
    //   )}
    // </div>
  );
};
