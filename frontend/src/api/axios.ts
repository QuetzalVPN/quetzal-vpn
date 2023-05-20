import axios from "axios";

//TODO: Update header when logging in
export const axiosClient = axios.create({
  baseURL: "/api/v1",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }
});