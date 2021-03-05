import { BrowserWindow, ipcMain, dialog, shell } from "electron";
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
  getWalletBalance,
  backupWallet,
  createNewPrivateDrive,
  createNewPublicDrive,
  addSharedPublicDrive,
  uploadArDriveFilesAndBundles,
} from "ardrive-core-js";
import { ArDriveUser, ArFSDriveMetaData, UploadBatch } from "ardrive-core-js/lib/types";
import {
  addDriveToDriveTable,
  getAllFilesByLoginFromSyncTable,
  getAllPersonalDrivesByLoginFromDriveTable,
  getDriveFromDriveTable,
  getProfileLastBlockHeight,
  setDriveToSync,
} from "ardrive-core-js/lib/db";

import { CancellationToken } from "../types";
import { generateWallet } from "ardrive-core-js/lib/arweave";
import { getAllMyPersonalDrives } from "ardrive-core-js/lib/download";

export const initialize = (window: BrowserWindow) => {
  let cancellationToken: CancellationToken;

  async function startWatcher(user: any) {
    if (cancellationToken != null) {
      cancellationToken.cancel();
    }
    cancellationToken = new CancellationToken();
    await startMainWatcherLoop(user);
  }

  async function startMainWatcherLoop(user: ArDriveUser) {
    await setupDrives(user.login, user.syncFolderPath);
    await getMyArDriveFilesFromPermaWeb(user);
    await downloadMyArDriveFiles(user);
    const stopFunction = await startWatchingFolders(user); // TODO: stop watcher at logout

    const intervalId = setInterval(async () => {
      if (cancellationToken.isCancelled) {
        clearInterval(intervalId);
        await stopFunction();
        return;
      }
      await getMyArDriveFilesFromPermaWeb(user);
      await downloadMyArDriveFiles(user);
      await checkUploadStatus(user.login);

      const uploadBatch: UploadBatch = await getPriceOfNextUploadBatch(
        user.login
      );
      window.webContents.send("notifyUploadStatus", uploadBatch);
    }, 15000);
  }

  ipcMain.handle("startWatchingFolders", async (_, login: string, password: string) => {
    const user = await getUser(password, login);

    if (user == null) {
      return;
    }

    await startWatcher(user);
  });

  ipcMain.handle("login", async (_, username: string, password: string) => {
    const passwordResult: boolean = await passwordCheck(password, username);
    if (passwordResult) {
      const user = await getUser(password, username);
      const balance = await getWalletBalance(user.walletPublicKey);
      return {
        result: true, user
        /*user: {
          login: user.login,
          walletPublicKey: user.walletPublicKey,
          walletBalance: balance,
        },*/
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
      user.walletPrivateKey = JSON.stringify(wallet.walletPrivateKey)
      user.dataProtectionKey = password;

      if (result === "Success") {
        const drives = await getAllMyPersonalDrives(user);
        // Set all drives to sync by default
        drives.forEach(async (drive: ArFSDriveMetaData) => {
          await setDriveToSync(drive.driveId);
        })
        return true;
      }

      return false;
    }
  );

  ipcMain.handle("fetchFiles", async (_, username: string) => {
    const allFiles = await getAllFilesByLoginFromSyncTable(username);
    const currentDate = new Date();
    const minimumDate = new Date(currentDate);
    minimumDate.setDate(currentDate.getDate() - 3);

    // TODO: Move all that stuff to database query
    const filteredByDate = allFiles.filter(
      (file) => +file.lastModifiedDate >= minimumDate.getTime()
    );
    const orderedByDate = filteredByDate.sort(
      (f, s) => +s.lastModifiedDate - +f.lastModifiedDate
    );

    for (const file of orderedByDate) {
      file.drive = await getDriveFromDriveTable(file.driveId);
    }
    return orderedByDate;
  });

  ipcMain.handle("uploadFiles", async (_, login: string, password: string) => {
    const user: ArDriveUser = await getUser(password, login);
    await uploadArDriveFilesAndBundles(user);
  });

  ipcMain.handle(
    "getDrives",
    async (_, login: string, driveType: "public" | "private") => {
      const user = await getUserFromProfile(login);

      // Get the last block height that has been synced
      let lastBlockHeight = await getProfileLastBlockHeight(user.login)
      console.log ("Last Block Height: ", lastBlockHeight);
      // If undefined, by default we sync from block 0
      if (lastBlockHeight === undefined) {
        lastBlockHeight = 0;
      } else {
        lastBlockHeight = lastBlockHeight.lastBlockHeight;
      }

      switch (driveType) {
        case "private":
          return await getAllMyPrivateArDriveIds(user, lastBlockHeight);
        case "public":
          return await getAllMyPublicArDriveIds(user.login, user.walletPublicKey, lastBlockHeight);
      }
    }
  );

  ipcMain.handle("getAllDrives", async (_, login: string, password: string) => {
    const user: ArDriveUser = await getUser(password, login);
    const drives = await getAllMyPersonalDrives(user);

    // Set all drives to sync by default
    drives.forEach(async (drive: ArFSDriveMetaData) => {
      await setDriveToSync(drive.driveId);
    })

    return drives.map((drive: any) => ({
      id: drive.id,
      driveId: drive.driveId,
      name: drive.driveName,
    }));
  });

  ipcMain.handle(
    "attachDrive",
    async (
      _,
      login: string,
      password: string,
      driveId: string,
      isShared: boolean = false
    ) => {
      const user: ArDriveUser = await getUser(password, login);
      if (isShared) {
        await addSharedPublicDrive(user, driveId);
        return;
      }
      const allDrives = await getAllPersonalDrivesByLoginFromDriveTable(user.login);
      const drive = allDrives.find((drive: any) => drive.driveId === driveId);
      if (drive != null) {
        await addDriveToDriveTable({
          ...drive,
          login: user.login,
        });
        await setDriveToSync(drive.driveId);
        await startWatcher(user);
      }
    }
  );

  ipcMain.handle("backupWallet", async (_, login: string, password: string) => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    if (!result.canceled && result.filePaths.length > 0) {
      const user: ArDriveUser = await getUser(password, login);
      const wallet = {
        walletPrivateKey: JSON.parse(user.walletPrivateKey),
        walletPublicKey: user.walletPublicKey,
      };
      await backupWallet(result.filePaths[0], wallet, login);
    }
  });

  ipcMain.handle("openSyncFolder", async (_, login: string) => {
    const user: ArDriveUser = await getUserFromProfile(login);
    await shell.openPath(user.syncFolderPath);
  });

  ipcMain.handle(
    "createNewDrive",
    async (_, login: string, driveName: string, isPrivate: boolean = true) => {
      const user: ArDriveUser = await getUserFromProfile(login);
      if (isPrivate) {
        const newPrivateDrive = await createNewPrivateDrive(
          user.login,
          driveName
        );
        await addDriveToDriveTable(newPrivateDrive);
      } else {
        const newPublicDrive = await createNewPublicDrive(
          user.login,
          driveName
        );
        await addDriveToDriveTable(newPublicDrive);
      }
      await setupDrives(user.login, user.syncFolderPath);
      await startWatcher(user);
    }
  );
};
