import { axiosClient } from "../api/axios";
import { LoginUser } from "../types/AuthUsers";

const BASE_URL = "/auth";

const loginUser = async (username: string, password: string) => {
  return await axiosClient.post(`${BASE_URL}/login`, {
      username,
      password
    }
  );
};

const signupUser = async (username: string, password: string) => {
  return await axiosClient.post(`${BASE_URL}/signup`, {
      username,
      password
    }
  );
};

const updateUser = async (password: string) => {
  return await axiosClient.patch(`${BASE_URL}/signup`, { password });
};

const deleteUser = async () => {
  return await axiosClient.delete(`${BASE_URL}/signup`);
};

const getLoginUsers = async () => {
  return await axiosClient.get<LoginUser[]>(`${BASE_URL}/signup`);
}

const getSelf = async () => {
  return await axiosClient.get<string>(`${BASE_URL}/me`);
};

export { loginUser, signupUser, getLoginUsers, getSelf };