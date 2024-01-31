import React from "react";
import { Navigate } from "react-router-dom";
import { isLogedIn, getRole } from "../api";

const PrivateRoute = ({ children, roles }) => {
  let checkRole = roles.includes(getRole());
  if (!isLogedIn() || !checkRole) {
    localStorage.clear();
    return <Navigate to="/login-selection" replace />;
  }
  return children;
};
export default PrivateRoute;
