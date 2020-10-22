import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../types";

const getAppState = (state: RootState) => state.app;

const getOpenedFilePath = (name: string) =>
  createSelector(getAppState, (app) => app.openedFiles[name]);

const getOpenedFolderPath = (name: string) =>
  createSelector(getAppState, (app) => app.openedFolders[name]);

export default { getOpenedFilePath, getOpenedFolderPath };
