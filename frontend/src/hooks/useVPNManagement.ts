import {useMutation, useQuery, useQueryClient} from "react-query";
import {getVPNStatus, restartVPNServer} from "../services/vpnManagementService";
import {Id as ToastId, toast, UpdateOptions as ToastUpdateOptions} from "react-toastify";
import {useRef} from "react";

const useVPNStatus = () => useQuery({
    queryKey: "vpnStatus",
    queryFn: getVPNStatus
  }
);

const useVPNServerRestart = () => {
  const queryClient = useQueryClient();
  const toastId = useRef<ToastId>();

  const updateLoadingToast = (options: ToastUpdateOptions) => {
    if (toastId.current) {
      toast.update(toastId.current, options);
    }
  }

  return useMutation({
    mutationKey: "restartVPNServer",
    mutationFn: restartVPNServer,
    onMutate: () => {
      toastId.current = toast.loading(`Restarting VPN server...`);
    },
    onSuccess: () => {
      updateLoadingToast({
        render: `Successfully restarted VPN server!`,
        type: "success",
        isLoading: false,
        autoClose: undefined
      });
    },
    onError: () => {
      updateLoadingToast({
        render: `Failed to restart VPN server!`,
        type: "error",
        isLoading: false,
        autoClose: undefined
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries();
    },
  });
}

export {useVPNStatus, useVPNServerRestart};