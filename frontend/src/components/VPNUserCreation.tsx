import {useState} from "react";
import Button from "./Button";
import {useCreateVPNUser} from "../hooks/useVPNUser";
import BasicInput from "./BasicInput";
import Switch from "./Switch";

interface VPNUserCreationProps {
  onClose?: () => void;
}

export default ({onClose}: VPNUserCreationProps) => {
  const createVPNUser = useCreateVPNUser();

  const handleCreateUser = () => {
    createVPNUser.mutate(username);
  };

  const reset = () => {
    setUsername('');
    setUsernameMsg(undefined);
    setEnabled(true);
  }

  const [username, setUsername] = useState('');
  const [usernameMsg, setUsernameMsg] = useState<string>();

  const [enabled, setEnabled] = useState(true);

  return <form
    className="flex flex-col flex-grow gap-4 sm:gap-2"
    autoComplete="off"
    onSubmit={(e) => {
      e.preventDefault();
      handleCreateUser();
      onClose?.();
    }}>
    <div className="flex gap-1 items-center">
      <div className="w-44">
        <label className="font-lexend" htmlFor="vpnuser-username">Username</label>
        {usernameMsg && <p className="text-brand-red text-sm">{usernameMsg}</p>}
      </div>
      <BasicInput
        required
        placeholder="Username"
        id="vpnuser-username"
        value={username}
        pattern=".*\S+.*"
        onChange={(e) => setUsername(e.target.value)}
        onBlur={(e) => setUsernameMsg(e.target.validity.valid ? undefined : 'Please fill out this field')}
      />
    </div>

    <div className="flex gap-1 items-center">
      <div className="w-44">
        <label className="font-lexend" htmlFor="vpnuser-password">Enable at creation</label>
      </div>
      <Switch enabled={enabled} setEnabled={setEnabled} label="Enable user?"/>
    </div>

    <div className="flex justify-end gap-2 mt-auto sm:mt-4">
      <Button variant="outline" className="mr-auto" color="red" type="reset" onClick={reset}>Clear</Button>
      <Button type="button" color="neutral" variant="outline" onClick={onClose}>Close</Button>
      <Button type="submit">Create</Button>
    </div>
  </form>;
}