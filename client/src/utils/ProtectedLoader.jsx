import React, { useEffect, useState } from "react";
import useAuth from "./hooks/useAuth";
import useRefresh from "./hooks/useRefresh";
import { Outlet } from "react-router-dom";
import Loading from "../components/Loading";

const ProtectedLoader = () => {
  const [isLoading, setLoading] = useState(true);
  const { auth, setAuth } = useAuth();
  const refresh = useRefresh();

  useEffect(() => {
    const getRefresh = async () => {
      try {
        const response = await refresh();
        setAuth(response?.data);
      } catch (err) {
        console.log("Error: ", err.message);
      } finally {
        setLoading(false);
      }
    };
    !auth?.accessToken && !isLoading ? getRefresh() : setLoading(false);
  }, [auth?.accessToken, refresh, setAuth, isLoading]);

    return isLoading ? <Loading/> : <Outlet />;
};

export default ProtectedLoader;
