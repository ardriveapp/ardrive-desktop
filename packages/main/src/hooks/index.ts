import { ipcMain } from "electron";

import { passwordCheck } from "ardrive-core-js";

ipcMain.handle("login", async (_, username: string, password: string) => {
  const passwordResult: boolean = await passwordCheck(password, username);
  if (passwordResult) {
    return true;
  }
  return false;
});
