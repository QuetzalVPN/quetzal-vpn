import {axiosClient} from "../api/axios";
import {VPNServerConfig} from "../types/VPNServerConfig";

const BASE_URL = "/vpn/config";

const getVPNServerConfig = async () => {
  const response = await axiosClient.get<VPNServerConfig>(`${BASE_URL}/server`);
  return response.data;
};

const updateVPNServerConfig = async (config: VPNServerConfig) => {
  const response = await axiosClient.post<VPNServerConfig>(`${BASE_URL}/server`, config);
  return response.data;
}

export {getVPNServerConfig, updateVPNServerConfig};