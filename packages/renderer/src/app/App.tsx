import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { GlobalStyle } from "./App.styled";
import { appActions } from "./redux/actions";
import { store, persistor } from "./redux";
import { AppRoutes } from "./components";

import "./configuration/i18n";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appActions.initializeApplication());
  }, [dispatch]);

  return <AppRoutes />;
};

export default () => {
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </>
  );
};
