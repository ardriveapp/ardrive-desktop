import { combineReducers } from "@reduxjs/toolkit";

import * as appSlice from "./app";
import * as authSlice from "./auth";

import { RootState } from "../types";

export default combineReducers<RootState>({
	app: appSlice.reducer,
	auth: authSlice.reducer,
});
