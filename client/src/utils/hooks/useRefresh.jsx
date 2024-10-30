import axios from "../apis/axios";

const useRefresh = () => {
  return async () => {
    try {
      const response = await axios.get("/auth/refresh", {
        withCredentials: true,
      });
      return response;
    } catch (err) {
      console.log("Error: ", err.stack);
    }
  };
};

export default useRefresh;