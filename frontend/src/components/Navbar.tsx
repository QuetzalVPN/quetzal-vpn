import { ArrowLeftOnRectangleIcon, ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentPage } from "../hooks/zustand";
import "../style/navbar.scss";
import AboutLink from "./AboutLink";
import NavButton from "./NavButton";
import NavbarItem from "./NavbarItem";
import QuetzalTitle from "./QuetzalTitle";
import ThemeSwitcher from "./ThemeSwitcher";

// import useLogout from "../hooks/useLogout";

interface NavItem {
  title: string;
  icon: ReactElement;
  path: string;
}

interface NavbarProps {
  items: NavItem[];
}

export default ({ items }: NavbarProps) => {
  const navigate = useNavigate();

  // const logout = useLogout();

  const [collapsed, setCollapsed] = useState<boolean>(
    (localStorage.getItem("navbarCollapsed") ?? "false") === "true"
  );
  const [markerTop, setMarkerTop] = useState(0);

  const currentPage = useCurrentPage((state) => state.currentPage);

  useEffect(() => {
    if (collapsed) {
      localStorage.setItem("navbarCollapsed", "true");
    } else {
      localStorage.removeItem("navbarCollapsed");
    }
  }, [collapsed]);

  return (
    <div
      className={`flex flex-col h-screen py-6 bg-light-foreground dark:bg-dark-foreground shadow-md`}
    >
      <QuetzalTitle
        className="w-full justify-center px-8"
        collapsed={collapsed}
      />

      <nav className={`relative mt-8 flex flex-col gap-8 ${collapsed ? "items-center" : "pl-8 items-start"}`}>
        <div
          id="navbar-marker"
          style={{ top: markerTop }}
          className="bg-brand-green right-0 h-10 w-[6px] absolute rounded-l-sm transition-all duration-200"
        />
        {items.map((item, idx) => (
          <NavbarItem
            title={item.title}
            icon={item.icon}
            collapsed={collapsed}
            path={item.path.split(":")[0]}
            active={idx === currentPage}
            moveMarker={(top: number) => setMarkerTop(top)}
            key={item.title + idx}
          />
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-2 justify-end items-center">
        <NavButton onClick={() => {
          // logout();
          navigate("/login");
        }}>
          <ArrowLeftOnRectangleIcon className="h-6 stroke-inherit" />
        </NavButton>
        <ThemeSwitcher />
        <NavButton
          onClick={() => setCollapsed((prevCollapsed) => !prevCollapsed)}
        >
          <ChevronDoubleLeftIcon
            className={`collapse-btn h-6 stroke-inherit transition-transform ${
              collapsed ? "flipped" : ""
            }`}
          />
        </NavButton>
          <AboutLink collapsed={collapsed} />
      </div>
    </div>
  );
};
