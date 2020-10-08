import { createAction } from "@reduxjs/toolkit";

import { withPayloadType } from "../../utils";

export default {
  initializeApplication: createAction(
    "APPLICATION_INITIALIZE",
    withPayloadType<boolean>()
  ),
};
