import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import rootReducer from "./reducers";
import rootSaga from "./sagas";
import electronHooks from "../electron-hooks";

const { ipcRenderer } = window.require("electron");

const sagaMiddleware = createSagaMiddleware({
  context: {
    electronHooks: electronHooks(ipcRenderer),
  },
});

export const store = configureStore({
  reducer: rootReducer,
  enhancers: (defaultEnhancers) => [
    ...defaultEnhancers,
    applyMiddleware(sagaMiddleware),
  ],
});

sagaMiddleware.run(rootSaga);
