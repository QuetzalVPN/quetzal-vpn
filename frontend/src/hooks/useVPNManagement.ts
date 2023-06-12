import { useQuery } from "react-query";
import { getVPNStatus } from "../services/vpnManagementService";

const useVPNStatus = () => useQuery({
    queryKey: "vpnStatus",
    queryFn: getVPNStatus
  }
);

export { useVPNStatus };