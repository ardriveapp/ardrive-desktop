import { withSubroutes } from "app/utils/reactHOCs";
import { RouteProps } from "react-router-dom";

import { Home, Login, CreateUser, Welcome, PrivateDrive } from "../pages";

export const HomeRoutes: RouteProps[] = [
	{
		component: withSubroutes(Home, [
			{
				exact: true,
				path: "/",
				component: PrivateDrive,
			},
			{
				path: "/public-drive",
				component: () => null,
			},
			{
				path: "/uploads",
				component: () => null,
			},
			{
				path: "/shared",
				component: () => null,
			},
		]),
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
		path: "/create-user",
		component: CreateUser,
	},
];
