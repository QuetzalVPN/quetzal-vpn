import {ArrowDownTrayIcon, TrashIcon, UserCircleIcon, XCircleIcon,} from '@heroicons/react/24/outline';
import ToggleSwitch from './Switch';
import NavButton from "./NavButton";
import {useSidebarState} from "../hooks/zustand";
import {useNavigate} from "react-router-dom";
import {VPNUser} from "../types/VPNUsers";
import {useDeleteVPNUser, useVPNUser, useVPNUserProfile} from "../hooks/useVPNUser";
import LoadingSpinner from "./LoadingSpinner";
import Button from "./Button";
import {useState} from "react";
import useDownload from "../hooks/useDownload";
import {getUserProfile} from "../services/vpnUserService";
import {toast} from "react-toastify";

interface UserDetailProps {
  userId: number;
}

interface StatisticsProps {
  user: VPNUser;
}

// const UserStatistics = ({user}: StatisticsProps) => {
//   return (
//     <section className="flex flex-col gap-2">
//       <h2 className="text-xl text-center">Statistics</h2>
//       <div className="grid grid-cols-2">
//         <span className="font-lexend ">IP</span>
//         <span className="font-lexend font-light">{user.address}</span>
//         <span className="font-lexend ">Traffic</span>
//         <span className="font-lexend font-light">{user.traffic} Mbit/s</span>
//       </div>
//     </section>
//   );
// };

const UserSettings = ({user}: StatisticsProps) => {
  const [enabled, setEnabled] = useState(user.isEnabled);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl text-center">Settings</h2>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <span className="font-lexend">Name</span>
          <span>{user.username}</span>
        </div>
        <div className="flex gap-4">
          <span className="font-lexend w-fit">Enabled</span>
          <ToggleSwitch enabled={enabled} setEnabled={() => setEnabled((prev) => !prev)}/>
        </div>
      </div>
    </section>
  );
};

const UserAuthentication = ({user}: { user: VPNUser }) => {
  const download = useDownload();

  const handleDownload = async () => {
    const profile = await getUserProfile(user.id);
    if (profile.status >= 200 && profile.status < 300) {
      download(new Blob([profile.data]), `${user.username}.ovpn`);
    } else {
      toast.error('Could not download profile');
    }
  }

  return <section className="flex flex-col gap-2">
    <h2 className="text-xl text-center">Authentication</h2>
    <Button onClick={handleDownload}>
      <ArrowDownTrayIcon className="h-6"/>
      Download OVPN-File
    </Button>
  </section>
};

export default ({userId}: UserDetailProps) => {
  const {sidebar: open, setSidebar} = useSidebarState();
  const navigate = useNavigate();

  const vpnUser = useVPNUser(userId);

  const deleteVPNUser = useDeleteVPNUser();

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
      {vpnUser.isLoading && <><LoadingSpinner className="h-12"/> Loading ...</>}
      {vpnUser.isError && <p>A unexpected error occurred</p>}
      {vpnUser.isSuccess && vpnUser.data && (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl">Settings for {vpnUser.data.data.username}</h2>
          <UserCircleIcon
            className="h-[170px]"
            strokeWidth={1.25}
            color={'#00ff70'}
          />
          <UserAuthentication user={vpnUser.data.data}/>
          <h2 className="text-xl">Actions</h2>
          <div className="flex gap-2 w-full">
            {/*<Button color="yellow" variant="outline" className="grow">Deactivate</Button>*/}
            {/*TODO: show a confirmation dialog before deleting*/}
            <Button color="red" variant="outline" className="grow" onClick={() => deleteVPNUser.mutate(vpnUser.data.data)}>
              <TrashIcon className="h-6"/>
              Delete
            </Button>
          </div>
        </div>)}
    </div>
  );
};
