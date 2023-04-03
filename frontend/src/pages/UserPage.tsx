import { QueueListIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import PageTitle from '../components/PageTitle';
import UserListItem from '../components/UserListItem';
import ShadowBox from '../components/ShadowBox';
import UserDetails from '../components/UserDetails';
import { useEffect, useState } from 'react';
import { useCurrentPage } from '../hooks/zustand';
import { PageProps } from './ConfigurationPage';

export enum UserStatus {
  Online = 0,
  Offline,
  Deactivated,
}

//TODO: safe users differently dependent on status
export interface User {
  name: string;
  address?: string;
  timestamp?: Date;
  traffic?: number;
  status: UserStatus;
}

const users: User[] = [
  {
    name: 'Felix',
    address: '10.0.0.1',
    traffic: 8,
    status: UserStatus.Online,
  },
  {
    name: 'Raphael',
    address: '10.0.0.2',
    traffic: 12,
    status: UserStatus.Online,
  },
  {
    name: 'Benjamin',
    timestamp: new Date(),
    status: UserStatus.Offline,
  },
  {
    name: 'Niklas',
    status: UserStatus.Deactivated,
  },
];

export default ({ navbarIdx }: PageProps) => {
  //TODO: save index istead
  const [selectedUser, setSelectedUser] = useState<User>();

  const setNavposition = useCurrentPage((state) => state.move);
  useEffect(() => setNavposition(navbarIdx), []);

  return (
    <div className="flex gap-4 grow">
      <div className="flex flex-col gap-4 mt-8 w-7/12 grow">
        <PageTitle title="User Management" />
        <ShadowBox>
          <div className="flex items-center">
            <h2 className="text-xl">Users</h2>
            <div className="ml-auto flex">
              <QueueListIcon className="cursor-pointer h-8" />
              <Squares2X2Icon className="cursor-pointer h-8 stroke-gray-neutral" />
            </div>
          </div>
          <div>
            {users.map((user, idx) => (
              <UserListItem
                user={user}
                key={user.name + idx}
                setSelected={() => setSelectedUser(user)}
              />
            ))}
          </div>
        </ShadowBox>
      </div>
      {selectedUser && (
        <UserDetails
          user={selectedUser}
          close={() => setSelectedUser(undefined)}
        />
      )}
    </div>
  );
};
