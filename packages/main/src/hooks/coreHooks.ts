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
  getWalletBalance,
} from "ardrive-core-js";
import { ArDriveUser, UploadBatch } from "ardrive-core-js/lib/types";
import {
  addDriveToDriveTable,
  getAllFilesByLoginFromSyncTable,
  getDriveFromDriveTable,
} from "ardrive-core-js/lib/db";

import { CancellationToken } from "../types";
import { generateWallet } from "ardrive-core-js/lib/arweave";

export const initialize = (window: BrowserWindow) => {
  let cancellationToken: CancellationToken;

  ipcMain.handle("startWatchingFolders", async (_, login: string) => {
    const user = await getUserFromProfile(login);

    if (user == null) {
      return;
    }

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
      const balance = await getWalletBalance(user.walletPublicKey);

      return {
        result: true,
        user: {
          login: user.login,
          walletPublicKey: user.walletPublicKey,
          walletBalance: balance,
        },
      };
    }
    return {
      result: false,
    };
  });

  ipcMain.handle("stopWatchingFolders", (_) => {
    cancellationToken?.cancel();
  });

  ipcMain.handle(
    "createNewUser",
    async (
      _,
      username: string,
      password: string,
      syncFolderPath: string,
      createNew: boolean,
      walletPath?: string
    ) => {
      const wallet =
        createNew || walletPath == null
          ? await generateWallet()
          : await getLocalWallet(walletPath as Path);

      const user: ArDriveUser = {
        login: username,
        dataProtectionKey: password, // TODO: Pass separate value from user
        syncFolderPath: syncFolderPath,
        autoSyncApproval: 0,
        walletPrivateKey: JSON.stringify(wallet.walletPrivateKey),
        walletPublicKey: wallet.walletPublicKey,
      };
      const result = await addNewUser(password, user);

      return result === "Success";
    }
  );

  ipcMain.handle("fetchFiles", async (_, username: string) => {
    const allFiles = await getAllFilesByLoginFromSyncTable(username);
    for (const file of allFiles) {
      file.drive = await getDriveFromDriveTable(file.driveId);
    }
    return allFiles;
  });

  ipcMain.handle("uploadFiles", async (_, login: string, password: string) => {
    const user: ArDriveUser = await getUser(password, login);
    await uploadArDriveFiles(user);
  });

  ipcMain.handle(
    "getDrives",
    async (_, login: string, driveType: "public" | "private") => {
      const user = await getUserFromProfile(login);

      switch (driveType) {
        case "private":
          return await getAllMyPrivateArDriveIds(user);
        case "public":
          return await getAllMyPublicArDriveIds(user.walletPublicKey);
      }
    }
  );

  ipcMain.handle("attachDrive", async (_, login: string, driveId: string) => {
    const user = await getUserFromProfile(login);
    const allDrives = await getAllDrives(user);
    const drive = allDrives.find((drive) => drive.driveId === driveId);
    if (drive != null) {
      await addDriveToDriveTable({
        ...drive,
        login: user.login,
      });
    }
  });
};

const getAllDrives = async (user: ArDriveUser) => {
  const publicDrives = await getAllMyPublicArDriveIds(user.walletPublicKey);
  const privateDrives = await getAllMyPrivateArDriveIds(user);
  return publicDrives.concat(privateDrives);
};

const startMainWatcherLoop = async (
  window: BrowserWindow,
  user: ArDriveUser,
  token: CancellationToken
) => {
  await setupDrives(user.login, user.syncFolderPath);
  await getMyArDriveFilesFromPermaWeb(user);
  await downloadMyArDriveFiles(user);
  startWatchingFolders(user); // TODO: stop watcher at logout

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
