import {ArrowLeftOnRectangleIcon, ChevronDoubleLeftIcon} from '@heroicons/react/24/outline';
import {ReactElement, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useCurrentPage} from '../hooks/zustand';
import '../style/navbar.scss';
import AboutLink from './AboutLink';
import NavButton from './NavButton';
import NavbarItem from './NavbarItem';
import QuetzalTitle from './QuetzalTitle';
import ThemeSwitcher from './ThemeSwitcher';
import useLogout from "../hooks/useLogout";

interface NavItem {
  title: string;
  icon: ReactElement;
  path: string;
}

interface NavbarProps {
  items: NavItem[];
}

export default ({items}: NavbarProps) => {
  const navigate = useNavigate();

  const logout = useLogout();

  const [collapsed, setCollapsed] = useState<boolean>(
    (localStorage.getItem('navbarCollapsed') ?? 'false') === 'true'
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
        <div className="navbar-items ml-8 mt-8 relative flex flex-col gap-2">
          <div
            id="navbar-marker"
            style={{top: markerTop}}
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

        <div className="mt-auto flex flex-col gap-2 justify-center items-center h-fit">
          <NavButton onClick={() => {
            logout();
            navigate('/login');
          }}>
            <ArrowLeftOnRectangleIcon className="h-6 stroke-inherit"/>
          </NavButton>
          <ThemeSwitcher/>
          <NavButton
            onClick={() => setCollapsed((prevCollapsed) => !prevCollapsed)}
          >
            <ChevronDoubleLeftIcon
              className={`h-6 transition-transform stroke-inherit ${
                collapsed ? 'flipped' : ''
              }`}
            />
          </NavButton>
          <AboutLink collapsed={collapsed}/>
        </div>
      </nav>
    </div>
  );
};
