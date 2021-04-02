import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';

import { GlobalStyle } from './App.styled';
import { store, persistor } from './redux';
import { AppRoutes } from './components';

import './configuration/i18n';
import { MainTheme } from './configuration/themes';

export default () => {
	return (
		<>
			<GlobalStyle />
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<ThemeProvider theme={MainTheme}>
						<AppRoutes />
					</ThemeProvider>
				</PersistGate>
			</Provider>
		</>
	);
};
