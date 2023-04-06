import { useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import { useCurrentPage } from '../hooks/zustand';
import { PageProps } from './ConfigurationPage';

export default ({ navbarIdx }: PageProps) => {
  const setNavposition = useCurrentPage((state) => state.move);

  useEffect(() => setNavposition(navbarIdx), []);

  return (
    <div className="mt-8 w-full">
      <PageTitle title="Dashboard" />
      <p>Text in content</p>
    </div>
  );
};
