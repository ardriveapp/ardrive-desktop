import React, { useCallback, useMemo } from "react";

import { useTranslationAt } from "app/utils/hooks";

import { ButtonWithIcon, RoundedButton } from "app/components/buttons";
import { AppModalBase } from "../AppModal";
import { ArdriveInput } from "app/components/inputs";
import { ArdriveSelect } from "app/components/inputs/ArdriveSelect";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appSelectors, authSelectors } from "app/redux/selectors";
import { appActions } from "app/redux/slices/app";
import { TextLabel } from "./Variants.styled";
import { useEffect } from "react";

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
  const [driveName, setDriveName] = useState<string>();
  const [driveType, setDriveType] = useState<DriveType>();
  const isFilled = useMemo(() => driveName != null && driveType != null, [
    driveName,
    driveType,
  ]);
  const user = useSelector(authSelectors.getUser);
  const dispatch = useDispatch();

  const createDriveHanlder = useCallback(async () => {
    if (isFilled && user != null && driveName != null && driveType != null) {
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
          value={driveType}
          onChange={(e) => setDriveType(+e.currentTarget.value)}
        >
          <option value="" disabled selected>
            {t("driveType")}
          </option>
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

export const AttachDriveModal: React.FC<ModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslationAt("components.modals.attachDrive");
  const [sharedDriveId, setSharedDriveId] = useState<string>();
  const [personalDriveId, setPersonalDriveId] = useState<string>();
  const isFilled = useMemo(
    () => sharedDriveId != null || personalDriveId != null,
    [sharedDriveId, personalDriveId]
  );
  const user = useSelector(authSelectors.getUser);
  const drives = useSelector(appSelectors.getAllDrives);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user != null) {
      dispatch(appActions.getAllDrives(user));
    }
  }, [user]);

  const attachDriveHanlder = useCallback(async () => {
    if (isFilled && user != null) {
      if (sharedDriveId != null) {
        await dispatch(
          appActions.attachDrive({
            ...user,
            driveId: sharedDriveId,
            isShared: true,
          })
        );
      } else if (personalDriveId != null) {
        await dispatch(
          appActions.attachDrive({
            ...user,
            driveId: personalDriveId,
            isShared: false,
          })
        );
      }

      if (onClose != null) {
        onClose();
      }
    }
  }, [isFilled, sharedDriveId, personalDriveId, user, onClose]);

  return (
    <AppModalBase
      onClose={onClose}
      title={t("header")}
      visible={visible}
      body={[
        <ArdriveInput
          disabled={personalDriveId != null}
          key="sharedDriveId"
          value={sharedDriveId}
          onChange={(e) => setSharedDriveId(e.currentTarget.value || undefined)}
          hideIcon
          placeholder={t("sharedDriveId")}
        />,
        <TextLabel key="or">{t("or")}</TextLabel>,
        <ArdriveSelect
          disabled={sharedDriveId != null}
          key="personalDrive"
          value={personalDriveId}
          onChange={(e) =>
            setPersonalDriveId(e.currentTarget.value || undefined)
          }
        >
          <option value="" selected>
            {t("personalDrive")}
          </option>
          {drives.map((drive) => {
            return (
              <option key={drive.driveId} value={drive.driveId}>
                {drive.name}
              </option>
            );
          })}
        </ArdriveSelect>,
      ]}
      footer={[
        <ButtonWithIcon key="cancel" active transparent onClick={onClose}>
          {t("cancel")}
        </ButtonWithIcon>,
        <RoundedButton
          key="create"
          onClick={attachDriveHanlder}
          disabled={!isFilled}
        >
          {t("attach")}
        </RoundedButton>,
      ]}
    />
  );
};
