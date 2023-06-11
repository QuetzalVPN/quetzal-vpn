import {useMutation, useQuery, useQueryClient} from "react-query";
import {getVPNServerConfig, updateVPNServerConfig} from "../services/vpnConfigurationService";
import {VPNServerConfig} from "../types/VPNServerConfig";
import {useRef} from "react";
import {Id as ToastId, toast, UpdateOptions as ToastUpdateOptions} from "react-toastify";

const useVPNServerConfiguration = () => {
  return useQuery({
    queryKey: "vpnServerConfiguration",
    queryFn: getVPNServerConfig,
  });
};

const useUpdateVPNServerConfiguration = () => {
  const toastId = useRef<ToastId>();
  const queryClient = useQueryClient();

  const updateLoadingToast = (options: ToastUpdateOptions) => {
    if (toastId.current) {
      toast.update(toastId.current, options);
    }
  }

  return useMutation({
    mutationKey: "updateVPNServerConfiguration",
    mutationFn: (newConfig: VPNServerConfig) => updateVPNServerConfig(newConfig),
    onMutate: () => {
      toastId.current = toast.loading(`Updating VPN server configuration...`);
    },
    onSuccess: () => {
      updateLoadingToast({
        render: `Successfully updated VPN server configuration!`,
        type: "success",
        isLoading: false,
        autoClose: undefined
      });
    },
    onError: () => {
      updateLoadingToast({
        render: `Failed to update VPN server configuration!`,
        type: "error",
        isLoading: false,
        autoClose: undefined
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries("vpnServerConfiguration");
    }
  })
}

export {useVPNServerConfiguration, useUpdateVPNServerConfiguration};