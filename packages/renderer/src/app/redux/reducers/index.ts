import { combineReducers } from "@reduxjs/toolkit";

import appReducer from "./app";
import authReducer from "./auth";

import { RootState } from "../types";

export default combineReducers<RootState>({
  app: appReducer,
  auth: authReducer,
});
