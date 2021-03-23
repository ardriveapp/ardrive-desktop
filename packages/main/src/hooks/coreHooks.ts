import fs from "fs";
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
	uploadArDriveFiles,
	getWalletBalance,
	backupWallet,
	createNewPrivateDrive,
	createNewPublicDrive,
	addSharedPublicDrive,
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
		}, 10000);
	}

	async function getAllDrives(user: ArDriveUser) {
		const publicDrives = await getAllMyPublicArDriveIds(user.walletPublicKey);
		const privateDrives = await getAllMyPrivateArDriveIds(user);
		return publicDrives.concat(privateDrives);
	}

	ipcMain.handle("startWatchingFolders", async (_, login: string) => {
		const user = await getUserFromProfile(login);

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

			if (result === "Success") {
				const allDrives = await getAllDrives(user);
				for (const drive of allDrives) {
					await addDriveToDriveTable({
						...drive,
						login: user.login,
					});
				}
				return true;
			}

			return false;
		}
	);

	/**
	* Updates user's sync directory
	*/
	ipcMain.handle(
		"updateUserSyncDir",
		async (_, syncFolderPath: string, login: string, password: string) => {
			const user: ArDriveUser = await getUser(password, login);
			if (user) {
				user.syncFolderPath = syncFolderPath;
				// TODO: We need updateUser method
				await addNewUser(password, user);
			}
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

	ipcMain.handle("getAllDrives", async (_, login: string, password: string) => {
		const user: ArDriveUser = await getUser(password, login);
		const drives = await getAllDrives(user);
		return drives.map((drive) => ({
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
			const user = await getUser(password, login);
			if (isShared) {
				await addSharedPublicDrive(user, driveId);
				return;
			}
			const allDrives = await getAllDrives(user);
			const drive = allDrives.find((drive) => drive.driveId === driveId);
			if (drive != null) {
				await addDriveToDriveTable({
					...drive,
					login: user.login,
				});
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
