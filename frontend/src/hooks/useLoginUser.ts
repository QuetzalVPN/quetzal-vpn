import {useMutation, useQuery, useQueryClient} from "react-query";
import {deleteLoginUser, getLoginUserLogs, getLoginUsers, loginUser, signupUser} from "../services/loginUserService";
import {useRef} from "react";
import {Id as ToastId, toast, UpdateOptions as ToastUpdateOptions} from "react-toastify";
import {LoginUser} from "../types/LoginUsers";
import {VPNUser} from "../types/VPNUsers";

const useLoginUser = () => {
  return useMutation({
      mutationFn: ({username, password}: { username: string; password: string }) => {
        return loginUser(username, password);
      },
      onSuccess: ({data}) => {
        localStorage.setItem("token", data.accessToken);
      },
      onError: (error) => {
        localStorage.removeItem("token");
      }
    }
  );
};

const useSignupUser = () => {
  const queryClient = useQueryClient();
  const toastId = useRef<ToastId>();

  const updateLoadingToast = (options: ToastUpdateOptions) => {
    if (toastId.current) {
      toast.update(toastId.current, options);
    }
  };

  return useMutation({
      mutationFn: ({username, password}: { username: string; password: string }) => {
        return signupUser(username, password);
      },
      onMutate({username}) {
        toastId.current = toast.loading(`Creating user ${username}...`);
      },
      onSuccess: ({data}, user) => {
        updateLoadingToast({
          render: `${user.username} successfully created!`,
          type: "success",
          isLoading: false,
          autoClose: undefined
        });
      },
      onError: (error, user) => {
        updateLoadingToast({
          render: `Failed to create user ${user.username}!`,
          type: "error",
          isLoading: false,
          autoClose: undefined
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries("loginUsers");
      }
    }
  );
};

const useLoginUsers = () => {
  return useQuery("loginUsers", {
    queryFn: getLoginUsers
  });
};

const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const toastId = useRef<ToastId>();

  const updateLoadingToast = (options: ToastUpdateOptions) => {
    if (toastId.current) {
      toast.update(toastId.current, options);
    }
  };

  return useMutation({
    mutationFn: (user: LoginUser) => deleteLoginUser(user.id),
    onMutate: (user: LoginUser) => {
      toastId.current = toast.loading(`Deleting user ${user.username}...`);
    },
    onSuccess: (data, user) => {
      updateLoadingToast({
        render: `Successfully deleted user ${user.username}!`,
        type: "success",
        isLoading: false,
        autoClose: undefined
      });
    },
    onError: (error, user) => {
      updateLoadingToast({
        render: `Failed to delete user ${user.username}!`,
        type: "error",
        isLoading: false,
        autoClose: undefined
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries("loginUsers");
    }
  });
};

const useLoginUserLogs = (id: number) => {
  return useQuery({
    queryKey: ["loginUserLogs", id],
    queryFn: () => getLoginUserLogs(id)
  });
};

export {useLoginUser, useLoginUsers, useDeleteUser, useSignupUser, useLoginUserLogs};