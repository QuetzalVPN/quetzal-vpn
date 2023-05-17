import {QueueListIcon, Squares2X2Icon} from '@heroicons/react/24/outline';
import PageTitle from '../components/PageTitle';
import UserListItem from '../components/UserListItem';
import ShadowBox from '../components/ShadowBox';
import UserDetails from '../components/UserDetails';
import {PageProps} from './ConfigurationPage';
import usePageLoad from "../hooks/usePageLoad";
import Sidebar from "../components/Sidebar";
import {useSidebarState} from "../hooks/zustand";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";

export enum UserStatus {
  Online,
  Offline,
  Deactivated,
}

export const colors = {
  [UserStatus.Online]: '#00FF70',
  [UserStatus.Offline]: '#F9C81B',
  [UserStatus.Deactivated]: '#F91B1B',
};


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

export default ({navbarIdx}: PageProps) => {
  usePageLoad("Administration", navbarIdx);
  const {sidebar, setSidebar} = useSidebarState();

  const navigate = useNavigate();

  const {id: selectedUser} = useParams();

  useEffect(() => {
    if (selectedUser) {
      setSidebar(true);
    } else {
      setSidebar(false);
    }
  }, [selectedUser]);

  return (
    <div className="flex gap-4 w-full">
      <div className="flex flex-col gap-4 mt-8 w-7/12 grow overflow-y-scroll">
        <PageTitle title="User Management"/>
        <ShadowBox>
          <div className="flex items-center">
            <h2 className="text-xl">Users</h2>
            <div className="ml-auto flex">
              <QueueListIcon className="cursor-pointer h-8"/>
              <Squares2X2Icon className="cursor-pointer h-8 stroke-gray-neutral"/>
            </div>
          </div>
          <div>
            {users.map((user, idx) => (
              <UserListItem
                user={user}
                key={user.name + idx}
                setSelected={() => {
                  navigate(`/users/${idx}`)
                }}
              />
            ))}
          </div>
        </ShadowBox>
      </div>
      {selectedUser && (
        <Sidebar>
          <UserDetails
            user={users[parseInt(selectedUser)]}
          />
        </Sidebar>
      )}
    </div>
  );
};
