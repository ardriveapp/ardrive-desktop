import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";
import createElectronStorage from "redux-persist-electron-storage";
import { ipcRenderer } from "electron";

import rootReducer from "./reducers";
import rootSaga from "./sagas";
import electronHooks from "../electron-hooks";

const sagaMiddleware = createSagaMiddleware({
  context: {
    electronHooks: electronHooks(ipcRenderer),
  },
});

const persistConfig = {
  key: "root",
  storage: createElectronStorage(),
  blacklist: ["app", "auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  enhancers: (defaultEnhancers) => [
    ...defaultEnhancers,
    applyMiddleware(sagaMiddleware),
  ],
});

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);
