import { createReducer } from "@reduxjs/toolkit";

import { authActions } from "../actions";
import { AuthState } from "../types";

const initialState: AuthState = {
  isLoggedIn: false,
  isFirstLaunch: true,
};

export default createReducer(initialState, (builder) => {
  builder.addCase(authActions.loginSuccess, (state, _) => ({
    ...state,
    isLoggedIn: true,
    isFirstLaunch: false,
  }));
  builder.addCase(authActions.logout, (state, _) => ({
    ...state,
    isLoggedIn: false,
  }));
});
