import { BrowserWindow, ipcMain } from "electron";
import { Path } from "typescript";
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
  checkUploadStatus,
  getPriceOfNextUploadBatch,
  uploadArDriveFiles,
} from "ardrive-core-js";
import { ArDriveUser, UploadBatch } from "ardrive-core-js/lib/types";
import {
  addDriveToDriveTable,
  getAllFilesByLoginFromSyncTable,
} from "ardrive-core-js/lib/db";

import { CancellationToken } from "../types";

export const initialize = (window: BrowserWindow) => {
  let cancellationToken: CancellationToken;

  ipcMain.handle("startWatchingFolders", async (_, login: string) => {
    const user = await getUserFromProfile(login);

    if (cancellationToken != null) {
      cancellationToken.cancel();
    }
    cancellationToken = new CancellationToken();
    await startMainWatcherLoop(window, user, cancellationToken);
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

  ipcMain.handle("logout", (_) => {
    cancellationToken.cancel();
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

  ipcMain.handle("uploadFiles", async (_, login: string) => {
    const user = await getUserFromProfile(login);
    await uploadArDriveFiles(user);
  });
};

const synchronizeDrives = async (user: ArDriveUser) => {
  // TODO: add these drives from ui
  const publicDrives = await getAllMyPublicArDriveIds(user.walletPublicKey);
  for (const publicDrive of publicDrives) {
    await addDriveToDriveTable({
      ...publicDrive,
      login: user.login,
    });
  }

  // TODO: add these drives from ui
  const privateDrives = await getAllMyPrivateArDriveIds(user);
  for (const privateDrive of privateDrives) {
    await addDriveToDriveTable({
      ...privateDrive,
      login: user.login,
    });
  }
};

const startMainWatcherLoop = async (
  window: BrowserWindow,
  user: ArDriveUser,
  token: CancellationToken
) => {
  await setupDrives(user.login, user.syncFolderPath);
  await getMyArDriveFilesFromPermaWeb(user);
  await downloadMyArDriveFiles(user);
  startWatchingFolders(user);

  const intervalId = setInterval(async () => {
    if (token.isCancelled) {
      clearInterval(intervalId);
      return;
    }
    await getMyArDriveFilesFromPermaWeb(user);
    await downloadMyArDriveFiles(user);
    await checkUploadStatus(user.login);

    const uploadBatch: UploadBatch = await getPriceOfNextUploadBatch(
      user.login
    );
    window.webContents.send("notifyUploadStatus", uploadBatch);
  }, 10000);
};
