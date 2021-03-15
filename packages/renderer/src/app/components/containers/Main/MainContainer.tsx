import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  AttachDrive,
  Backup,
  CreateNewFolder,
  Gear,
  Lock,
  LockedFolder,
  NewDrive,
  Pause,
  SampleUserImage,
  SyncFolder,
  Syncing,
  UploadInfo,
} from "app/components/images";
import { appSelectors, authSelectors } from "app/redux/selectors";
import { useTranslationAt } from "app/utils/hooks";

import {
  BottomContainer,
  Container,
  ContentContainer,
  Header,
  AppLogo,
  CurrentUserContainer,
  CurrentUserIcon,
  UsersIcon,
  CurrentUserDetailsBar,
  CurrentUserIconWithoutBorder,
  UserDetailsContainer,
  UserName,
  UserAddress,
  UserBalance,
  UserNameContainer,
  LogoutButton,
  FooterContainer,
  FooterButton,
  FooterButtonText,
  StyledPopover,
  NewButtonMenuContainer,
  NewButtonMenuContainerItem,
  SettingsButtonMenuContainer,
  SettingsButtonMenuContainerItem,
  SettingsButtonMenuHeader,
  UploadNotificationContainer,
  UploadText,
  NotificationButtonsContainer,
  NotificationButton,
  NotificationInfoContainer,
  SyncingStatusContainer,
  SyncingText,
  HelpIcon,
} from "./MainContainer.styled";
import { authActions } from "app/redux/slices/auth";
import { useModal } from "app/components/modals/utils";
import { withModal } from "app/components/modals/hooks";
import { TranslationAt } from "app/components/TranslationAt";
import { FontVariants } from "app/components/typography";
import { appActions } from "app/redux/slices/app";
import { unwrapResult } from "@reduxjs/toolkit";
import { AppDispatch } from "app/redux";

const NewButtonMenu = () => {
  const { t } = useTranslationAt("components.mainContainer");
  const { showModal } = useModal();

  return (
    <NewButtonMenuContainer>
      <NewButtonMenuContainerItem onClick={() => showModal("new_drive")}>
        <NewDrive />
        {t("newDrive")}
      </NewButtonMenuContainerItem>
      <NewButtonMenuContainerItem onClick={() => showModal("attach_drive")}>
        <AttachDrive />
        {t("attachDrive")}
      </NewButtonMenuContainerItem>
    </NewButtonMenuContainer>
  );
};

const SettingsButtonMenu = () => {
  const { t } = useTranslationAt("components.mainContainer");
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector(authSelectors.getUser);

  const openFolder = useCallback(async () => {
    const result = await dispatch(appActions.openFolder());
    const syncFolderPath = unwrapResult(result);

    if (syncFolderPath && user) {
      await dispatch(
        authActions.updateUserSyncDirThunk({
          syncFolderPath: syncFolderPath,
          login: user.login,
          password: user.password,
        })
      );
    }
  }, [dispatch]);

  return (
    <SettingsButtonMenuContainer>
      <SettingsButtonMenuHeader>{t("settingsHeader")}</SettingsButtonMenuHeader>
      <SettingsButtonMenuContainerItem>
        <Lock />
        {t("changeLogin")}
      </SettingsButtonMenuContainerItem>
      <SettingsButtonMenuContainerItem onClick={openFolder}>
        <SyncFolder />
        {t("changeSync")}
      </SettingsButtonMenuContainerItem>
      <SettingsButtonMenuContainerItem
        onClick={() => dispatch(authActions.pauseSyncing())}
      >
        <Pause />
        {t("pauseSync")}
      </SettingsButtonMenuContainerItem>
      <SettingsButtonMenuContainerItem
        onClick={() => {
          if (user != null) {
            dispatch(authActions.backupWallet(user));
          }
        }}
      >
        <Backup />
        {t("backup")}
      </SettingsButtonMenuContainerItem>
    </SettingsButtonMenuContainer>
  );
};

//  TODO: Extract bottom menu to separate component and make it more usable and univeral
const BottomMenu = () => {
  const { t } = useTranslationAt("components.mainContainer");
  const [showNewButtonMenu, setShowNewButtonMenu] = useState(false);
  const [showSettingsButtonMenu, setSettingsNewButtonMenu] = useState(false);
  const dispatch = useDispatch();

  return (
    <>
      <StyledPopover
        body={<NewButtonMenu />}
        isOpen={showNewButtonMenu}
        onOuterAction={() => setShowNewButtonMenu(false)}
      >
        <FooterButton
          isActive={showNewButtonMenu}
          onClick={() => {
            setShowNewButtonMenu((p) => !p);
          }}
        >
          <CreateNewFolder />
          <FooterButtonText>{t("new")}</FooterButtonText>
        </FooterButton>
      </StyledPopover>
      <FooterButton onClick={() => dispatch(appActions.openSyncFolder())}>
        <LockedFolder />
        <FooterButtonText>{t("localDrive")}</FooterButtonText>
      </FooterButton>
      <StyledPopover
        body={<SettingsButtonMenu />}
        isOpen={showSettingsButtonMenu}
        onOuterAction={() => setSettingsNewButtonMenu(false)}
      >
        <FooterButton
          isActive={showSettingsButtonMenu}
          onClick={() => setSettingsNewButtonMenu((p) => !p)}
        >
          <Gear />
          <FooterButtonText>{t("settings")}</FooterButtonText>
        </FooterButton>
      </StyledPopover>
    </>
  );
};

const UploadNotification = () => {
  const notification = useSelector(appSelectors.getUploadNotification);
  const { t } = useTranslationAt("components.mainContainer");
  const dispatch = useDispatch();
  const user = useSelector(authSelectors.getUser);

  if (notification == null || notification.filesCount === 0) {
    return null;
  }

  return (
    <UploadNotificationContainer>
      <NotificationInfoContainer>
        <UploadInfo />
        <UploadText>
          <TranslationAt
            atPath="components.mainContainer"
            i18nKey="uploadNotification"
            components={[<FontVariants.Bold />]}
            count={notification.filesCount}
            values={notification}
          />
        </UploadText>
      </NotificationInfoContainer>
      <NotificationButtonsContainer>
        <NotificationButton
          onClick={() => {
            if (user != null) {
              dispatch(appActions.uploadFiles(user));
            }
          }}
        >
          {t("yes")}
        </NotificationButton>
        <NotificationButton>{t("no")}</NotificationButton>
      </NotificationButtonsContainer>
    </UploadNotificationContainer>
  );
};

const MainContainer: React.FC = ({ children }) => {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const { t } = useTranslationAt("components.mainContainer");

  const dispatch = useDispatch();
  const user = useSelector(authSelectors.getUser);
  const isSyncing = useSelector(authSelectors.getIsSyncing);

  return (
    <Container>
      <Header>
        <AppLogo />
        <CurrentUserContainer>
          <HelpIcon onClick={() => dispatch(appActions.openHelpLink())} />
          <UsersIcon onClick={() => dispatch(appActions.openCommunityLink())} />
          <StyledPopover
            isOpen={showUserDetails}
            onOuterAction={() => setShowUserDetails(false)}
            body={
              <CurrentUserDetailsBar>
                <CurrentUserIconWithoutBorder image={SampleUserImage} />
                <UserDetailsContainer>
                  <UserNameContainer>
                    <UserName>{user?.login}</UserName>
                    <LogoutButton
                      onClick={() => dispatch(authActions.logout())}
                    />
                  </UserNameContainer>
                  <UserAddress>{user?.address}</UserAddress>
                  <UserBalance>{user?.balance}</UserBalance>
                </UserDetailsContainer>
              </CurrentUserDetailsBar>
            }
          >
            <CurrentUserIcon
              onClick={() => setShowUserDetails((prev) => !prev)}
              image={SampleUserImage}
            />
          </StyledPopover>
        </CurrentUserContainer>
      </Header>
      <BottomContainer>
        {!isSyncing && (
          <SyncingStatusContainer>
            <Syncing />
            <SyncingText>{t("syncingText")}</SyncingText>
          </SyncingStatusContainer>
        )}
        <UploadNotification />
        <ContentContainer>{children}</ContentContainer>
      </BottomContainer>
      <FooterContainer>
        <BottomMenu />
      </FooterContainer>
    </Container>
  );
};

export default withModal(MainContainer);
