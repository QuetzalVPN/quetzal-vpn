import {useMutation} from "react-query";
import {loginUser} from "../services/authService";
import {useNavigate} from "react-router-dom";

import {useLoginState} from "./zustand";

interface UserData {
  username: string;
  password: string;
}

const useLogin = () => {
  // TODO: dont navigate here, but in the component
  const navigate = useNavigate();

  const {setLoggedIn} = useLoginState();

  return useMutation({
      mutationFn: ({username, password}: UserData) => {
        console.log('data', {username, password});
        return loginUser(username, password)
      },
      onSuccess: ({data}) => {
        navigate('/dashboard', {replace: true});
        localStorage.setItem("token", data.accessToken);
        setLoggedIn(true);
      },
      onError: (error) => {
        console.error(error);
        setLoggedIn(false);
      }
    }
  )
}

export {useLogin};