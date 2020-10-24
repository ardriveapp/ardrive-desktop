import React, { useEffect, useMemo } from "react";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { MainRoutes, LoginRoutes } from "./configuration/routes";
import { GlobalStyle } from "./App.styled";
import { appActions } from "./redux/actions";
import { authSelectors } from "./redux/selectors";
import { store, persistor } from "./redux";

import "./configuration/i18n";

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(authSelectors.getIsLoggedIn);

  useEffect(() => {
    dispatch(appActions.initializeApplication());
  }, [dispatch]);

  const Routes = useMemo(() => {
    const main = MainRoutes.map((routeProps, index) => (
      <Route key={index} {...routeProps} />
    ));
    const login = LoginRoutes.map((routeProps, index) => (
      <Route key={index} {...routeProps} />
    ));
    return isLoggedIn ? main : login;
  }, [isLoggedIn]);

  return (
    <HashRouter>
      <Switch>
        {Routes}
        <Redirect from="*" to="/" />
      </Switch>
    </HashRouter>
  );
};

export default () => {
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </>
  );
};
