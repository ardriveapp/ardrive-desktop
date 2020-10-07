import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";

import Routes from "./configuration/routes";
import { GlobalStyle } from "./App.styled";
import { store } from "./redux";

import "./configuration/i18n";

export default () => {
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <HashRouter>
          <Switch>
            {Routes.map((routeProps, index) => (
              <Route key={index} {...routeProps} />
            ))}
          </Switch>
        </HashRouter>
      </Provider>
    </>
  );
};
