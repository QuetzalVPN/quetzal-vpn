import { useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import ShadowBox from '../components/ShadowBox';
import { useCurrentPage, useTitleState } from '../hooks/zustand';
import { PageProps } from './ConfigurationPage';

export default ({ navbarIdx }: PageProps) => {
  const setNavposition = useCurrentPage((state) => state.move);
  const setBrowserTitle = useTitleState((state) => state.change);

  useEffect(() => {
    setBrowserTitle('Administration');
    setNavposition(navbarIdx);
  }, []);

  return (
    <div className="mt-8 w-7/12">
      <div className="flex flex-col gap-4">
        <PageTitle title="Administration" />
        <ShadowBox className="w-full"></ShadowBox>
      </div>
    </div>
  );
};
