// PrivateRoute component for protecting routes
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // Check if user is logged in
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Render Outlet or redirect to login
  const componentToRender = useMemo(() => {
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
  }, [isLoggedIn]);

  return componentToRender;
};

export default React.memo(PrivateRoute);
