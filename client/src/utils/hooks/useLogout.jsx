import axios from "../apis/axios";
import useAuth from "./useAuth";

function useLogout() {
  const { setAuth } = useAuth();
  return async () => {
    try {
      await axios.get("/auth/logout", { withCredentials: true });
      setAuth({});
    } catch (error) {
      console.log(error.stack);
    }
  };
}

export default useLogout;
