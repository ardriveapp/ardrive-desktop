import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { authSelectors } from "../redux/selectors";

export function withProtection(Component: React.ElementType) {
  return (props: any) => {
    const isLoggedIn = useSelector(authSelectors.getIsLoggedIn);

    if (!isLoggedIn) {
      return <Redirect to="/login" />;
    }

    return <Component {...props} />;
  };
}
