import { UserCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { User, UserStatus } from '../pages/UserPage';

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
    <>
      <h2 className="text-xl text-center">Statistics</h2>
      <div className="grid grid-cols-2">
        <span className="font-lexend ">IP</span>
        <span className="font-lexend font-light">{user.address}</span>
        <span className="font-lexend ">Traffic</span>
        <span className="font-lexend font-light">{user.traffic} Mbit/s</span>
      </div>
    </>
  );
};

//FIXME: Fix width
const UserSettings = ({ user }: StatisticsProps) => {
  const [name, setName] = useState(user.name);

  useEffect(() => setName(user.name), [user]);

  return (
    <>
      <h2 className="text-xl text-center">Settings</h2>
      <div className="grid grid-cols-2">
        <span className="font-lexend w-fit">Name</span>
        <input
          type="text"
          className="inline w-2/3 border-slate-500 border px-2 py-1 rounded-lg bg-transparent"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <span className="font-lexend w-fit">Traffic</span>
        <span className="font-lexend font-light w-fit">
          {user.traffic} Mbit/s
        </span>
      </div>
    </>
  );
};

export default ({ user, close }: UserDetailProps) => {
  return (
    <div className="shadow-big bg-light-foreground dark:bg-dark-foreground flex flex-col h-screen pt-12 px-4 relative">
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
        <div className="flex flex-col items-center">
          {user.status == UserStatus.Online && <UserStatistics user={user} />}
          <UserSettings user={user} />
        </div>
      </div>
    </div>
  );
};
