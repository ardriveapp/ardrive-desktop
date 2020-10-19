import { ipcMain } from "electron";

import { passwordCheck, getUser } from "ardrive-core-js";

ipcMain.handle("login", async (_, username: string, password: string) => {
  const passwordResult: boolean = await passwordCheck(password, username);
  if (passwordResult) {
    return {
      result: true,
      user: await getUser(password, username),
    };
  }
  return {
    result: false,
  };
});

ipcMain.handle("createUser", async (_, username: string, password: string) => {
  const passwordResult: boolean = await passwordCheck(password, username);
  if (passwordResult) {
    return {
      result: true,
      user: await getUser(password, username),
    };
  }
  return {
    result: false,
  };
});
