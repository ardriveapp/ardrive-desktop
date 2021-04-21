import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../types';

const getAuthState = (state: RootState) => state.auth;

const getIsLoggedIn = createSelector(getAuthState, (auth) => auth.isLoggedIn);

const getIsDuplicated = createSelector(getAuthState, (auth) => auth.isDuplicated);

const getIsFirstLaunch = createSelector(getAuthState, (auth) => auth.isFirstLaunch);

const getUser = createSelector(getAuthState, (auth) => auth.user);

const getIsSyncing = createSelector(getAuthState, (auth) => auth.isSyncing);

export default {
	getIsLoggedIn,
	getIsFirstLaunch,
	getUser,
	getIsSyncing,
	getIsDuplicated
};
