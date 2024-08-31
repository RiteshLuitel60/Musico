// This component checks if the user is logged in
// If they are, it allows access to the protected route
// If not, it redirects them to the login page

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // Get the login status from Redux store
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Memoize the component to render based on login status
  const componentToRender = useMemo(() => {
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
  }, [isLoggedIn]);

  return componentToRender;
};

export default React.memo(PrivateRoute);
