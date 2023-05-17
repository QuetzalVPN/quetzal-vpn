import {HomeIcon} from '@heroicons/react/24/outline';
import {Link} from 'react-router-dom';
import QuetzalTitle from '../components/QuetzalTitle';
import {useTitleState} from '../hooks/zustand';
import {useEffect} from 'react';

export default () => {
  const setBrowserTitle = useTitleState((state) => state.change);

  useEffect(() => {
    setBrowserTitle('Not found');
  }, []);

  return (<>
      <div className="flex justify-center mt-8">
        <Link to="/">
          <QuetzalTitle/>
        </Link>
      </div>
      <div className="centered text-center">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p>Sorry, we couldn't find the page you're looking for.</p>
        <br/>
        <Link
          to="/dashboard"
          className="flex gap-2 items-center justify-center text-gray-600 hover:underline"
        >
          <HomeIcon className="h-6 w-6 "/>
          Go back to dashboard
        </Link>
      </div>
    </>
  );
};
