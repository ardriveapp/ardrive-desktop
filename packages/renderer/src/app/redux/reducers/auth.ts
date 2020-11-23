import { createReducer } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import createElectronStorage from "redux-persist-electron-storage";

import { authActions } from "../actions";
import { AuthState } from "../types";

const initialState: AuthState = {
  isLoggedIn: false,
  isFirstLaunch: true,
  user: null,
};

export default persistReducer(
  {
    key: "auth",
    storage: createElectronStorage(),
    blacklist: ["isLoggedIn"],
  },
  createReducer(initialState, (builder) => {
    builder.addCase(authActions.loginSuccess, (state, action) => ({
      ...state,
      isLoggedIn: true,
      isFirstLaunch: false,
      user: action.payload.user,
    }));
    builder.addCase(authActions.logout, (state, _) => ({
      ...state,
      isLoggedIn: false,
      user: null,
    }));
  })
);
