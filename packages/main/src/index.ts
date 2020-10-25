import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";

import "./hooks";

const startApplication = () => {
  const window = new BrowserWindow({
    width: 580,
    height: 728,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false,
    },
  });
  window.setMenuBarVisibility(false);

  if (isDev) {
    window.loadURL("http://localhost:3000");
  } else {
    window.loadFile(`${__dirname}/renderer/index.html`);
  }
};

app.on("ready", startApplication);