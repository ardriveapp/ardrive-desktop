import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { setupDatabase } from 'ardrive-core-js';

import { initializeHooks } from './hooks';
import { Sizes, DbName } from './config';

const startApplication = async () => {
	await setupDatabase(`./${DbName}`);

	const window = new BrowserWindow({
		...Sizes['desktop'],
		icon: isDev ? `${__dirname}/../assets/icon.png` : undefined,
		title: 'ArDrive',
		resizable: false,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			webSecurity: false
		}
	});
	window.setMenuBarVisibility(false);

	if (isDev) {
		window.loadURL('http://localhost:3000');
	} else {
		window.loadFile(`${__dirname}/renderer/index.html`);
	}

	initializeHooks([window], [window]);
};

app.on('ready', startApplication);
