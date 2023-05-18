import ShadowBox from './ShadowBox';
import GlobalSearch from './GlobalSearch';

interface PageTitleProps {
  title: string;
}

export default ({title}: PageTitleProps) => (
  <ShadowBox>
    <div className="flex items-center">
      <h2 className="text-2xl w-fit">{title}</h2>
      <GlobalSearch className="ml-auto w-[320px]"/>
    </div>
  </ShadowBox>
);
