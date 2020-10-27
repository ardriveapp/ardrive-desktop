import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  HashRouter,
  Redirect,
  Route,
  RouteProps,
  Switch,
} from "react-router-dom";

import { authSelectors } from "app/redux/selectors";
import {
  HomeRoutes,
  LoginRoutes,
  WelcomeRoutes,
} from "app/configuration/routes";

const prepareRoutes = (routes: RouteProps[]) =>
  routes.map((routeProps, index) => <Route key={index} {...routeProps} />);

export const AppRoutes = () => {
  const isLoggedIn = useSelector(authSelectors.getIsLoggedIn);
  const isFirstLaunch = useSelector(authSelectors.getIsFirstLaunch);

  const routes = useMemo(() => {
    if (isFirstLaunch && !isLoggedIn) {
      return prepareRoutes(WelcomeRoutes);
    }
    if (!isLoggedIn) {
      return prepareRoutes(LoginRoutes);
    }
    return prepareRoutes(HomeRoutes);
  }, [isLoggedIn, isFirstLaunch]);

  return (
    <HashRouter>
      <Switch>
        {routes}
        <Redirect from="*" to="/" />
      </Switch>
    </HashRouter>
  );
};
