import { createReducer } from "@reduxjs/toolkit";

import { appActions } from "../actions";
import { AppState } from "../types";

const initialState: AppState = {
  openedFiles: {},
  openedFolders: {},
};

export default createReducer(initialState, (builder) => {
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
