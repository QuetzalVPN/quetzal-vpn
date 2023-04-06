import {
  ArrowDownTrayIcon,
  UserCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { User, UserStatus } from '../pages/UserPage';
import ToggleSwitch from './ToggleSwitch';
import Input from './Input';

interface UserDetailProps {
  user: User;
  close: () => any;
}

interface StatisticsProps {
  user: User;
}

//TODO: dont have color array in multiple components
const colors = ['#00FF70', '#F9C81B', '#F91B1B'];

const UserStatistics = ({ user }: StatisticsProps) => {
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

//FIXME: Fix width
const UserSettings = ({ user }: StatisticsProps) => {
  const [name, setName] = useState(user.name);

  useEffect(() => setName(user.name), [user]);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl text-center">Settings</h2>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <label htmlFor="user-name">Name</label>
          <Input
            initialValue={name}
            validator={(value: string) => value.trim().length > 0}
          />
        </div>
        <div className="flex gap-4">
          <span className="font-lexend w-fit">Enabled</span>
          <ToggleSwitch />
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
      <button className="flex-grow flex gap-2 py-2 px-4 rounded-lg bg-brand-green text-light-text">
        <ArrowDownTrayIcon className="h-6" />
        Download OVPN-File
      </button>
    </div>
  </section>
);

export default ({ user, close }: UserDetailProps) => {
  return (
    <div className="shadow-md bg-light-foreground dark:bg-dark-foreground flex flex-col h-screen pt-12 px-8 relative">
      <XCircleIcon
        className="absolute top-4 right-4 h-6 cursor-pointer"
        color="gray"
        onClick={close}
      />
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl">Settings for {user.name}</h2>
        <UserCircleIcon
          className="h-[170px]"
          strokeWidth={1.25}
          color={colors[user.status]}
        />
        <div className="flex flex-col items-center gap-4">
          {user.status == UserStatus.Online && <UserStatistics user={user} />}
          <UserSettings user={user} />
          <UserAuthentication />
        </div>
      </div>
    </div>
  );
};
