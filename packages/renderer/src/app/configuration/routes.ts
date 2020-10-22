import { RouteProps } from "react-router-dom";

import { Home, Login, CreateUser } from "../pages";
import { withProtection } from "../utils/reactUtils";

const Routes: RouteProps[] = [
  {
    exact: true,
    path: "/",
    component: withProtection(Home),
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/create-user",
    component: CreateUser,
  }
];

export default Routes;
