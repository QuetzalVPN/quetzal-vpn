import { useState } from "react";
import BasicInput, { PasswordInput } from "./BasicInput";
import Button from "./Button";
import { useSignupUser } from "../hooks/useLoginUser";

export default ({ onClose }: { onClose?: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameMsg, setUsernameMsg] = useState<string>();
  const [passwordMsg, setPasswordMsg] = useState<string>();

  const signup = useSignupUser();

  const handleSubmit = () => {
    signup.mutate({ username, password });
  };

  return <form className="flex flex-col gap-2" onSubmit={(e) => {
    e.preventDefault();
    handleSubmit();
    onClose?.();
  }}>
    <div className="flex items-center">
      <div className="w-44">
        <label htmlFor="loginuser-username" className="font-lexend">Login name</label>
        {usernameMsg && <p className="text-brand-red text-sm">{usernameMsg}</p>}
      </div>
      <BasicInput required autoFocus id="loginuser-username" value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={(e) => setUsernameMsg(e.target.validity.valid ? undefined : "Please fill out this field")} />
    </div>
    <div className="flex items-center">
      <div className="w-44">
        <label htmlFor="loginuser-password" className="font-lexend">Password</label>
        {passwordMsg && <p className="text-brand-red text-sm">{passwordMsg}</p>}
      </div>
      <PasswordInput required id="loginuser-password" value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     onBlur={(e) => setPasswordMsg(e.target.validity.valid ? undefined : "Please fill out this field")} />
    </div>

    <div className="flex gap-2 justify-end">
      <Button className="mr-auto" variant="outline" color="red" type="reset">Reset</Button>
      <Button type="button" color="neutral" variant="outline" onClick={onClose}>Close</Button>
      <Button type="submit">Create</Button>
    </div>
  </form>;
}