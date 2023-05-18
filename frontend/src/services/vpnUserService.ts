import {axiosClient} from "../api/axios";
import type {VPNUser, VPNUserCollection} from "../types/VPNUsers";

const BASE_URL = "/vpn/users";

const getUsers = async () => {
  return await axiosClient.get<VPNUserCollection>(`${BASE_URL}`);
}

const getUser = async (id: number) => {
  return await axiosClient.get<VPNUser>(`${BASE_URL}/${id}`);
}

const getUserProfile = async (id: number) => {
  return await axiosClient.get<string>(`${BASE_URL}/${id}/profile`);
}

const createUser = async (username: string) => {
  return await axiosClient.post<VPNUser>(`${BASE_URL}`, {
    username,
  });
}

// enable is not optional, because it is the only thing that can be changed, so otherwise updateUser would never be called
const updateUser = async (id: number, enable: boolean) => {
  return await axiosClient.patch<VPNUser>(`${BASE_URL}/${id}`, {
    enable
  });
}

const deleteUser = async (id: number) => {
  return await axiosClient.delete(`${BASE_URL}/${id}`);
}

export {getUsers, createUser, getUser, getUserProfile, updateUser, deleteUser};