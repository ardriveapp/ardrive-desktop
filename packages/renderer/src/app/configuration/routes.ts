import { RouteProps } from "react-router-dom";

import { Home, Login, CreateUser, Welcome } from "../pages";

export const MainRoutes: RouteProps[] = [
  {
    exact: true,
    path: "/",
    component: Home,
  },
];

export const LoginRoutes: RouteProps[] = [
  {
    exact: true,
    path: "/",
    component: Welcome,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/create-user",
    component: CreateUser,
  },
];
