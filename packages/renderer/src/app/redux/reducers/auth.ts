import { createReducer } from "@reduxjs/toolkit";

import { authActions } from "../actions";
import { AuthState } from "../types";

const initialState: AuthState = {
  isLoggedIn: false,
};

export default createReducer(initialState, (builder) => {
  builder.addCase(authActions.loginSuccess, (state, _) => ({
    ...state,
    isLoggedIn: true,
  }));
  builder.addCase(authActions.logout, (state, _) => ({
    ...state,
    isLoggedIn: false,
  }));
});
