import { createAction } from "@reduxjs/toolkit";

import { withPayloadType } from "../../utils";

export default {
  loginStart: createAction(
    "AUTH_LOGIN_START",
    withPayloadType<boolean>()
  ),
};
