import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Routes from "./configuration/routes";
import { GlobalStyle } from "./App.styled";

export default () => {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Switch>
          {Routes.map((routeProps, index) => (
            <Route key={index} {...routeProps} />
          ))}
        </Switch>
      </BrowserRouter>
    </>
  );
};
