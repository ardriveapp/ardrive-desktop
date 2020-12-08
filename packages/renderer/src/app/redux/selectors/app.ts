import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../types";

const getAppState = (state: RootState) => state.app;

const getFiles = createSelector(getAppState, (app) => app.files);

const getUploadNotification = createSelector(
  getAppState,
  (app) => app.uploadNotification
);

export default { getAppState, getFiles, getUploadNotification };
