import React from "react";

import { useTranslationAt } from "app/utils/hooks";

import { AppModal } from "../AppModal";
import { ButtonWithIcon, RoundedButton } from "app/components/buttons";

interface ModalProps {
  onClose(): void;
  visible: boolean;
}

export const MoveToModal: React.FC<ModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslationAt("components.modals.moveTo");

  return (
    <AppModal
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
    <AppModal
      onClose={onClose}
      title={t("header")}
      visible={visible}
      body={null}
      footer={[
        <ButtonWithIcon active transparent>
          {t("cancel")}
        </ButtonWithIcon>,
        <RoundedButton>{t("create")}</RoundedButton>,
      ]}
    />
  );
};
