import { ipcMain } from "electron";
import {
  passwordCheck,
  getUser,
  getLocalWallet,
  addNewUser,
  startWatchingFolders,
  setupDrives,
  getMyArDriveFilesFromPermaWeb,
  downloadMyArDriveFiles,
  getUserFromProfile,
} from "ardrive-core-js";
import { ArDriveUser } from "ardrive-core-js/lib/types";
import { Path } from "typescript";

export const initialize = () => {
  ipcMain.handle("startWatchingFolders", async (_, login: string) => {
    const user = await getUserFromProfile(login);

    await setupDrives(user.login, user.syncFolderPath);
    await getMyArDriveFilesFromPermaWeb(user);
    await downloadMyArDriveFiles(user);
    startWatchingFolders(user);
  });

  ipcMain.handle("login", async (_, username: string, password: string) => {
    const passwordResult: boolean = await passwordCheck(password, username);
    if (passwordResult) {
      const user = await getUser(password, username);

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
        autoSyncApproval: 1,
        ...wallet,
      };
      const result = await addNewUser(password, user);
      return result === "Success";
    }
  );
};
