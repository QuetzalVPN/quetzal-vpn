import { useMutation } from "react-query";
import { loginUser } from "../services/authService";

interface UserData {
  username: string;
  password: string;
}

const useLogin = () => {
  return useMutation({
      mutationFn: ({ username, password }: UserData) => {
        return loginUser(username, password);
      },
      onSuccess: ({ data }) => {
        localStorage.setItem("token", data.accessToken);
      },
      onError: (error) => {
        localStorage.removeItem("token");
      }
    }
  );
};

export { useLogin };