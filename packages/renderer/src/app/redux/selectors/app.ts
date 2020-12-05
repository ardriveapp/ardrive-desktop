import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../types";

const getAppState = (state: RootState) => state.app;

const getFiles = createSelector(getAppState, (app) => app.files);

export default { getAppState, getFiles };
