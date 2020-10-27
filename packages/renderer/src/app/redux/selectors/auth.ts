import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../types";

const getAuthState = (state: RootState) => state.auth;

const getIsLoggedIn = createSelector(getAuthState, (auth) => auth.isLoggedIn);

const getIsFirstLaunch = createSelector(getAuthState, (auth) => auth.isFirstLaunch);

export default {
  getIsLoggedIn,
  getIsFirstLaunch,
};
