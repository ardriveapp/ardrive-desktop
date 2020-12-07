import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";
import createElectronStorage from "redux-persist-electron-storage";

import rootReducer from "./slices";
import rootSaga from "./sagas";
import electronHooks from "../electron-hooks";

const hooks = electronHooks();
const sagaMiddleware = createSagaMiddleware({
  context: {
    electronHooks: hooks,
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
    applyMiddleware(hooks.middleware),
  ],
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: hooks,
      },
    }),
});

export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store, null, () =>
  sagaMiddleware.run(rootSaga)
);
