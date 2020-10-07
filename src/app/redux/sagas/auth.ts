import { takeLatest } from "redux-saga/effects";

import { authActions } from "../actions";

function* loginStartSaga() {}

export default function* () {
  yield takeLatest(authActions.loginStart.type, loginStartSaga);
}
