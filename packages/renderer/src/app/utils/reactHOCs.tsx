import React from "react";
import { Route, RouteProps, Switch } from "react-router-dom";

export const withSubroutes = (
  Component: React.ComponentType<{
    subroutes: JSX.Element;
  }>,
  subroutes: RouteProps[]
) => () => {
  return (
    <Component
      subroutes={
        <Switch>
          {subroutes.map((routeProps, index) => (
            <Route key={index} {...routeProps} />
          ))}
        </Switch>
      }
    />
  );
};
