import { appActions } from "app/redux/slices/app";
import { ipcRenderer } from "electron";

import CoreHooks from "./coreHooks";
import NativeHooks from "./nativeHooks";
import { ElectronHooks } from "./types";

export default (): ElectronHooks => {
  return {
    core: CoreHooks(ipcRenderer),
    native: NativeHooks(ipcRenderer),
    middleware: (store) => (next) => (action) => {
      ipcRenderer.on("notifyUploadStatus", (_, uploadBatch: any) => {
        store.dispatch(appActions.processUpdateFromMainProcess(uploadBatch));
      });
      return next(action);
    },
  };
};
