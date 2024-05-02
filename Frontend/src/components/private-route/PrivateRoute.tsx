import { AuthActions } from "@/shared/enums";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import { isTestEnv } from "@/shared/utils/constants";
import { FunctionComponent, useEffect } from "react";
import { Navigate } from "react-router";

const PrivateRoute = (props: {Component : FunctionComponent}) => {
  const { Component } = props;
  const { user, dispatchUser } = useAuth();

  useEffect(() => {
    dispatchUser({ type: AuthActions.RefreshUser });
  }, [dispatchUser]);

  if (!user && !isTestEnv) {
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default PrivateRoute;