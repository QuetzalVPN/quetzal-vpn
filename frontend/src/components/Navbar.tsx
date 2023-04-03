import { ReactElement, ReactSVGElement, useEffect, useState } from 'react';
import NavbarItem from './NavbarItem';
import QuetzalTitle from './QuetzalTitle';
import AboutLink from './AboutLink';
import '../style/navbar.scss';
import CollapseIcon from '../assets/CollapseIcon';
import { Theme } from '../App';
import ThemeSwitcher from './ThemeSwitcher';
import { useCurrentPage } from '../hooks/zustand';

//TODO: make marker move with manual path change instead of onclick, probably call movement in page render
interface NavItem {
  title: string;
  icon: ReactElement;
  path: string;
}

interface NavbarProps {
  items: NavItem[];
  // activeIdx: number;
  setTheme: (theme: Theme) => any;
}

export default ({ items, /*activeIdx,*/ setTheme }: NavbarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [markerTop, setMarkerTop] = useState(0);

  const currentPage = useCurrentPage((state) => state.currentPage);

  //TODO: animate navbar collapse
  return (
    <div
      className={`flex flex-col h-screen py-8  bg-light-foreground dark:bg-dark-foreground shadow-big`}
    >
      <QuetzalTitle
        className="w-full justify-center px-8"
        collapsed={collapsed}
      />

      <nav className="h-full flex flex-col justify-center">
        <div className="navbar-items ml-8 mt-8 ">
          <div
            id="navbar-marker"
            style={{ top: markerTop }}
            className="bg-brand-green"
          />
          {items.map((item, idx) => (
            <NavbarItem
              title={item.title}
              icon={item.icon}
              collapsed={collapsed}
              path={item.path}
              active={idx === currentPage}
              // setActive={() => setActiveIdx(idx)}
              moveMarker={(top: number) => setMarkerTop(top)}
              key={item.title + idx}
            />
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4 justify-center items-center">
          {/* TODO: implement darkmode */}
          <ThemeSwitcher setTheme={setTheme} />
          <CollapseIcon
            onClick={() => setCollapsed((prevCollapsed) => !prevCollapsed)}
            className={`h-8 cursor-pointer stroke-gray-neutral hover:stroke-gray-700 dark:hover:stroke-gray-400  ${
              !collapsed && 'flipped'
            }`}
          />
          <AboutLink collapsed={collapsed} />
        </div>
      </nav>
    </div>
  );
};
