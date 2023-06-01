import ShadowBox from './ShadowBox';
import {useBiggerThan, useSmallerThan} from "../hooks/useBreakpoints";

interface PageTitleProps {
  title: string;
}

export default ({title}: PageTitleProps) => {
  return <ShadowBox>
    <div className="flex items-center">
      <h2 className="text-2xl w-fit">{title}</h2>
      {/*<GlobalSearch className="ml-auto w-[320px]"/>*/}
    </div>
  </ShadowBox>
};
