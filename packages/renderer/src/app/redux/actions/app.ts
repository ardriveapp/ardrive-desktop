import { createAction } from "@reduxjs/toolkit";

import { withPayloadType } from "../../utils";

export default {
  initializeApplication: createAction(
    "APPLICATION_INITIALIZE",
    withPayloadType<boolean>()
  ),
  openFile: createAction("FILE_OPEN"),
  openFileSuccess: createAction("FILE_OPEN_SUCCESS", withPayloadType<string>()),
};
