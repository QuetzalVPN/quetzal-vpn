import { useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import { useCurrentPage } from '../hooks/zustand';

export interface PageProps {
  navbarIdx: number;
}

export default ({ navbarIdx }: PageProps) => {
  const setNavposition = useCurrentPage((state) => state.move);
  useEffect(() => setNavposition(navbarIdx), []);

  return (
    <div className="mt-8 w-7/12">
      <PageTitle title="Configuration" />
      <p>Text in content</p>
    </div>
  );
};
