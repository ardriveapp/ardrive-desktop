import { ipcMain, dialog, BrowserWindow } from "electron";

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

  ipcMain.handle(
    "changeWindowSize",
    async (_, width: number, height: number) => {
      const [currentWidth, currentHeight] = window.getSize();
      if (currentWidth !== width && currentHeight !== height) {
        window.setSize(width, height, true);
      }
    }
  );
};
