import { combineReducers } from "@reduxjs/toolkit";

import appReducer from "../reducers/app";
import { RootState } from "../types";

export default combineReducers<RootState>({
  app: appReducer,
});
