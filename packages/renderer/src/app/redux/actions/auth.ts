import { createAction } from "@reduxjs/toolkit";

export default {
  loginStart: createAction(
    "AUTH_LOGIN_START",
    (username: string, password: string) => ({
      payload: {
        username: username,
        password: password,
      },
    })
  ),
};
