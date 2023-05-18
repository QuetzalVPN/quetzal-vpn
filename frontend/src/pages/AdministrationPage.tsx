import {useEffect} from 'react';
import PageTitle from '../components/PageTitle';
import ShadowBox from '../components/ShadowBox';
import {useCurrentPage, useTitleState} from '../hooks/zustand';
import {PageProps} from './ConfigurationPage';
import usePageLoad from "../hooks/usePageLoad";

export default ({navbarIdx}: PageProps) => {
  usePageLoad("Administration", navbarIdx);

  return (
    <div className="mt-8 w-full">
      <div className="flex flex-col gap-4">
        <PageTitle title="Administration"/>
        <ShadowBox className="w-full"></ShadowBox>
      </div>
    </div>
  );
};
