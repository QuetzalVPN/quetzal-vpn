import { TrashIcon, UserCircleIcon, WrenchIcon } from "@heroicons/react/24/outline";
import NavButton from "./NavButton";
import { VPNUser } from "../types/VPNUsers";
import { useNavigate } from "react-router-dom";
import React from "react";
import Dialog from "./Dialog";
import Button from "./Button";
import { useDeleteVPNUser } from "../hooks/useVPNUser";
import { VPNClient, VPNRoute } from "../types/VPNManagement";

interface UserListItemProps {
  user: VPNUser;
  client?: VPNClient;
  route?: VPNRoute;
}

export default ({ user, client, route }: UserListItemProps) => {
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const openDetails = () => navigate(`/users/${user.id}`);

  const closeDialog = () => setDialogOpen(false);

  const deleteVPNUser = useDeleteVPNUser();

  const handleDelete = () => {
    deleteVPNUser.mutate(user);
    closeDialog();
  };

  return (
    <div
      className={`flex px-4 py-3 my-4 cursor-pointer items-center gap-4 rounded-xl shadow-big transition-shadow ${user.isEnabled ? client ? "shadow-brand-green/60 hover:shadow-brand-green focus-within:shadow-brand-green" : "shadow-brand-yellow-light/60 hover:shadow-brand-yellow-light focus-within:shadow-brand-yellow-light" : "shadow-brand-red/50 hover:shadow-brand-red/90 focus-within:shadow-brand-red/90"}`}
      onClick={openDetails}
    >
      <UserCircleIcon
        className={`h-14 ${user.isEnabled ? client ? "text-brand-green stroke-brand-green" : "text-brand-yellow-light stroke-brand-yellow-light" : "text-brand-red stroke-brand-red"}}`}
      />
      <div>
        <p className="text-lg font-lexend">{user.username}</p>
        {client &&
          <p className="text-lg text-gray-neutral">{client.realAddress.split(":")[0]}</p>
        }
        {user.timestamp && (
          <p className="text-lg text-gray-neutral">
            Last connected:&nbsp;
            {user.timestamp.toTimeString().split(" ")[0]}
          </p>
        )}
      </div>
      <div className="ml-auto flex gap-2">
        <NavButton><WrenchIcon className="h-7" /></NavButton>
        <NavButton className="group" onClick={(e) => {
          e.stopPropagation();
          setDialogOpen(true);
        }}><TrashIcon
          className="h-7 group-hover:text-brand-red group-focus:text-brand-red" /></NavButton>
      </div>
      <Dialog open={dialogOpen} onClose={closeDialog} title={`Confirm deletion of ${user.username}`}
              description={`Do you really want to delete the user ${user.username} ?`} className="w-10/12 sm:w-auto">
        <form className="flex gap-2 justify-end" onSubmit={(e) => {
          e.preventDefault();
          handleDelete();
        }}>
          <Button variant="outline" color="neutral" onClick={closeDialog} type="button">Cancel</Button>
          <Button color="red" type="submit">Delete</Button>
        </form>
      </Dialog>
    </div>
  );
};
