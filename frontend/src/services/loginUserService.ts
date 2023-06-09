import { axiosClient } from "../api/axios";
import { LoginUser, UserLog } from "../types/LoginUsers";

const BASE_URL = "/auth";

const loginUser = async (username: string, password: string) => {
  return await axiosClient.post(`${BASE_URL}/login`, {
      username,
      password
    }
  );
};

const signupUser = async (username: string, password: string) => {
  return await axiosClient.post(`${BASE_URL}/users`, {
      username,
      password
    }
  );
};

const updateUser = async (id: number, password: string) => {
  return await axiosClient.patch(`${BASE_URL}/users/${id}`, { password });
};

const deleteLoginUser = async (id: number) => {
  return await axiosClient.delete(`${BASE_URL}/users/${id}`);
};

const getLoginUsers = async () => {
  return await axiosClient.get<LoginUser[]>(`${BASE_URL}/users`);
}

const getUserLogs = async (id: number) => {
  return await axiosClient.get<UserLog[]>(`${BASE_URL}/users/${id}/logs`);
}

const getSelf = async () => {
  return await axiosClient.get<string>(`${BASE_URL}/me`);
};

export { loginUser, signupUser, deleteLoginUser, getLoginUsers, getSelf };