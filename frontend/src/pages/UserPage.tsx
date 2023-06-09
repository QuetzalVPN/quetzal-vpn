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
import UserListItem from "../components/VPNUserListItem";
import NavButton from "../components/NavButton";
import Dialog from "../components/Dialog";
import VPNUserCreation from "../components/VPNUserCreation";
import Button from "../components/Button";
import { useSmallerThan } from "../hooks/useBreakpoints";
import { useVPNStatus } from "../hooks/useVPNManagement";
import * as fuzzysort from "fuzzysort";
import Searchbar from "../components/Searchbar";

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

  const { sidebar: sidebarOpen, setSidebar } = useSidebarState();

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
    <div className={`flex gap-4 w-full`}>
      <div className={`flex-col mt-4 gap-4 w-7/12 grow ${sidebarOpen ? "hidden md:flex" : "flex"}`}>
        <PageTitle title="User Management" />
        <ShadowBox>
          <div className="flex items-center justify-between">
            <h2 className="text-xl">VPN Users</h2>
            <Searchbar value={searchTerm} onChange={(value) => setSearchTerm(value)} />
          </div>
          <div className="px-2 overflow-y-auto">
            {vpnUsers.isLoading && <><LoadingSpinner className="h-12" /> Loading ...</>}
            {vpnUsers.isError && <div className="text-brand-red">Error loading users</div>}
            {vpnUsers.isSuccess &&
              vpnUsers.data && vpnStatus.isSuccess && <>
                {
                  fuzzysort
                    .go(
                      searchTerm.trim(), vpnUsers.data.data.vpnUsers,
                      { keys: ["username", "id"], all: true }
                    ).map(result => {
                    return result.obj;
                  })
                    .sort((a, b) => +b.isEnabled - +a.isEnabled)
                    .map((user) => {
                      const client = vpnStatus.data.clients.find((client) => client.commonName === user.username);
                      const route = vpnStatus.data.routes.find((route) => route.commonName === user.username);
                      return <UserListItem
                        key={user.id}
                        user={user}
                        client={client}
                        route={route}
                      />;
                    })
                }
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
          <UserDetails userId={Number.parseInt(selectedUser)}/>
        </Sidebar>
      )}
    </div>
  );
};
