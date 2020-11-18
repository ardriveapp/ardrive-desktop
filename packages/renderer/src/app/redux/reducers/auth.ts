import { createReducer } from "@reduxjs/toolkit";

import { authActions } from "../actions";
import { AuthState } from "../types";

const initialState: AuthState = {
  isLoggedIn: false,
  isFirstLaunch: true,
  user: null,
};

export default createReducer(initialState, (builder) => {
  builder.addCase(authActions.loginSuccess, (state, action) => ({
    ...state,
    isLoggedIn: true,
    isFirstLaunch: false,
    user: action.payload.user,
  }));
  builder.addCase(authActions.logout, (state, _) => ({
    ...state,
    isLoggedIn: false,
  }));
});
