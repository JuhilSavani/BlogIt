import React from "react";
import useAuth from "./hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const { auth } = useAuth();
  const location = useLocation();
  return auth?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
