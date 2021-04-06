import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ArDrive, ElectronHooks, WindowType } from "app/electron-hooks/types";
import { withPayloadType } from "app/utils";
import { AppState, UploadNotification } from "../types";
import { authActions } from "./auth";

const initialState: AppState = {
	files: [],
	drives: [],
	users: 0,
	uploadNotification: undefined,
};

export const appActions = {
	openFile: createAsyncThunk("app/openFile", async (_, thunkAPI) => {
		const electronHooks = thunkAPI.extra as ElectronHooks;
		const path = await electronHooks.native.openFile();
		return path;
	}),
	openFolder: createAsyncThunk("app/openFolder", async (_, thunkAPI) => {
		const electronHooks = thunkAPI.extra as ElectronHooks;
		const path = await electronHooks.native.openFolder();
		return path;
	}),
	fetchFiles: createAsyncThunk(
		"app/fetchFiles",
		async (username: string, thunkAPI) => {
			const electronHooks = thunkAPI.extra as ElectronHooks;
			const files = await electronHooks.core.fetchFiles(username);
			return files;
		}
	),
	changeWindowSize: createAsyncThunk(
		"app/changeWindowSize",
		async (windowType: WindowType, thunkAPI) => {
			const electronHooks = thunkAPI.extra as ElectronHooks;
			await electronHooks.native.changeWindowSize(windowType);
		}
	),
	processUpdateFromMainProcess: createAction(
		"app/processUpdateFromMainProcess",
		withPayloadType<{
			actionName: string;
			payload: any;
		}>()
	),
	addUploadNotification: createAction(
		"app/addUploadNotification",
		withPayloadType<UploadNotification>()
	),
	uploadFiles: createAsyncThunk<
		void,
		{
			login: string;
			password: string;
		}
	>("app/uploadFiles", async (payload, thunkAPI) => {
		const electronHooks = thunkAPI.extra as ElectronHooks;
		await electronHooks.core.uploadFiles(payload.login, payload.password);
	}),
	openSyncFolder: createAction("app/openSyncFolder"),
	createNewDrive: createAsyncThunk<
		void,
		{
			login: string;
			driveName: string;
			isPrivate: boolean;
		}
	>("app/createNewDrive", async (payload, thunkAPI) => {
		const electronHooks = thunkAPI.extra as ElectronHooks;
		await electronHooks.core.createNewDrive(
			payload.login,
			payload.driveName,
			payload.isPrivate
		);
	}),
	getAllDrives: createAsyncThunk<
		Array<ArDrive>,
		{
			login: string;
			password: string;
		}
	>("app/getAllDrives", async (payload, thunkAPI) => {
		const electronHooks = thunkAPI.extra as ElectronHooks;
		return await electronHooks.core.getAllDrives(
			payload.login,
			payload.password
		);
	}),
	attachDrive: createAsyncThunk<
		void,
		{
			login: string;
			password: string;
			driveId: string;
			isShared: boolean;
		}
	>("app/attachDrive", async (payload, thunkAPI) => {
		const electronHooks = thunkAPI.extra as ElectronHooks;
		await electronHooks.core.attachDrive(
			payload.login,
			payload.password,
			payload.driveId,
			payload.isShared
		);
	}),
	openCommunityLink: createAsyncThunk(
		"app/openCommunityLink",
		async (_, thunkAPI) => {
			const electronHooks = thunkAPI.extra as ElectronHooks;
			await electronHooks.native.openCommunityLink();
		}
	),
	openHelpLink: createAsyncThunk("app/openHelpLink", async (_, thunkAPI) => {
		const electronHooks = thunkAPI.extra as ElectronHooks;
		await electronHooks.native.openHelpLink();
	}),
	openCustomLink: createAsyncThunk(
		"app/openCustomLink",
		async (link: string | undefined, thunkAPI) => {
			const electronHooks = thunkAPI.extra as ElectronHooks;
			await electronHooks.native.openCustomLink(link);
		}
	),
	openUsageLink: createAsyncThunk("app/openUsageLink", async (_, thunkAPI) => {
		const electronHooks = thunkAPI.extra as ElectronHooks;
		await electronHooks.native.openUsageLink();
	}),
	getAllUsers: createAsyncThunk("app/getAllUsers", async (_, thunkAPI) => {
		const electronHooks = thunkAPI.extra as ElectronHooks;
		return await electronHooks.core.getAllUsers();
	}),
	uploadFile: createAction(
		"app/fileUpload",
		withPayloadType<any[]>()
	)
	// uploadFile: createAsyncThunk<
	// 	string[],
	// 	{
	// 		login: string;
	// 		password: string;
	// 		filesContent: any[];
	// 		types: any[];
	// 	}
	// >("app/uploadFile", async (payload, thunkAPI) => {
	// 	const electronHooks = thunkAPI.extra as ElectronHooks;
	// 	const id = await electronHooks.core.uploadFile(
	// 		payload.login,
	// 		payload.password,
	// 		payload.filesContent,
	// 		payload.types
	// 	)
	// 	return id;
	// })
};
const getFileStatus = (fileDataSyncStatus: number) => {
	if (fileDataSyncStatus === 1) {
		return "downloaded";
	}
	if (fileDataSyncStatus === 2) {
		return "syncing";
	}
	if (fileDataSyncStatus === 3) {
		return "uploaded";
	}
};

const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(appActions.fetchFiles.fulfilled, (state, action) => {
			state.files = action.payload.map((file) => ({
				id: file.id,
				name: file.fileName,
				type: file.entityType === "folder" ? "folder" : "file",
				modifiedDate: file.lastModifiedDate,
				owner: file.login,
				location: file.filePath,
				size: file.fileSize,
				driveName: file.drive?.driveName,
				syncStatus: getFileStatus(+file.fileDataSyncStatus),
				webLink: file.permaWebLink,
			}));
		});
		// builder.addCase(appActions.uploadFile.fulfilled, (state, action) => {
		// state.files = action.payload.map((file) => ({
		// 	id: file.id,
		// 	name: file.fileName,
		// 	type: file.entityType === "folder" ? "folder" : "file",
		// 	modifiedDate: file.lastModifiedDate,
		// 	owner: file.login,
		// 	location: file.filePath,
		// 	size: file.fileSize,
		// 	driveName: file.drive?.driveName,
		// 	syncStatus: getFileStatus(+file.fileDataSyncStatus),
		// 	webLink: file.permaWebLink,
		// }));
		// });
		builder.addCase(appActions.uploadFile, (state, action) => {
			for (let file of action.payload) {
				state.files.push({
					type: 'file',
					name: file.name,
					id: 'testId',
					modifiedDate: file.lastModifiedDate,
					owner: 'test',
					location: file.webkitRelativePath,
					size: file.size
				})
			}
		})
		builder.addCase(appActions.addUploadNotification, (state, action) => {
			state.uploadNotification = action.payload;
		});
		builder.addCase(appActions.getAllUsers.fulfilled, (state, action) => {
			state.users = action.payload;
		})
		builder.addCase(appActions.getAllDrives.fulfilled, (state, action) => {
			state.drives = action.payload;
		});
		builder.addCase(authActions.logout.fulfilled, (state, _) => {
			state.uploadNotification = undefined;
			state.files = [];
		});
	},
});

export const reducer = appSlice.reducer;
