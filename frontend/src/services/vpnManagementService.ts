import { axiosClient } from "../api/axios";
import type { RawVPNStatus, VPNStatus } from "../types/VPNManagement";
import dayjs from "dayjs";

const BASE_URL = "/vpn/management";

const getVPNStatus = async () => {
  const response = await axiosClient.get<RawVPNStatus>(`${BASE_URL}/status`);

  const updated = dayjs(response.data.updated);
  const clients = response.data.clients.map(client => {
    return {
      ...client,
      connectedSince: dayjs(client.connectedSince)
    };
  });

  const routes = response.data.routes.map(route => {
    return {
      ...route,
      lastRef: dayjs(route.lastRef)
    };
  });

  const vpnStatus: VPNStatus = {
    ...response.data,
    updated,
    clients,
    routes
  };

  return vpnStatus;
};

export { getVPNStatus };