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
  loginSuccess: createAction("AUTH_LOGIN_SUCCESS"),
  logout: createAction("AUTH_LOGOUT"),
  createUser: createAction(
    "AUTH_USER_CREATE",
    (
      username: string,
      password: string,
      syncFolderPath: string,
      walletPath: string
    ) => ({
      payload: {
        username: username,
        password: password,
        syncFolderPath: syncFolderPath,
        walletPath: walletPath,
      },
    })
  ),
};
