import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import createElectronStorage from "redux-persist-electron-storage";

import { ElectronHooks } from "app/electron-hooks/types";

import { AppUser, AuthState, CreateUserArgs, LoginStartArgs, UpdateUserSyncDirArgs } from "../types";
import { withPayloadType } from "app/utils";

const initialState: AuthState = {
	isLoggedIn: false,
	isFirstLaunch: true,
	user: null,
	isSyncing: true,
};

export const authActions = {
	login: createAction("auth/login", withPayloadType<LoginStartArgs>()),
	loginThunk: createAsyncThunk<AppUser | null, LoginStartArgs>(
		"auth/loginThunk",
		async (payload, thunkAPI) => {
			const electronHooks = thunkAPI.extra as ElectronHooks;
			const { result, user } = await electronHooks.core.login(
				payload.login,
				payload.password
			);
			if (result) {
				return {
					address: user.walletPublicKey,
					login: user.login,
					balance: user.walletBalance,
					password: payload.password, // TODO: Temp solution. Do not store password!
				};
			}
			throw new Error("User does not exist!");
		}
	),
	createUser: createAction(
		"auth/createUser",
		withPayloadType<CreateUserArgs>()
	),
	createUserThunk: createAsyncThunk<void, CreateUserArgs>(
		"auth/createUserThunk",
		async (payload, thunkAPI) => {
			const electronHooks = thunkAPI.extra as ElectronHooks;
			const {
				username,
				password,
				syncFolderPath,
				createNew,
				walletPath,
			} = payload;
			await electronHooks.core.createNewUser(
				username,
				password,
				syncFolderPath,
				createNew,
				walletPath
			);
		}
	),
	updateUserSyncDirThunk: createAsyncThunk<void, UpdateUserSyncDirArgs>(
		"auth/updateUserSyncDirThunk",
		async (payload, thunkAPI) => {
			const electronHooks = thunkAPI.extra as ElectronHooks;
			await electronHooks.core.updateUserSyncDir(
				payload.syncFolderPath,
				payload.login,
				payload.password
			);
		}
	),
	logout: createAsyncThunk("auth/logout", async (_, thunkAPI) => {
		const electronHooks = thunkAPI.extra as ElectronHooks;
		await electronHooks.core.stopWatchingFolders();
	}),
	pauseSyncing: createAsyncThunk("auth/pauseSyncing", async (_, thunkAPI) => {
		const electronHooks = thunkAPI.extra as ElectronHooks;
		await electronHooks.core.stopWatchingFolders();
	}),
	backupWallet: createAsyncThunk<
		void,
		{
			login: string;
			password: string;
		}
	>("app/backupWallet", async (payload, thunkAPI) => {
		const electronHooks = thunkAPI.extra as ElectronHooks;
		await electronHooks.core.backupWallet(payload.login, payload.password);
	}),
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(authActions.loginThunk.fulfilled, (state, action) => {
			if (action.payload != null) {
				state.user = action.payload;
				state.isLoggedIn = true;
				state.isFirstLaunch = false;
			}
		});
		builder.addCase(authActions.logout.fulfilled, (state, _) => {
			state.isLoggedIn = false;
			state.user = null;
		});
		builder.addCase(authActions.pauseSyncing.fulfilled, (state, _) => {
			state.isSyncing = false;
		});
	},
});

export const reducer = persistReducer(
	{
		key: "auth",
		storage: createElectronStorage(),
		blacklist: ["isSyncing", "isLoggedIn", "user"], // TODO: discuss flow
	},
	authSlice.reducer
);
