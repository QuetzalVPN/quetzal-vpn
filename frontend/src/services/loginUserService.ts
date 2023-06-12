import {axiosClient} from "../api/axios";
import {LoginUser, LoginUserLog, LoginUserLogEntry, RawLoginUserLog} from "../types/LoginUsers";
import dayjs from "dayjs";

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
  return await axiosClient.patch(`${BASE_URL}/users/${id}`, {password});
};

const deleteLoginUser = async (id: number) => {
  return await axiosClient.delete(`${BASE_URL}/users/${id}`);
};

const getLoginUsers = async () => {
  return await axiosClient.get<LoginUser[]>(`${BASE_URL}/users`);
}

const getLoginUserLogs = async (id: number): Promise<LoginUserLog> => {
  const raw = await axiosClient.get<RawLoginUserLog>(`${BASE_URL}/users/${id}/logs`);

  const logs: LoginUserLogEntry[] = raw.data.logs.map(log => {
    return {
      ...log,
      dateTime: dayjs(log.dateTime)
    };
  });

  return {logs};
}

const getSelf = async () => {
  return await axiosClient.get<string>(`${BASE_URL}/me`);
};

export {loginUser, signupUser, deleteLoginUser, getLoginUsers, getLoginUserLogs, getSelf};