import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import ShadowBox from '../components/ShadowBox';
import { useEffect } from 'react';
import { useTitleState } from '../hooks/zustand';

export default () => {
  const setBrowserTitle = useTitleState((state) => state.change);

  useEffect(() => {
    setBrowserTitle('Login');
  }, []);
  return (
    <div className="w-fit centered">
      <ShadowBox>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl">Login</h2>
          <p className="text-gray-neutral">
            Please enter your login information
          </p>
          <Input />
          <Input type="password" className="w-full" />
          <Button>Login</Button>
          <Link className="text-gray-neutral hover:underline" to="/">
            Forgot Password?
          </Link>
        </div>
      </ShadowBox>
    </div>
  );
};
