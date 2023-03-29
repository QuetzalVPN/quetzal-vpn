import {
  CogIcon,
  MoonIcon,
  UsersIcon,
  WindowIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { ReactElement, ReactSVGElement, useState } from 'react';
import NavbarItem from './NavbarItem';
import QuetzalTitle from './QuetzalTitle';
import AboutLink from './AboutLink';
import '../style/navbar.scss';
import collapseUrl from '../assets/collapse.svg';
import CollapseIcon from '../assets/CollapseIcon';

//TODO: make marker move with manual path change instead of onclick, probably call movement in page render
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
  {
    title: 'Administrastion',
    icon: <WrenchScrewdriverIcon className="h-7" />,
    path: '/administration',
  },
];

interface MarkerState {
  top: number;
  move: (pos: number) => void;
}

export default (/*{ activeIdx }: NavbarProps*/) => {
  const [collapsed, setCollapsed] = useState(false);

  const [activeIdx, setActiveIdx] = useState(0);

  const [markerTop, setMarkerTop] = useState(0);

  //TODO: animate navbar collapse
  return (
    <div className={`flex flex-col h-screen py-8  bg-foreground shadow-big`}>
      <QuetzalTitle
        className="w-full justify-center px-8"
        collapsed={collapsed}
      />

      <nav className="h-full flex flex-col justify-center">
        <div className="navbar-items ml-8 mt-8">
          <div id="navbar-marker" style={{ top: markerTop }} />
          {items.map((item, idx) => (
            <NavbarItem
              title={item.title}
              icon={item.icon}
              collapsed={collapsed}
              path={item.path}
              active={idx === activeIdx}
              setActive={() => setActiveIdx(idx)}
              moveMarker={(top: number) => setMarkerTop(top)}
              key={item.title + idx}
            />
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4 justify-center items-center">
          {/* TODO: implement darkmode */}
          <MoonIcon className="h-6 cursor-pointer" color="grey" />
          <CollapseIcon
            onClick={() => setCollapsed((prevCollapsed) => !prevCollapsed)}
            className={`h-8 cursor-pointer ${!collapsed && 'flipped'}`}
          />
          <AboutLink collapsed={collapsed} />
        </div>
      </nav>
    </div>
  );
};
