import { ipcMain } from "electron";
import {
  passwordCheck,
  getUser,
  getLocalWallet,
  addNewUser,
  setupDatabase,
  startWatchingFolders,
} from "ardrive-core-js";
import { ArDriveUser } from "ardrive-core-js/lib/types";
import { Path } from "typescript";

const dbName = ".ardrive-desktop.db";

export const initialize = () => {
  ipcMain.handle("setupDatabase", async (_) => {
    await setupDatabase(`./${dbName}`);
  });

  ipcMain.handle("login", async (_, username: string, password: string) => {
    const passwordResult: boolean = await passwordCheck(password, username);
    if (passwordResult) {
      const user = await getUser(password, username);
      startWatchingFolders(user);

      return {
        result: true,
        user: user,
      };
    }
    return {
      result: false,
    };
  });

  ipcMain.handle(
    "createNewUser",
    async (
      _,
      username: string,
      password: string,
      syncFolderPath: string,
      walletPath: string
    ) => {
      const wallet = await getLocalWallet(walletPath as Path);
      const user: ArDriveUser = {
        login: username,
        dataProtectionKey: password,
        syncFolderPath: syncFolderPath,
        ...wallet,
      };
      const result = await addNewUser(password, user);
      return result === "Success";
    }
  );
};
