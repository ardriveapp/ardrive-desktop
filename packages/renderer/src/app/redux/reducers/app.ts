import { createReducer } from "@reduxjs/toolkit";

import { appActions } from "../actions";
import { AppState } from "../types";

const initialState: AppState = {
  initialized: false,
};

export default createReducer(initialState, (builder) => {
  builder.addCase(appActions.initializeApplication, (state, action) => ({
    ...state,
    initialized: action.payload,
  }));
});
