import {PowerIcon, UserCircleIcon, WrenchIcon,} from '@heroicons/react/24/outline';
import {colors, User} from '../pages/UserPage';
import Dialog from './Dialog';
import NavButton from "./NavButton";

interface UserListItemProps {
  user: User;
  setSelected: () => any;
}

export default ({user, setSelected}: UserListItemProps) => {
  return (
    <div
      className="flex p-4 my-4 items-center gap-4 rounded-xl"
      style={{
        boxShadow: `0px 1px 4px 1px ${colors[user.status]}4F`,
      }}
    >
      <UserCircleIcon
        className="h-14 cursor-pointer"
        color={colors[user.status]}
        onClick={setSelected}
      />
      <div className="cursor-pointer" onClick={setSelected}>
        <p className="text-lg font-lexend">{user.name}</p>
        {user.address && (
          <p className="text-lg text-gray-neutral">{user.address}</p>
        )}
        {user.timestamp && (
          <p className="text-lg text-gray-neutral">
            Last connected:&nbsp;
            {user.timestamp.toTimeString().split(' ')[0]}
          </p>
        )}
      </div>
      <div className="edit-section ml-auto flex gap-2">
        <NavButton onClick={setSelected}><WrenchIcon className="h-7"/></NavButton>
        <Dialog triggerElement={<NavButton><PowerIcon className="h-7"/></NavButton>} title="Hello World!">
          <h2>Hello</h2>
        </Dialog>
      </div>
    </div>
  );
};
