import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import createElectronStorage from "redux-persist-electron-storage";

import { ElectronHooks } from "app/electron-hooks/types";

import { AppUser, AuthState } from "../types";
import { withPayloadType } from "app/utils";

const initialState: AuthState = {
  isLoggedIn: false,
  isFirstLaunch: true,
  user: null,
};

type LoginStartArgs = {
  login: string;
  password: string;
};

type CreateUserArgs = {
  username: string;
  password: string;
  syncFolderPath: string;
  walletPath: string;
};

export const authActions = {
  loginStart: createAsyncThunk<AppUser | null, LoginStartArgs>(
    "auth/login",
    async (payload, thunkAPI) => {
      const electronHooks = thunkAPI.extra as ElectronHooks;
      const { result, user } = await electronHooks.core.login(
        payload.login,
        payload.password
      );
      if (result) {
        thunkAPI.dispatch(authActions.startWatching(user));
        return {
          address: user.walletPublicKey,
          login: user.login,
          balance: user.walletBalance,
        };
      }
      throw new Error("User does not exist!");
    }
  ),
  createUser: createAsyncThunk<void, CreateUserArgs>(
    "auth/createUser",
    async (payload, thunkAPI) => {
      const electronHooks = thunkAPI.extra as ElectronHooks;
      const { username, password, syncFolderPath, walletPath } = payload;
      const result = await electronHooks.core.createNewUser(
        username,
        password,
        syncFolderPath,
        walletPath
      );
      if (result) {
        thunkAPI.dispatch(
          authActions.loginStart({ login: username, password })
        );
      }
    }
  ),
  logout: createAsyncThunk("auth/logout", async (_, thunkAPI) => {
    const electronHooks = thunkAPI.extra as ElectronHooks;
    await electronHooks.core.logout();
  }),
  startWatching: createAction("auth/startWatching", withPayloadType<AppUser>()),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(authActions.loginStart.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isFirstLaunch = false;
    });
    builder.addCase(authActions.logout.fulfilled, (state, _) => {
      state.isLoggedIn = false;
      state.user = null;
    });
  },
});

export const reducer = persistReducer(
  {
    key: "auth",
    storage: createElectronStorage(),
  },
  authSlice.reducer
);
