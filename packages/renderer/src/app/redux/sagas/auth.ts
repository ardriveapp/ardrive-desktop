import {
  all,
  call,
  getContext,
  putResolve,
  select,
  takeLatest,
} from "redux-saga/effects";

import { ElectronHooks } from "app/electron-hooks/types";
import { AppUser, CreateUserArgs, LoginStartArgs } from "../types";
import { authActions } from "../slices/auth";
import { authSelectors } from "../selectors";

function* startWatchingSaga(action?: any) {
  let user: AppUser | null = action?.payload;

  if (user == null) {
    user = yield select(authSelectors.getUser);
  }
  if (user != null) {
    const electronHooks: ElectronHooks = yield getContext("electronHooks");
    yield call([electronHooks.core, "startWatchingFolders"], user.login);
  }
}

function* loginSaga(action: any) {
  const loginStartArgs: LoginStartArgs = action.payload;

  const result = yield putResolve(
    authActions.loginThunk(loginStartArgs) as any
  );
  yield call(startWatchingSaga, result);
}

function* createUserSaga(action: any) {
  const createUserArgs: CreateUserArgs = action.payload;

  yield putResolve(authActions.createUserThunk(createUserArgs) as any);
  yield call(loginSaga, {
    payload: {
      login: createUserArgs.username,
      password: createUserArgs.password,
    },
  });
}

export default function* () {
  yield all([
    call(startWatchingSaga),
    takeLatest(authActions.login.type, loginSaga),
    takeLatest(authActions.createUser.type, createUserSaga),
  ]);
}
