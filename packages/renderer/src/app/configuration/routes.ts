import { RouteProps } from "react-router-dom";

import { Home, Login, CreateUser, Welcome, HowItWork } from "../pages";

export const HomeRoutes: RouteProps[] = [
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

export const WelcomeRoutes: RouteProps[] = [
  {
    exact: true,
    path: "/",
    component: Welcome,
  },
  {
    path: "/how-it-work",
    component: HowItWork,
  },
  {
    path: "/create-user",
    component: CreateUser,
  },
];
