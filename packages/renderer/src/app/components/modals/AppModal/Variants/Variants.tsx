import React, { useCallback, useMemo } from "react";

import { useTranslationAt } from "app/utils/hooks";

import { ButtonWithIcon, RoundedButton } from "app/components/buttons";
import { AppModalBase } from "../AppModal";
import { ArdriveInput } from "app/components/inputs";
import { ArdriveSelect } from "app/components/inputs/ArdriveSelect";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelectors } from "app/redux/selectors";
import { appActions } from "app/redux/slices/app";

interface ModalProps {
  onClose?(): void;
  visible: boolean;
}

enum DriveType {
  Public,
  Private,
}

export const NewDriveModal: React.FC<ModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslationAt("components.modals.newDrive");
  const [driveName, setDriveName] = useState("");
  const [driveType, setDriveType] = useState(DriveType.Public);
  const isFilled = useMemo(() => !!driveName, [driveName]);
  const user = useSelector(authSelectors.getUser);
  const dispatch = useDispatch();

  const createDriveHanlder = useCallback(async () => {
    if (isFilled && user != null) {
      await dispatch(
        appActions.createNewDrive({
          login: user.login,
          driveName: driveName,
          isPrivate: driveType === DriveType.Private,
        })
      );
      if (onClose != null) {
        onClose();
      }
    }
  }, [isFilled, driveName, driveType, user, onClose]);

  return (
    <AppModalBase
      onClose={onClose}
      title={t("header")}
      visible={visible}
      body={[
        <ArdriveInput
          key="driveName"
          value={driveName}
          onChange={(e) => setDriveName(e.currentTarget.value)}
          hideIcon
          placeholder={t("driveName")}
        />,
        <ArdriveSelect
          key="driveType"
          placeholder={t("driveType")}
          value={driveType}
          onChange={(e) => setDriveType(+e.currentTarget.value)}
        >
          <option value={DriveType.Public}>{t("public")}</option>
          <option value={DriveType.Private}>{t("private")}</option>
        </ArdriveSelect>,
      ]}
      footer={[
        <ButtonWithIcon key="cancel" active transparent onClick={onClose}>
          {t("cancel")}
        </ButtonWithIcon>,
        <RoundedButton
          key="create"
          onClick={createDriveHanlder}
          disabled={!isFilled}
        >
          {t("create")}
        </RoundedButton>,
      ]}
    />
  );
};
