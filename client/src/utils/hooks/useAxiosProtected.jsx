import { useEffect } from "react";
import { axiosProtected } from "../apis/axios";
import useAuth from "./useAuth";
import useRefresh from "./useRefresh";

const useAxiosProtected = () => {
  const { auth, setAuth } = useAuth();
  const refresh = useRefresh();

  useEffect(() => {
    const requestInterceptor = axiosProtected.interceptors.request.use(
      (request) => {
        if (!request.headers.Authorization) {
          request.headers.Authorization = `Bearer ${auth.accessToken}`;
        }
        return request;
      },

      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosProtected.interceptors.response.use(
      (response) => Promise.resolve(response),
      async (error) => {
        const prevReq = error?.config;
        if (error?.response?.data === "Unauthorized" && !prevReq?._retry) {
          prevReq._retry = true;
          const response = await refresh();
          if (response?.data) {
            setAuth(response.data);
            prevReq.headers.Authorization = `Bearer ${response.data?.accessToken}`;
            return axiosProtected(prevReq);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosProtected.interceptors.request.eject(requestInterceptor);
      axiosProtected.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, setAuth, refresh]);

  return axiosProtected;
};

export default useAxiosProtected;
