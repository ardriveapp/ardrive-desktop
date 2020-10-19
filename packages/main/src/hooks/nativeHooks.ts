import { ipcMain, dialog } from "electron";

ipcMain.handle("openFile", async (_) => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
  });
  return result;
});
