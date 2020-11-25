import { createReducer } from "@reduxjs/toolkit";

import { AppState } from "../types";

const initialState: AppState = {
  files: [],
};

export default createReducer(initialState, (_) => {});
