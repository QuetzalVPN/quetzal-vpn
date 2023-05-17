import ShadowBox from '../components/ShadowBox';
import React, {useEffect, useState} from 'react';
import {useTitleState} from '../hooks/zustand';
import LoadingSpinner from "../components/LoadingSpinner";
import * as Form from '@radix-ui/react-form';
import Button from "../components/Button";
import BasicInput, {PasswordInput} from "../components/BasicInput";
import QuetzalTitle from "../components/QuetzalTitle";

export default () => {
  const setBrowserTitle = useTitleState((state) => state.change);

  // const login = useLogin();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setBrowserTitle('Login');
  }, []);

  const handleLogin = () => {
    try {
      console.log('login');
      // const result = login.mutate({username, password});
    } catch (e) {
      console.log('e', e);
    }
  }

  const togglePasswordHidden = () => setPasswordHidden((prev) => !prev);

  return (<>
      <QuetzalTitle className="flex justify-center mt-8"/>
      <div className="w-fit centered">
        <ShadowBox className="flex flex-col gap-2">
          <h2 className="text-2xl">Login</h2>
          {
            /*login.isSuccess*/ loggedIn ?
            <div className="text-center"><p className="font-lexend text-lg">Login successful! </p><p> You will be
              redirected
              soon...</p></div> : /*login.isLoading*/ loggedIn ? <LoadingSpinner className="h-6"/> :
              <Form.Root onSubmit={(e) => {
                e.preventDefault();
                handleLogin()
              }}
              >
                <Form.Field name="username">
                  <div className="flex justify align-baseline space-between">
                    <Form.Label className="font-lexend text-lg">Username</Form.Label>
                    <Form.Message match="valueMissing">
                      Please provide a username
                    </Form.Message>
                  </div>
                  <Form.Control asChild>
                    <BasicInput className="w-full"/>
                  </Form.Control>
                </Form.Field>
                <Form.Field name="password">
                  <div className="flex justify align-baseline space-between">
                    <Form.Label className="font-lexend text-lg">Password</Form.Label>
                    <Form.Message match="valueMissing">
                      Please provide a password
                    </Form.Message>
                  </div>
                  <Form.Control asChild>
                    <PasswordInput className="w-[240px]"/>
                  </Form.Control>
                </Form.Field>

                <Form.Submit asChild>
                  <Button type="submit" className="w-full mt-4">
                    Login
                  </Button>
                </Form.Submit>
              </Form.Root>
          }
        </ShadowBox>
      </div>
    </>
  )
    ;
};

