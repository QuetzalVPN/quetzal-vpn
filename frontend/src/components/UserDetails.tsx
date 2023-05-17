import {ArrowDownTrayIcon, UserCircleIcon, XCircleIcon,} from '@heroicons/react/24/outline';
import {colors, User, UserStatus} from '../pages/UserPage';
import ToggleSwitch from './ToggleSwitch';
import Button from './Button';
import NavButton from "./NavButton";
import {useSidebarState} from "../hooks/zustand";
import {useNavigate} from "react-router-dom";

interface UserDetailProps {
  user: User;
}

interface StatisticsProps {
  user: User;
}

const UserStatistics = ({user}: StatisticsProps) => {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl text-center">Statistics</h2>
      <div className="grid grid-cols-2">
        <span className="font-lexend ">IP</span>
        <span className="font-lexend font-light">{user.address}</span>
        <span className="font-lexend ">Traffic</span>
        <span className="font-lexend font-light">{user.traffic} Mbit/s</span>
      </div>
    </section>
  );
};

const UserSettings = ({user}: StatisticsProps) => {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl text-center">Settings</h2>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <span className="font-lexend">Name</span>
          <span>{user.name}</span>
        </div>
        <div className="flex gap-4">
          <span className="font-lexend w-fit">Enabled</span>
          <ToggleSwitch/>
        </div>
      </div>
    </section>
  );
};

const UserAuthentication = () => (
  <section className="flex flex-col gap-2">
    <h2 className="text-xl text-center">Authentication</h2>
    <div className="flex gap-4 items-center">
      <span>File</span>
      <Button>
        <ArrowDownTrayIcon className="h-6"/>
        Download OVPN-File
      </Button>
    </div>
  </section>
);

export default ({user}: UserDetailProps) => {
  const {sidebar: open, setSidebar} = useSidebarState();
  const navigate = useNavigate();

  return (
    <div>
      <NavButton
        className="absolute top-4 right-4 cursor-pointer"
        onClick={() => navigate('/users')}
      >
        <XCircleIcon
          className="h-6"
          color="gray"
        />
      </NavButton>
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl">Settings for {user.name}</h2>
        <UserCircleIcon
          className="h-[170px]"
          strokeWidth={1.25}
          color={colors[user.status]}
        />
        <div className="flex flex-col items-center gap-4">
          {user.status == UserStatus.Online && <UserStatistics user={user}/>}
          <UserSettings user={user}/>
          <UserAuthentication/>
        </div>
      </div>
    </div>
  );
};
