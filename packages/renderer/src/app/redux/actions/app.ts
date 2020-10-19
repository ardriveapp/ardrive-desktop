import { createAction } from "@reduxjs/toolkit";

import { createAwaitableAction, withPayloadType } from "../../utils";

export default {
  initializeApplication: createAction(
    "APPLICATION_INITIALIZE",
    withPayloadType<boolean>()
  ),
  openFile: createAwaitableAction("FILE_OPEN"),
};
