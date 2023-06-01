import { useMutation, useQuery, useQueryClient } from "react-query";
import { createUser, deleteUser, getUser, getUserProfile, getUsers, updateUser } from "../services/vpnUserService";
import { Id as ToastId, toast, UpdateOptions as ToastUpdateOptions } from "react-toastify";
import { useRef } from "react";
import { VPNUser } from "../types/VPNUsers";

const useVPNUsers = () => {
  return useQuery("vpnUsers", {
    queryFn: getUsers
  });
};

const useVPNUser = (id: number) => {
  return useQuery(["vpnUser", id], {
    queryFn: () => getUser(id)
  });
};

const useVPNUserProfile = (id: number) => {
  return useQuery(["vpnUserProfile", id], {
    queryFn: () => getUserProfile(id)
  });
};

const useCreateVPNUser = () => {
  const queryClient = useQueryClient();
  const toastId = useRef<ToastId | null>(null);

  const updateLoadingToast = (options: ToastUpdateOptions) => {
    if (toastId.current) {
      toast.update(toastId.current, options);
    }
  };

  return useMutation({
    mutationFn: (username: string) => createUser(username),
    onMutate: (username: string) => {
      toastId.current = toast.loading(`Creating user ${username}...`);
    },
    onSuccess: (result) => {
      updateLoadingToast({
        render: `${result.data.username} successfully created!`,
        type: "success",
        isLoading: false,
        autoClose: undefined
      });
    },
    onError: (error, username) => {
      updateLoadingToast({
        render: `Failed to create user ${username}!`,
        type: "error",
        isLoading: false,
        autoClose: undefined
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries("vpnUsers");
    }
  });
};

const useDeleteVPNUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: VPNUser) => deleteUser(user.id),
    onSuccess: (result, user) => {
      toast.success(`${user.username} successfully deleted!`);
    },
    onError: (error, user) => {
      toast.error(`Failed to delete user ${user.username}!`);
    },
    onSettled: () => {
      queryClient.invalidateQueries("vpnUsers");
    }
  });
};

interface UdateVPNUserParams {
  user: VPNUser;
  enable: boolean;
}

const useUpdateVPNUser = () => {
  const queryClient = useQueryClient();
  const toastId = useRef<ToastId | null>(null);

  const updateLoadingToast = (options: ToastUpdateOptions) => {
    if (toastId.current) {
      toast.update(toastId.current, options);
    }
  };

  return useMutation({
    mutationKey: "updateVPNUser",
    mutationFn: ({ user, enable }: UdateVPNUserParams) => updateUser(user.id, enable),
    onMutate: ({ user }) => {
      toastId.current = toast.loading(`Updating user ${user.username}...`);
    },
    onSuccess: (result, { user, enable }) => {
      updateLoadingToast({
        render: `${user.username} successfully ${enable ? "enabled" : "disabled"}!`,
        type: "success",
        isLoading: false,
        autoClose: undefined
      });
    },
    onError: (error, { user, enable }) => {
      updateLoadingToast({
        render: `Failed to ${enable ? "enable" : "disable"} user ${user.username}!`,
        type: "error",
        isLoading: false,
        autoClose: undefined
      });
    },
    onSettled: (_, __, { user }) => {
      queryClient.invalidateQueries("vpnUsers");
      queryClient.invalidateQueries(["vpnUser", user.id]);
    }
  });
};

export { useVPNUsers, useVPNUser, useVPNUserProfile, useCreateVPNUser, useDeleteVPNUser, useUpdateVPNUser };