import {ReactElement, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import NavButton from './NavButton';

interface NavbarItemProps {
  title: string;
  icon: ReactElement;
  collapsed?: boolean;
  path: string;
  active: boolean;
  // setActive: (e?: any) => any;
  moveMarker: (top: number) => any;
}

export default ({
                  title,
                  icon,
                  collapsed,
                  path,
                  active,
                  moveMarker,
                }: // setActive,
                  NavbarItemProps) => {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef.current && active) {
      moveMarker(wrapperRef.current.offsetTop + (wrapperRef.current.offsetHeight / 2) - 22);
    }
  }, [active]);

  return (
    <div
      className={`navbar-item flex gap-2 py-2 items-center ${
        active ? 'text-current' : ''
      }`}
      ref={wrapperRef}
    >
      <NavButton active={active} onClick={() => navigate(path)}>
        <div className="flex gap-2 text-lg items-center py-2 cursor-pointer w-fit ">
          {icon}
          <div className={`nav-extra ${collapsed ? 'collapsed' : ''}`}>
            <h2 className={`overflow-hidden`}>{title}</h2>
          </div>
        </div>
      </NavButton>
    </div>
  );
};
