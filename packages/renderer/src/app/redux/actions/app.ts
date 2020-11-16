import { createAction } from "@reduxjs/toolkit";
import { WindowType } from "app/electron-hooks/types";

import { withPayloadType } from "app/utils";

export default {
  initializeApplication: createAction("APP_APPLICATION_INITIALIZE"),
  openFile: createAction("FILE_OPEN", withPayloadType<string>()),
  openFileSuccess: createAction(
    "APP_FILE_OPEN_SUCCESS",
    withPayloadType<{
      name: string;
      path: string;
    }>()
  ),
  openFolder: createAction("FOLDER_OPEN", withPayloadType<string>()),
  openFolderSuccess: createAction(
    "APP_FOLDER_OPEN_SUCCESS",
    withPayloadType<{
      name: string;
      path: string;
    }>()
  ),
  changeWindowSize: createAction(
    "APP_CHANGE_WINDOW_SIZE",
    withPayloadType<{
      windowType: WindowType;
    }>()
  ),
};
