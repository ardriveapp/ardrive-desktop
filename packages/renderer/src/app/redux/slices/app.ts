import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ElectronHooks, WindowType } from "app/electron-hooks/types";
import { AppState } from "../types";

const initialState: AppState = {
  files: [],
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
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(appActions.fetchFiles.fulfilled, (state, action) => {
      state.files = action.payload.map((file) => ({
        name: file.fileName,
        type: file.type === "folder" ? "folder" : "file",
        modifiedDate: new Date(file.lastModifiedDate),
        size: file.fileSize,
      }));
    });
  },
});

export const actions = appSlice.actions;
export const reducer = appSlice.reducer;
