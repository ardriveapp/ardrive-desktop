import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";

const startApplication = () => {
  const window = new BrowserWindow({
    width: 1024,
    height: 728,
  });

  if (isDev) {
    window.loadURL("http://localhost:3000");
  } else {
    window.loadFile(`${__dirname}/renderer/index.html`);
  }
};

app.on("ready", startApplication);
