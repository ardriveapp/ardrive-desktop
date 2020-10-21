import { createReducer } from "@reduxjs/toolkit";

import { appActions } from "../actions";
import { AppState } from "../types";

const initialState: AppState = {
  initialized: false,
  openFilePath: null,
};

export default createReducer(initialState, (builder) => {
  builder.addCase(appActions.initializeApplication, (state, action) => ({
    ...state,
    initialized: action.payload,
  }));
  builder.addCase(appActions.openFileSuccess, (state, action) => ({
    ...state,
    openFilePath: action.payload,
  }));
});
