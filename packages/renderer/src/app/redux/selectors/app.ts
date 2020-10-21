import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../types";

const getAppState = (state: RootState) => state.app;

const getOpenFilePath = createSelector(
  getAppState,
  (auth) => auth.openFilePath
);

export default { getOpenFilePath };
