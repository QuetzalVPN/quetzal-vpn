import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api/v1"
});

axiosClient.interceptors.request.use(
  async config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export { axiosClient };