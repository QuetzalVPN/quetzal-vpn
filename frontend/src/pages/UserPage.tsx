import { MagnifyingGlassIcon, QueueListIcon, Squares2X2Icon, UserPlusIcon } from "@heroicons/react/24/outline";
import PageTitle from "../components/PageTitle";
import ShadowBox from "../components/ShadowBox";
import UserDetails from "../components/UserDetails";
import { PageProps } from "./ConfigurationPage";
import usePageLoad from "../hooks/usePageLoad";
import Sidebar from "../components/Sidebar";
import { useSidebarState } from "../hooks/zustand";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useVPNUsers } from "../hooks/useVPNUser";
import LoadingSpinner from "../components/LoadingSpinner";
import UserListItem from "../components/UserListItem";
import NavButton from "../components/NavButton";
import Dialog from "../components/Dialog";
import VPNUserCreation from "../components/VPNUserCreation";
import Button from "../components/Button";
import { useSmallerThan } from "../hooks/useBreakpoints";
import { useVPNStatus } from "../hooks/useVPNManagement";

// export enum UserStatus {
//   Online,
//   Offline,
//   Deactivated,
// }

// export const colors = {
//   [UserStatus.Online]: '#00FF70',
//   [UserStatus.Offline]: '#F9C81B',
//   [UserStatus.Deactivated]: '#F91B1B',
// };

export default ({ navbarIdx }: PageProps) => {
  usePageLoad("User Management", navbarIdx);

  const { setSidebar } = useSidebarState();

  const smallScreen = useSmallerThan("sm");

  const { id: selectedUser } = useParams();

  const vpnUsers = useVPNUsers();
  const vpnStatus = useVPNStatus();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  useEffect(() => {
    if (selectedUser) {
      setSidebar(true);
    } else {
      setSidebar(false);
    }
  }, [selectedUser]);

  return (
    <div className="flex gap-4 w-full">
      <div className="flex flex-col mt-4 gap-4 w-7/12 grow">
        <PageTitle title="User Management" />
        <ShadowBox>
          <div className="flex items-center justify-between">
            <h2 className="text-xl">Users</h2>
            <form
              className="flex rounded-xl bg-light-midground dark:bg-dark-midground shadow-inner focus-within:outline outline-2 outline-brand-green">
              <input type="text" placeholder="Search" className="bg-transparent py-1 px-3 outline-none"
                     value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button type="submit"
                      className="h-full z-10 aspect-square p-3 shadow-glow shadow-brand-green/60 bg-brand-green rounded-xl hover:bg-brand-green-light focus:bg-brand-green-light">
                <MagnifyingGlassIcon className="h-5 text-light-text" />
              </button>
            </form>
            {/*<div>*/}
            {/*  <NavButton style={{ padding: ".2rem" }} active={true}>*/}
            {/*    <QueueListIcon className="h-8" />*/}
            {/*  </NavButton>*/}
            {/*  <NavButton style={{ padding: ".2rem" }}>*/}
            {/*    <Squares2X2Icon className="h-8" />*/}
            {/*  </NavButton>*/}
            {/*</div>*/}
          </div>
          <div className="px-2 overflow-y-auto">
            {vpnUsers.isLoading && <><LoadingSpinner className="h-12" /> Loading ...</>}
            {vpnUsers.isError && <div className="text-brand-red">Error loading users</div>}
            {vpnUsers.isSuccess &&
              vpnUsers.data && vpnStatus.isSuccess && <>
                {vpnUsers.data.data.vpnUsers.sort((a, b) => +b.isEnabled - +a.isEnabled).filter((item) => item.username.toLowerCase().search(searchTerm.toLowerCase().trim()) > -1 || item.id.toString().search(searchTerm) > -1).map((user) => {
                  const status = vpnStatus.data.clients.find((client) => client.commonName === user.username);
                  return <UserListItem
                    user={status ? { ...user, address: status.realAddress } : user}
                    key={user.username} />;
                })}
                <Button variant="outline" className="w-full text-center mb-1" onClick={openDialog}>
                  <div className="flex gap-2 p-2 items-center">
                    <UserPlusIcon className="h-6" />
                    <span>Create User</span>
                  </div>
                </Button>
                <Dialog title="Create User" description="Enter details for the new user below" open={dialogOpen}
                        onClose={closeDialog} fullScreen={smallScreen}>
                  <VPNUserCreation onClose={closeDialog} />
                </Dialog>
              </>}
          </div>
        </ShadowBox>
      </div>
      {selectedUser && (
        <Sidebar>
          <UserDetails userId={Number.parseInt(selectedUser)} />
        </Sidebar>
      )}
    </div>
  );
};
