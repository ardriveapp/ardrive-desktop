import { ipcMain, dialog, BrowserWindow, shell } from "electron";

import { CommunityLink, HelpLink, Sizes } from "../config";
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
        window.setResizable(true);
        window.setSize(Sizes[windowType].width, Sizes[windowType].height, true);
        window.setResizable(false);
        return;
      default:
        return;
    }
  });

  ipcMain.handle("openCommunityLink", async (_) => {
    await shell.openExternal(CommunityLink);
  });

  ipcMain.handle("openHelpLink", async (_) => {
    await shell.openExternal(HelpLink);
  });

  ipcMain.handle("openCustomLink", async (_, link: string) => {
    if (link) {
      await shell.openExternal(link);
    }
  });
};
