import {Link} from 'react-router-dom';
import Button from '../components/Button';
import ShadowBox from '../components/ShadowBox';
import React, {useEffect, useState} from 'react';
import {useTitleState} from '../hooks/zustand';
import {useLogin} from "../hooks/useLogin";
import QuetzalTitle from "../components/QuetzalTitle";
import LoadingSpinner from "../components/LoadingSpinner";
import BasicInput, {PasswordInput} from "../components/BasicInput";

export default () => {
  const setBrowserTitle = useTitleState((state) => state.change);

  const login = useLogin();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);

  useEffect(() => {
    setBrowserTitle('Login');
  }, []);

  const handleLogin = () => {
    try {
      const result = login.mutate({username, password});
    } catch (e) {
      console.log('e', e);
    }
  }

  const togglePasswordHidden = () => setPasswordHidden((prev) => !prev);

  return (
    <div className="w-fit centered">
      <ShadowBox className="flex flex-col items-center gap-4">
        <QuetzalTitle/>
        {
          login.isSuccess ?
            <div className="text-center"><p className="font-lexend text-lg">Login successful! </p><p> You will be
              redirected
              soon...</p></div> : login.isLoading ? <LoadingSpinner className="h-6"/> :
              <form className="flex flex-col gap-2" onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}>
                <h2 className="text-xl">Login</h2>
                <p className="text-gray-neutral">
                  Please enter your login information
                </p>
                {login.isError && <p className="text-brand-red">Incorrect data! Try again.</p>}
                <BasicInput placeholder="Username" value={username} onChange={({target}) => setUsername(target.value)}/>
                <PasswordInput placeholder="Password" value={password}
                               onChange={({target}) => setPassword(target.value)}/>

                <Button type="submit">Login</Button>
                <Link className="text-gray-neutral hover:underline" to="/">
                  Forgot Password?
                </Link>
              </form>
        }
      </ShadowBox>
    </div>
  )
    ;
};
