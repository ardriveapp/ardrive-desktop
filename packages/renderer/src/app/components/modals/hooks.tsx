import React from "react";
import { useState } from "react";

import { AppModal } from "./AppModal";
import { AppModalContext, ModalType } from "./utils";

export const withModal = (Component: React.ComponentType) => (props: any) => {
  const [modalType, setModalType] = useState<ModalType>();

  return (
    <AppModalContext.Provider
      value={{
        showModal: setModalType,
        modalVisible: modalType != null,
        hideModal: () => setModalType(undefined),
        modalType: modalType,
      }}
    >
      <AppModal />
      <Component {...props} />
    </AppModalContext.Provider>
  );
};
