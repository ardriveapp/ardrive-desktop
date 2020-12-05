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
  getAllMyPublicArDriveIds,
  getAllMyPrivateArDriveIds,
} from "ardrive-core-js";
import { ArDriveUser } from "ardrive-core-js/lib/types";
import { Path } from "typescript";
import {
  addDriveToDriveTable,
  getAllFilesByLoginFromSyncTable,
} from "ardrive-core-js/lib/db";

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
        autoSyncApproval: 0,
        ...wallet,
      };
      const result = await addNewUser(password, user);

      if (result === "Success") {
        await synchronizeDrives(user);
        return true;
      }

      return false;
    }
  );

  ipcMain.handle("fetchFiles", async (_, username: string) => {
    const allFiles = await getAllFilesByLoginFromSyncTable(username);
    return allFiles;
  });
};

const synchronizeDrives = async (user: ArDriveUser) => {
  const publicDrives = await getAllMyPublicArDriveIds(user.walletPublicKey);

  for (const publicDrive of publicDrives) {
    await addDriveToDriveTable(publicDrive);
  }

  const privateDrives = await getAllMyPrivateArDriveIds(user);

  for (const privateDrive of privateDrives) {
    await addDriveToDriveTable(privateDrive);
  }
};
