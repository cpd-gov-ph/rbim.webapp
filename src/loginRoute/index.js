import React from "react";
import { Navigate } from "react-router-dom";
import { isLogedIn } from "../api";

const loginRoute = ({ children }) => {
  if (isLogedIn()) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default loginRoute;
