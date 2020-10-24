import { RouteProps } from "react-router-dom";

import { Home, Login, CreateUser } from "../pages";

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
    component: Login,
  },
  {
    path: "/create-user",
    component: CreateUser,
  },
];
