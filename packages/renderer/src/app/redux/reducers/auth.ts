import { createReducer } from "@reduxjs/toolkit";

import { authActions } from "../actions";
import { AuthState } from "../types";

const initialState: AuthState = {
  isLoggedIn: false,
};

export default createReducer(initialState, (builder) => {
  builder.addCase(authActions.loginStart, (state, action) => ({
    ...state,
  }));
});
