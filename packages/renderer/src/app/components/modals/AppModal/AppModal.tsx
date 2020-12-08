import React from "react";
import { useModal } from "../utils";

import {
  AppModalContainer,
  AppModalWindowBody,
  AppModalWindowContainer,
  AppModalWindowFooter,
  AppModalWindowHeader,
  AppModalWindowHeaderText,
  CloseButton,
} from "./AppModal.styled";
import { MoveToModal, NewFolderModal } from "./Variants";

export const AppModalBase: React.FC<{
  visible: boolean;
  title: string;
  body: React.ReactNode;
  footer: React.ReactNode;
  onClose?(): void;
}> = ({ visible, title, body, footer, onClose }) => {
  return (
    <AppModalContainer visible={visible}>
      <AppModalWindowContainer>
        <AppModalWindowHeader>
          <AppModalWindowHeaderText>{title}</AppModalWindowHeaderText>
          <CloseButton onClick={onClose} />
        </AppModalWindowHeader>
        <AppModalWindowBody>{body}</AppModalWindowBody>
        <AppModalWindowFooter>{footer}</AppModalWindowFooter>
      </AppModalWindowContainer>
    </AppModalContainer>
  );
};

export default () => {
  const { modalType, modalVisible, hideModal } = useModal();

  switch (modalType) {
    case "move_to":
      return <MoveToModal visible={modalVisible} onClose={hideModal} />;
    case "new_folder":
      return <NewFolderModal visible={modalVisible} onClose={hideModal} />;
  }

  return null;
};
