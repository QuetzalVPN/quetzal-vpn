import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import ActiveBar from '../assets/ActiveBar';

interface NavbarItemProps {
  title: string;
  icon: ReactElement;
  path: string;
  active: boolean;
  setActive: (e: any) => any;
}

export default ({ title, icon, path, active, setActive }: NavbarItemProps) => (
  <div
    className={`flex gap-2 py-2 my-4 items-center  ${
      active ? 'text-current ' : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    <Link to={path}>
      <div
        className="flex gap-2 text-lg items-center py-2 hover:cursor-pointer"
        onClick={setActive}
      >
        {icon}
        <h2>{title}</h2>
      </div>
    </Link>
    {active && <ActiveBar className="ml-auto h-10 fill-brand-green" />}
  </div>
);
