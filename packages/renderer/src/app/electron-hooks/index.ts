import { appActions } from "app/redux/slices/app";
import { ipcRenderer } from "electron";

import CoreHooks from "./coreHooks";
import NativeHooks from "./nativeHooks";
import { ElectronHooks } from "./types";

export default (): ElectronHooks => {
  return {
    core: new CoreHooks(ipcRenderer),
    native: new NativeHooks(ipcRenderer),
    middleware: (store) => {
      ipcRenderer.on("notifyUploadStatus", (_, uploadBatch: any) => {
        store.dispatch(
          appActions.processUpdateFromMainProcess({
            actionName: "notifyUploadStatus",
            payload: uploadBatch,
          })
        );
      });
      return (next) => (action) => next(action);
    },
  };
};
