import ShadowBox from "../components/ShadowBox";
import React, { useEffect, useState } from "react";
import { useTitleState } from "../hooks/zustand";
import LoadingSpinner from "../components/LoadingSpinner";
import QuetzalTitle from "../components/QuetzalTitle";
import { useLogin } from "../hooks/useLogin";
import BasicInput, { PasswordInput } from "../components/BasicInput";
import Button from "../components/Button";
import { Navigate } from "react-router-dom";

export default () => {
  const setBrowserTitle = useTitleState((state) => state.change);

  const login = useLogin();

  const [username, setUsername] = useState("");
  const [usernameMsg, setUsernameMsg] = useState<string>();
  const [password, setPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<string>();

  useEffect(() => {
    setBrowserTitle("Login");
  }, []);

  const handleLogin = () => {
    login.mutate({ username, password });
  };

  return (<>
      <QuetzalTitle className="flex justify-center mt-8" />
      <ShadowBox className="h-72 w-11/12 sm:w-[380px] centered">
        <h2 className="text-2xl">Login</h2>
        <div className={`grow flex flex-col ${login.isLoading || login.isSuccess ? 'justify-center items-center' : ''}`}>
          {login.isLoading && <LoadingSpinner className="h-6" />}
          {login.isSuccess && <>
            <p className="text-lg">Login successful</p>
            <p>You will be redirected soon</p>
            <Navigate to="/dashboard" />
          </>}
          {(login.isIdle || login.isError) && <>
            {login.isIdle && <p className="text-gray-neutral">Please enter your login information below</p>}
            {login.isError && <p className="text-brand-red">The login information you entered is incorrect!</p>}
            <form onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
                  className="flex flex-col grow gap-2"
            >
              <div className="flex flex-col">
                <div className="flex gap-2 justify-between items-center">
                  <label htmlFor="username" className="font-lexend text-lg">Username</label>
                  <p className="text-brand-red text-sm">{usernameMsg}</p>
                </div>
                <BasicInput placeholder="Username" id="username" value={username} required
                            onChange={e => setUsername(e.target.value)}
                            onBlur={e => setUsernameMsg(e.target.validity.valid ? undefined : "Please enter your username")}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex gap-2 items-center justify-between">
                  <label htmlFor="password" className="font-lexend text-lg">Password</label>
                  <p className="text-brand-red text-sm">{passwordMsg}</p>
                </div>
                <PasswordInput placeholder="Password" id="password" value={password} required
                               onChange={e => setPassword(e.target.value)}
                               onBlur={e => setPasswordMsg(e.target.validity.valid ? undefined : "Please enter your password")}
                />
              </div>
              <Button type="submit" className="w-full mt-auto">Login</Button>
            </form>
          </>
          }
        </div>
      </ShadowBox>
    </>
  )
    ;
};

