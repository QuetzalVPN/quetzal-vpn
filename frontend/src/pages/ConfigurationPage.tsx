import Input from '../components/Input';
import PageTitle from '../components/PageTitle';
import ShadowBox from '../components/ShadowBox';
import IPInput from '../components/IPInput';
import SettingsControls from '../components/SettingsControls';
import usePageLoad from "../hooks/usePageLoad";
import {useTheme} from "../hooks/useTheme";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export interface PageProps {
  navbarIdx: number;
}

const DHCPSettings = () => {
  return (
    <section className="flex flex-col flex-wrap gap-4">
      <h2 className="text-xl">DHCP Settings</h2>
      <div className="flex gap-4 flex-wrap items-center">
        <label htmlFor="dhcp-pool-start">DHCP Pool</label>
        <div className="flex gap-2 flex-wrap items-center">
          <IPInput id="dhcp-pool-start" initialValue="10.0.0.1"/>
          <span>-</span>
          <IPInput id="dhcp-poool-end" initialValue="10.0.0.100"/>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <label htmlFor="dhcp-dns">DNS Server</label>
        <IPInput id="dhcp-dns" initialValue="10.0.0.128"/>
      </div>
      <div className="flex gap-4 items-center">
        <label htmlFor="dhcp-gateway">Default Gateway</label>
        <IPInput id="dhcp-gateway" initialValue="10.0.0.254"/>
      </div>
    </section>
  );
};

const TrafficSettings = () => {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl">Traffic Controls</h2>
      <div className="flex gap-4 items-center">
        <label htmlFor="traffic-rate-limit">Traffic Rate [Mbit/s]</label>
        <Input
          id="traffic-rate-limit"
          initialValue="8"
          validator={(value) =>
            !(isNaN(parseFloat(value)) || parseFloat(value) < 0.1)
          }
        />
      </div>
    </section>
  );
};

export default ({navbarIdx}: PageProps) => {
  usePageLoad("Configuration", navbarIdx);
  const {theme} = useTheme();

  const notify = () => toast('Applied changes!', {
    type: 'success',
    position: 'bottom-right',
    autoClose: 3000,
    theme: theme === 'system' ? 'colored' : theme
  });

  return (
    <div className="flex flex-col gap-4 mt-4 w-full">
      <PageTitle title="VPN Configuration"/>
      <ShadowBox>
        <div className="flex flex-col gap-4">
          <DHCPSettings/>
          <TrafficSettings/>
        </div>
        <SettingsControls apply={notify}/>
      </ShadowBox>
    </div>
  );
};
