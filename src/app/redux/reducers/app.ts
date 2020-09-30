import { createReducer } from "@reduxjs/toolkit";

import { appActions } from "../actions";
import { AppState } from "../types";

const initialState: AppState = {
  initialized: false,
  counter: 0,
};

export default createReducer(initialState, (builder) => {
  builder.addCase(appActions.initializeApplication, (state, action) => ({
    ...state,
    initialized: action.payload,
  }));
  builder.addCase(appActions.click, (state) => ({
    ...state,
    counter: state.counter + 1,
  }));
});
