import { ReactElement, useRef } from 'react';
import { Link } from 'react-router-dom';

interface NavbarItemProps {
  title: string;
  icon: ReactElement;
  collapsed?: boolean;
  path: string;
  active: boolean;
  setActive: (e?: any) => any;
  moveMarker: (top: number) => any;
}

export default ({
  title,
  icon,
  collapsed,
  path,
  active,
  setActive,
  moveMarker,
}: NavbarItemProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`navbar-item flex gap-2 py-2 my-4 items-center ${
        active ? 'text-current ' : 'text-gray-500 hover:text-gray-700'
      }`}
      ref={wrapperRef}
    >
      <Link to={path}>
        <div
          className="flex gap-2 text-lg items-center py-2 cursor-pointer w-fit "
          onClick={() => {
            setActive();
            if (wrapperRef.current) {
              moveMarker(wrapperRef.current.offsetTop + 10);
            }
          }}
        >
          {icon}
          {<h2 className={`overflow-hidden ${collapsed && 'w-0'}`}>{title}</h2>}
        </div>
      </Link>
    </div>
  );
};
