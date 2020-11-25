import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ElectronHooks, WindowType } from "app/electron-hooks/types";

import { withPayloadType } from "app/utils";

export default {
  initializeApplication: createAction("APP_APPLICATION_INITIALIZE"),
  changeWindowSize: createAction(
    "APP_CHANGE_WINDOW_SIZE",
    withPayloadType<{
      windowType: WindowType;
    }>()
  ),
  openFile: createAsyncThunk("FILE_OPEN", async (_, thunkAPI) => {
    const electronHooks = thunkAPI.extra as ElectronHooks;
    const path = await electronHooks.native.openFile();
    return path;
  }),
  openFolder: createAsyncThunk("FOLDER_OPEN", async (_, thunkAPI) => {
    const electronHooks = thunkAPI.extra as ElectronHooks;
    const path = await electronHooks.native.openFolder();
    return path;
  }),
};
