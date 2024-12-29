import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Spinner } from "../common/Spinner";

interface PrivateRouteProps {
  component: React.ComponentType;
  exact?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { user, loading, isVerified } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (user && !isVerified) {
    return <Navigate to="/verify-email" />;
  }

  return user ? <Component /> : <Navigate to="/auth" />;
};
