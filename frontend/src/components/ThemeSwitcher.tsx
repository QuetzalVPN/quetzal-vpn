import { ComputerDesktopIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../hooks/useTheme";
import NavButton from "./NavButton";
import { Menu, Transition } from "@headlessui/react";
import ShadowBox from "./ShadowBox";

export default () => {
  const { theme, isSystemTheme, setTheme } = useTheme();

  const options = [
    {
      icon: <SunIcon className="h-full" />,
      label: "Light",
      action: () => setTheme("light"),
      active: !isSystemTheme && theme === "light"
    },
    {
      icon: <MoonIcon className="h-full" />,
      label: "Dark",
      action: () => setTheme("dark"),
      active: !isSystemTheme && theme === "dark"
    },
    {
      icon: <ComputerDesktopIcon className="h-full" />,
      label: "System",
      action: () => setTheme("system"),
      active: isSystemTheme
    }
  ];

  return (
    <Menu as="div" className="relative">
      <Menu.Button as={NavButton}>
        <div className="h-6">
          {options.find((option) => option.active)?.icon}
        </div>
      </Menu.Button>
      <Menu.Items as={ShadowBox} className="absolute border border-gray-neutral/30 py-0 px-0 -top-11 right-12 sm:-top-10 sm:-right-24 rounded-lg overflow-hidden">
        {options.map((option) => (
          <Menu.Item key={option.label}>
            {({ active }) => (
              <NavButton
                className={`flex gap-2 items-center w-full ${
                  active ? "bg-gray-neutral/20" : ""
                }
                ${option.active ? "border-2 border-brand-green dark:text-brand-green" : ""}
                `}
                onClick={option.action}
              >
                <div className="h-5">
                  {option.icon}
                </div>
                <p>{option.label}</p>
              </NavButton>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};
