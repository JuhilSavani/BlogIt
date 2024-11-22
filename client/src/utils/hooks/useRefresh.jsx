import axios from "../apis/axios";

const useRefresh = () => {
  return async () => {
    try {
      const response = await axios.get("/authorize/refresh", {
        withCredentials: true,
      });
      return response;
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };
};

export default useRefresh;
