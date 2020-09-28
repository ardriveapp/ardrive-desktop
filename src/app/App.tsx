import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Routes from "./configuration/routes";

export default () => {
  return (
    <BrowserRouter>
      <Switch>
        {Routes.map((routeProps) => (
          <Route {...routeProps} />
        ))}
      </Switch>
    </BrowserRouter>
  );
};
