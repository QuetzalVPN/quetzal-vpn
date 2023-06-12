import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  ChevronDoubleLeftIcon, MoonIcon, SunIcon
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
import {useSmallerThan} from "../hooks/useBreakpoints";
import {useTheme} from "../hooks/useTheme";

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

  const smallScreen = useSmallerThan("sm");

  const {theme} = useTheme();

  const [collapsed, setCollapsed] = useState<boolean>(
    (localStorage.getItem("navbarCollapsed") ?? "false") === "true"
  );

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCollapse = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
    localStorage.setItem("navbarCollapsed", (!collapsed).toString());
  }

  const [markerOffset, setMarkerOffset] = useState<{ top?: number, left?: number }>({top: 0, left: 0});
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const currentPage = useCurrentPage((state) => state.currentPage);

  return (
    <div
      className={`
      z-[50]
        fixed sm:static flex bottom-0 sm:flex-col sm:h-screen w-full sm:w-fit sm:min-w-fit
        border-t sm:border-t-0 sm:border-r border-gray-neutral/30 md:border-0 py-3.5 sm:py-6
        -sm:bg-gradient-to-t from-20% from-light-foreground dark:from-dark-background dark:bg-dark-background/40 backdrop-blur-sm
        sm:bg-light-foreground sm:dark:bg-dark-foreground sm:backdrop-blur-none shadow-md
        `}
    >
      <QuetzalTitle
        className="hidden sm:flex w-full justify-center sm:px-8"
        collapsed={collapsed}
      />

      <nav
        className={`relative px-4 sm:mt-8 flex flex-row justify-evenly w-full sm:flex-col gap-8 ${collapsed ? "items-center" : "sm:pl-8 items-center sm:items-start"}`}>
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
      </nav>
      {smallScreen ||
          <div className="mt-auto flex flex-col gap-2 justify-end items-center">
              <NavButton onClick={handleLogout}>
                  <ArrowLeftOnRectangleIcon className={`h-6 stroke-inherit`}/>
              </NavButton>
              <NavButton onClick={() => setThemeMenuOpen((prev) => !prev)}>
                {
                  theme === "light" ?
                    <SunIcon className={`h-6 stroke-inherit`}/>
                    :
                    <MoonIcon className={`h-6 stroke-inherit`}/>
                }
                  <ThemeSwitcher open={themeMenuOpen}/>
              </NavButton>
              <NavButton>
                  <AboutLink collapsed={true}/>
              </NavButton>
              <NavButton
                  onClick={handleCollapse}
              >
                  <ChevronDoubleLeftIcon
                      className={`collapse-btn h-6 stroke-inherit transition-transform ${
                        collapsed ? "flipped" : ""
                      }`}
                  />
              </NavButton>
          </div>
      }
    </div>
  );
};
