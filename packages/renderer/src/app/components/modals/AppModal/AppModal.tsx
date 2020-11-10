import React from "react";

import {
  AppModalContainer,
  AppModalWindowBody,
  AppModalWindowContainer,
  AppModalWindowFooter,
  AppModalWindowHeader,
  AppModalWindowHeaderText,
  CloseButton,
} from "./AppModal.styled";

const AppModal: React.FC<{
  visible: boolean;
  title: string;
  body: React.ReactNode;
  footer: React.ReactNode;
  onClose(): void;
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

export default AppModal;
