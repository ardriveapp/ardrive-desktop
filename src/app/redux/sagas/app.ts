import { takeLatest } from "redux-saga/effects";

import { appActions } from "../actions";

function* clickSaga() {}

export default function* () {
  yield takeLatest(appActions.click.type, clickSaga);
}
