import axios from "axios";

const loginUser = async (username: string, password: string) => {
  return await axios.post("/api/v1/auth/login", {
      username,
      password
    }
  );
};

const getSelf = async () => {
  return await axios.get("/api/v1/auth/me");
};

export { loginUser, getSelf };