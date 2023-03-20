import logoUrl from '../assets/logo.svg';
import activeUrl from '../assets/active.svg';
import { CogIcon, UsersIcon, WindowIcon } from '@heroicons/react/24/outline';
import { ReactElement, ReactSVGElement, useState } from 'react';
import ActiveBar from '../assets/ActiveBar';
import NavbarItem from './NavbarItem';

//TODO: Add animation to active indicator

interface NavItem {
  title: string;
  icon: ReactElement;
  path: string;
}

const items: NavItem[] = [
  {
    title: 'Dashboard',
    icon: <WindowIcon className="h-8" />,
    path: '/dashboard',
  },
  {
    title: 'Usermanager',
    icon: <UsersIcon className="h-8" />,
    path: '/users',
  },
  {
    title: 'Configuration',
    icon: <CogIcon className="h-8" />,
    path: '/configuration',
  },
];

export default (/*{ activeIdx }: NavbarProps*/) => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="shadow-md h-screen py-8">
      <div className="flex w-full justify-center gap-2 items-center px-8">
        <img src={logoUrl} className="h-10" />
        <h2 className="font-heading text-2xl">QuetzalVPN</h2>
      </div>

      <div className="ml-8 mt-8">
        {items.map((item, idx) => (
          <NavbarItem
            title={item.title}
            icon={item.icon}
            path={item.path}
            active={idx === activeIdx}
            setActive={() => setActiveIdx(idx)}
            key={idx}
          />
        ))}
      </div>
    </div>
  );
};
