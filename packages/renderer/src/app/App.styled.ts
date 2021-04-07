import { createGlobalStyle } from 'styled-components';

import 'fontsource-montserrat';
import 'fontsource-open-sans';

export const GlobalStyle = createGlobalStyle`
	* {
		box-sizing: border-box;
		user-select: none;
	}

	body {
		padding: 0 !important;
		margin: 0 !important;
		font-family: "Montserrat";
	}

	#root {
		height: 100vh;
		width: 100vw;
		white-space: pre-line;
	}
`;
