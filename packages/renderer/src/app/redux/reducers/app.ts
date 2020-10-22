import { createReducer } from "@reduxjs/toolkit";

import { appActions } from "../actions";
import { AppState } from "../types";

const initialState: AppState = {
  initialized: false,
  openedFiles: {},
  openedFolders: {},
};

export default createReducer(initialState, (builder) => {
  builder.addCase(appActions.initializeApplication, (state, action) => ({
    ...state,
    initialized: action.payload,
  }));
  builder.addCase(appActions.openFileSuccess, (state, action) => ({
    ...state,
    openedFiles: {
      ...state.openedFiles,
      [action.payload.name]: action.payload.path,
    },
  }));
  builder.addCase(appActions.openFolderSuccess, (state, action) => ({
    ...state,
    openedFolders: {
      ...state.openedFolders,
      [action.payload.name]: action.payload.path,
    },
  }));
});
