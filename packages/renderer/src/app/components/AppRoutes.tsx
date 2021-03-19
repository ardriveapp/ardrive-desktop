import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { appActions } from "app/redux/slices/app";

const prepareRoutes = (routes: RouteProps[]) =>
  routes.map((routeProps, index) => <Route key={index} {...routeProps} />);

export const AppRoutes = () => {
  const isLoggedIn = useSelector(authSelectors.getIsLoggedIn);
  const isFirstLaunch = useSelector(authSelectors.getIsFirstLaunch);
  const user = useSelector(authSelectors.getUser);
  const dispatch = useDispatch();

  const routes = useMemo(() => {
    if (isFirstLaunch && !isLoggedIn) {
      dispatch(appActions.changeWindowSize("desktop"));
      return prepareRoutes(WelcomeRoutes);
    }
    if (!user) {
      dispatch(appActions.changeWindowSize("desktop"));
      return <>
        <Redirect to="/create-user" />
        {prepareRoutes(LoginRoutes)}
      </>
    }
    if (!isLoggedIn) {
      dispatch(appActions.changeWindowSize("desktop"));
      return prepareRoutes(LoginRoutes);
    }
    dispatch(appActions.changeWindowSize("mobile"));
    return prepareRoutes(HomeRoutes);
  }, [isLoggedIn, isFirstLaunch, dispatch, user]);

  return (
    <HashRouter>
      <Switch>
        {routes}
        <Redirect from="*" to="/" />
      </Switch>
    </HashRouter>
  );
};
