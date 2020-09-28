const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");

const startApplication = () => {
    const window = new BrowserWindow({
        width: 1024,
        height: 728,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    if (isDev) {
        window.loadURL("http://localhost:3000");
    } else {
        window.loadFile(`${__dirname}/index.html`);
    }
};

app.on("ready", startApplication);