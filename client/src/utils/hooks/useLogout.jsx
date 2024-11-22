import axios from "../apis/axios";
import useAuth from "./useAuth";

function useLogout() {
  const { setAuth } = useAuth();
  return async () => {
    try {
      await axios.post("/authorize/logout", null, { withCredentials: true });
      setAuth({});
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };
}

export default useLogout;
