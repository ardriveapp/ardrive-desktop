import React from "react";

import { useTranslationAt } from "app/utils/hooks";

import { ButtonWithIcon, RoundedButton } from "app/components/buttons";
import { AppModalBase } from "../AppModal";

interface ModalProps {
  onClose?(): void;
  visible: boolean;
}

export const MoveToModal: React.FC<ModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslationAt("components.modals.moveTo");

  return (
    <AppModalBase
      onClose={onClose}
      title={t("header")}
      visible={visible}
      body={null}
      footer={[
        <ButtonWithIcon active transparent icon="folder">
          {t("createFolder")}
        </ButtonWithIcon>,
        <RoundedButton>{t("moveFile")}</RoundedButton>,
      ]}
    />
  );
};

export const NewFolderModal: React.FC<ModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslationAt("components.modals.newFolder");

  return (
    <AppModalBase
      onClose={onClose}
      title={t("header")}
      visible={visible}
      body={null}
      footer={[
        <ButtonWithIcon active transparent onClick={onClose}>
          {t("cancel")}
        </ButtonWithIcon>,
        <RoundedButton>{t("create")}</RoundedButton>,
      ]}
    />
  );
};
