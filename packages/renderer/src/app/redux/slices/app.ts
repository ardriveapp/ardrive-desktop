import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ElectronHooks, WindowType } from "app/electron-hooks/types";
import { withPayloadType } from "app/utils";
import { AppState, UploadNotification } from "../types";
import { authActions } from "./auth";

const initialState: AppState = {
  files: [],
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
      }));
    });
    builder.addCase(appActions.addUploadNotification, (state, action) => {
      state.uploadNotification = action.payload;
    });
    builder.addCase(authActions.logout.fulfilled, (state, _) => {
      state.uploadNotification = undefined;
      state.files = [];
    });
  },
});

export const reducer = appSlice.reducer;
