import PageTitle from "../components/PageTitle";
import {PageProps} from "./ConfigurationPage";
import ShadowBox from "../components/ShadowBox";
import usePageLoad from "../hooks/usePageLoad";
import {useVPNStatus} from "../hooks/useVPNManagement";
import LoadingSpinner from "../components/LoadingSpinner";
import LineChart from "../components/charts/LineChart";
import Button from "../components/Button";
import {curveMonotoneX} from "d3";
import {useState} from "react";
import {useVPNUsers} from "../hooks/useVPNUser";

export default ({navbarIdx}: PageProps) => {
  usePageLoad("Dashboard", navbarIdx);

  const vpnStatus = useVPNStatus();
  const vpnUsers = useVPNUsers();

  const [activeUsers, setActiveUsers] = useState([
    {time: Date.now() - 1000, value: 6}
  ]);

  return (
    <div className="w-full flex flex-col gap-4">
      <PageTitle title="Dashboard" className="mt-4"/>
      <div className="flex flex-wrap gap-4">
        {vpnStatus.isLoading &&
            <div className="flex-grow flex items-center justify-center"><LoadingSpinner className="h-12"/></div>}
        {vpnStatus.isError && <span className="text-brand-red">Failed to load status</span>}
        {vpnStatus.isSuccess && <>
            <ShadowBox className="flex flex-col gap-4">
                <h4 className="text-lg font-lexend">Active Users</h4>
              {vpnStatus.data.clients.length === 0 ? <span className="text-gray-neutral">No active users</span> :
                <span
                  className="text-7xl font-lexend text-center text-brand-green">{vpnStatus.data.clients.length}</span>}
            </ShadowBox>

            <ShadowBox className="h-96 grow-[20] ">
                <div className="flex gap-4 items-center sm:min-w-[400px]">
                    <h2 className="text-xl">Active Users </h2>
                    <Button
                        onClick={() => {
                          setActiveUsers([
                            ...activeUsers,
                            {time: Date.now(), value: Math.floor(Math.random() * 10)}
                          ]);
                        }}
                    >
                        Add
                    </Button>
                </div>
                <LineChart
                    data={activeUsers.slice(-10)}
                    options={{alwaysZero: true, points: true, curve: curveMonotoneX, fill: true}}
                />
            </ShadowBox>
        </>
        }
        {vpnUsers.isLoading && <div className="flex-grow flex items-center justify-center"><LoadingSpinner
            className="h-12"/></div>}
        {vpnUsers.isError && <span className="text-brand-red">Failed to load users</span>}
        {vpnUsers.isSuccess &&
            <ShadowBox>
                <h4 className="text-xl font-lexend">VPN Users</h4>
                <div className="grid grid-cols-2 gap-2 font-lexend text-md">
                    <span className="font-bold">Total:</span> <span>{vpnUsers.data.data.amount}</span>
                    <span className="font-bold">Enabled:</span> <span>{vpnUsers.data.data.amountEnabled}</span>
                    <span className="font-bold">Disabled:</span> <span>{vpnUsers.data.data.amountDisabled}</span>
                </div>
            </ShadowBox>
        }
      </div>
    </div>
  )
    ;
};
