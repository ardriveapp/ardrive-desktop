import { createAction } from "@reduxjs/toolkit";

import { withPayloadType } from "../../utils";

export default {
  initializeApplication: createAction(
    "APPLICATION_INITIALIZE",
    withPayloadType<boolean>()
  ),
  openFile: createAction("FILE_OPEN", withPayloadType<string>()),
  openFileSuccess: createAction(
    "FILE_OPEN_SUCCESS",
    withPayloadType<{
      name: string;
      path: string;
    }>()
  ),
  openFolder: createAction("FOLDER_OPEN", withPayloadType<string>()),
  openFolderSuccess: createAction(
    "FOLDER_OPEN_SUCCESS",
    withPayloadType<{
      name: string;
      path: string;
    }>()
  ),
};
