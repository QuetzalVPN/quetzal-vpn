import PageTitle from "../components/PageTitle";
import {PageProps} from "./ConfigurationPage";
import ShadowBox from "../components/ShadowBox";
import usePageLoad from "../hooks/usePageLoad";
import {useVPNStatus} from "../hooks/useVPNManagement";
import LoadingSpinner from "../components/LoadingSpinner";

export default ({navbarIdx}: PageProps) => {
  usePageLoad("Dashboard", navbarIdx);

  const vpnStatus = useVPNStatus();

  return (
    <div className="w-full flex flex-col gap-4">
      <PageTitle title="Dashboard" className="mt-4"/>
      <div className="flex flex-wrap gap-4">
        {vpnStatus.isLoading &&
            <div className="flex-grow flex items-center justify-center"><LoadingSpinner className="h-12"/></div>}
        {vpnStatus.isError && <span className="text-brand-red">Failed to load status</span>}
        {vpnStatus.isSuccess &&
            <ShadowBox className="flex flex-col gap-4">
                <h4 className="text-lg font-lexend">Active Users</h4>
              {vpnStatus.data.clients.length === 0 && <span className="text-gray-neutral">No active users</span>}
            </ShadowBox>
        }
      </div>
    </div>
  );
};
