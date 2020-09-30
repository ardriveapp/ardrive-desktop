import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import rootReducer from "./reducers";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

export default configureStore({
  reducer: rootReducer,
  enhancers: (defaultEnhancers) => [
    ...defaultEnhancers,
    applyMiddleware(sagaMiddleware),
  ],
});

sagaMiddleware.run(rootSaga);
