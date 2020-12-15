import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../types";

const getAppState = (state: RootState) => state.app;

const getFiles = createSelector(getAppState, (app) => app.files);

const getUploadNotification = createSelector(
  getAppState,
  (app) => app.uploadNotification
);

const getAllDrives = createSelector(getAppState, (app) => app.drives);

export default { getAppState, getFiles, getUploadNotification, getAllDrives };
