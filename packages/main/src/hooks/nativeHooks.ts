import { ipcMain, dialog, BrowserWindow } from "electron";

import { Sizes } from "../config";
import { WindowType } from "../types";

export const initialize = (window: BrowserWindow) => {
  ipcMain.handle("openFile", async (_) => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
    });
    return result;
  });

  ipcMain.handle("openFolder", async (_) => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    return result;
  });

  ipcMain.handle("changeWindowSize", async (_, windowType: WindowType) => {
    switch (windowType) {
      case "desktop":
      case "mobile":
        window.setSize(Sizes[windowType].width, Sizes[windowType].height, true);
        return;
      default:
        return;
    }
  });
};
