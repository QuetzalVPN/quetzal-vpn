import { CogIcon, UsersIcon, WindowIcon } from '@heroicons/react/24/outline';
import { ReactElement, ReactSVGElement, useState } from 'react';
import NavbarItem from './NavbarItem';
import QuetzalTitle from './QuetzalTitle';
import '../style/navbar.scss';

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

  const [markerTop, setMarkerTop] = useState(0);

  return (
    <div className="shadow-idk h-screen py-8">
      <QuetzalTitle className="w-full justify-center px-8" />

      <nav className="ml-8 mt-8">
        <div id="navbar-marker" style={{ top: markerTop }} />
        {items.map((item, idx) => (
          <NavbarItem
            title={item.title}
            icon={item.icon}
            path={item.path}
            active={idx === activeIdx}
            setActive={() => setActiveIdx(idx)}
            moveMarker={(top: number) => setMarkerTop(top)}
            key={idx}
          />
        ))}
      </nav>
    </div>
  );
};
