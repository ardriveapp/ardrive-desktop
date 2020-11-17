import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";

import { initializeHooks } from "./hooks";
import { Sizes } from "./config";

const startApplication = () => {
  const window = new BrowserWindow({
    ...Sizes["desktop"],
    icon: isDev ? `${__dirname}/../assets/icon.png` : undefined,
    title: "ArDrive",
    resizable: false,
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

  initializeHooks([], [window]);
};

app.on("ready", startApplication);
