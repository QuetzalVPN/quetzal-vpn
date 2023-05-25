import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/24/outline";
import {ReactElement, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCurrentPage} from "../hooks/zustand";
import "../style/navbar.scss";
import AboutLink from "./AboutLink";
import NavButton from "./NavButton";
import NavbarItem from "./NavbarItem";
import QuetzalTitle from "./QuetzalTitle";
import ThemeSwitcher from "./ThemeSwitcher";
import {Menu, Transition} from "@headlessui/react";

// import useLogout from "../hooks/useLogout";

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

  const [collapsed, setCollapsed] = useState<boolean>(
    (localStorage.getItem("navbarCollapsed") ?? "false") === "true"
  );

  const handleCollapse = () => {
    setCollapsed(prev => !prev);
  }

  const [extras] = useState([
    {
      title: "Logout",
      component: <ArrowLeftOnRectangleIcon className="h-6 stroke-inherit"/>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      }
    },
    {
      title: "Theme",
      component: <ThemeSwitcher/>,
    },
    {
      title: "About",
      component: <AboutLink collapsed={true}/>,
    },
  ]);

  const [markerOffset, setMarkerOffset] = useState<{ top?: number, left?: number }>({top: 0, left: 0});

  const currentPage = useCurrentPage((state) => state.currentPage);

  return (
    <div
      className={`fixed sm:static bottom-0 flex sm:flex-col sm:h-screen py-3.5 sm:py-6 bg-light-foreground dark:bg-dark-foreground shadow-md w-full sm:w-fit sm:min-w-fit`}
    >
      <QuetzalTitle
        className="hidden sm:flex w-full justify-center sm:px-8"
        collapsed={collapsed}
      />

      <nav
        className={`relative sm:mt-8 flex flex-row justify-evenly w-full sm:flex-col gap-8 ${collapsed ? "sm:items-center" : "sm:pl-8 sm:items-start"}`}>
        <div
          id="navbar-marker"
          style={markerOffset}
          className="bg-brand-green bottom-0 sm:right-0 w-[42px] h-[6px] sm:h-10 sm:w-[6px] fixed sm:absolute rounded-t-sm sm:rounded-l-sm transition-all duration-200"
        />
        {items.map((item, idx) => (
          <NavbarItem
            title={item.title}
            icon={item.icon}
            collapsed={collapsed}
            path={item.path.split(":")[0]}
            active={idx === currentPage}
            moveMarker={(offset: typeof markerOffset) => setMarkerOffset(offset)}
            key={item.title + idx}
          />
        ))}
        <Menu as={'div'} className='sm:hidden relative inline-block'>
          <Menu.Button as={NavButton}>
            <Bars3Icon className='h-6 stroke-inherit'/>
          </Menu.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Menu.Items
              className="absolute bottom-10 -left-2 bg-light-foreground dark:bg-dark-midground flex flex-col items-center rounded-lg pt-2">
              {extras.map((extra, idx) => (
                <Menu.Item>
                  {({active}) => (
                    <NavButton onClick={extra.onClick} className={`block ${active ? 'bg-gray-neutral/20' : ''}`}>
                      {extra.component}
                    </NavButton>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </nav>
      <div className="hidden mt-auto sm:flex flex-col gap-2 justify-end items-center">
        {extras.map((extra, idx) => (
          <NavButton onClick={extra.onClick}>
            {extra.component}
          </NavButton>
        ))}
        {/*<NavButton onClick={() => {*/}
        {/*  // logout();*/}
        {/*  navigate("/login");*/}
        {/*}}>*/}
        {/*  <ArrowLeftOnRectangleIcon className="h-6 stroke-inherit"/>*/}
        {/*</NavButton>*/}
        {/*<ThemeSwitcher/>*/}
        <NavButton
          onClick={() => setCollapsed((prevCollapsed) => !prevCollapsed)}
        >
          <ChevronDoubleLeftIcon
            className={`collapse-btn h-6 stroke-inherit transition-transform ${
              collapsed ? "flipped" : ""
            }`}
          />
        </NavButton>
        {/*<AboutLink collapsed={collapsed}/>*/}
      </div>
    </div>
  );
};
