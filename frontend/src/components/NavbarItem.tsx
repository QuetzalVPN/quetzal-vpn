import {ReactElement, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import NavButton from "./NavButton";
import {useBiggerThan, useSmallerThan} from "../hooks/useBreakpoints";

interface NavbarItemProps {
  title: string;
  icon: ReactElement;
  collapsed?: boolean;
  path: string;
  active: boolean;
  moveMarker: (offset: { top?: number, left?: number }) => any;
}

export default ({
                  title,
                  icon,
                  collapsed,
                  path,
                  active,
                  moveMarker
                }: // setActive,
                  NavbarItemProps) => {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const smallScreen = useSmallerThan('sm');

  const handleSmallScreenResize = () => {
    if (ref.current && active) {
      moveMarker({left: ref.current.offsetLeft + (ref.current.offsetWidth / 2) - 22});
    }
  };

  useEffect(() => {
    if (ref.current && active) {
      if (smallScreen) {
        handleSmallScreenResize();
        window.addEventListener('resize', handleSmallScreenResize);
      } else {
        window.removeEventListener('resize', handleSmallScreenResize);
        moveMarker({top: ref.current.offsetTop + (ref.current.offsetHeight / 2) - 22});
      }
    }
    return () => window.removeEventListener('resize', handleSmallScreenResize);
  }, [active, smallScreen]);

  return (
    <NavButton active={active} onClick={() => navigate(path)}>
      <div
        className={`flex ${collapsed ? "" : "gap-2"} text-lg items-center cursor-pointer w-fit ${active ? "text-current" : ""}`}
        ref={ref}>
        {icon}
        <div className={`sm:nav-extra hidden ${collapsed ? "sm:collapsed" : ""}`}>
          <h2 className={`sm:overflow-hidden`}>{title}</h2>
        </div>
      </div>
    </NavButton>
  );
};
