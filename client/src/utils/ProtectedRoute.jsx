import React, { useEffect } from "react";
import useAuth from "./hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useNotify from "./hooks/useNotify";

const ProtectedRoute = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const notify = useNotify();

  useEffect(()=>{
    if(!auth?.accessToken){
      notify("error", "Please log in to continue.");
    }
  }, [auth, notify]);

  return auth?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
