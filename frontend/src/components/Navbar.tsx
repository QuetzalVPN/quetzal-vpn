import { ReactElement, ReactSVGElement, useEffect, useState } from 'react';
import NavbarItem from './NavbarItem';
import QuetzalTitle from './QuetzalTitle';
import AboutLink from './AboutLink';
import '../style/navbar.scss';
import CollapseIcon from '../assets/CollapseIcon';
import { Theme } from '../App';
import ThemeSwitcher from './ThemeSwitcher';
import { useCurrentPage } from '../hooks/zustand';

interface NavItem {
  title: string;
  icon: ReactElement;
  path: string;
}

interface NavbarProps {
  items: NavItem[];
  // activeIdx: number;
}

export default ({ items /*activeIdx,*/ }: NavbarProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(
    localStorage.navbarCollapsed
  );
  const [markerTop, setMarkerTop] = useState(0);

  const currentPage = useCurrentPage((state) => state.currentPage);

  useEffect(() => {
    if (collapsed) {
      localStorage.setItem('navbarCollapsed', 'true');
    } else {
      localStorage.removeItem('navbarCollapsed');
    }
  }, [collapsed]);

  //TODO: animate navbar collapse
  return (
    <div
      className={`flex flex-col h-screen py-8 bg-light-foreground dark:bg-dark-foreground shadow-md`}
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
          <ThemeSwitcher />
          <button
            onClick={() => setCollapsed((prevCollapsed) => !prevCollapsed)}
            className="aspect-square p-2 rounded-md"
          >
            <CollapseIcon
              className={`h-8 cursor-pointer stroke-gray-neutral hover:stroke-gray-700 dark:hover:stroke-gray-400  ${
                !collapsed && 'flipped'
              }`}
            />
          </button>
          <AboutLink collapsed={collapsed} />
        </div>
      </nav>
    </div>
  );
};
