import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

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
} from "app/components/images";
import { authActions } from "app/redux/actions";
import { authSelectors } from "app/redux/selectors";
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
} from "./MainContainer.styled";

const NewButtonMenu = () => {
  const { t } = useTranslationAt("components.mainContainer");

  return (
    <NewButtonMenuContainer>
      <NewButtonMenuContainerItem>
        <NewDrive />
        {t("newDrive")}
      </NewButtonMenuContainerItem>
      <NewButtonMenuContainerItem>
        <AttachDrive />
        {t("attachDrive")}
      </NewButtonMenuContainerItem>
    </NewButtonMenuContainer>
  );
};

const SettingsButtonMenu = () => {
  const { t } = useTranslationAt("components.mainContainer");

  return (
    <SettingsButtonMenuContainer>
      <SettingsButtonMenuHeader>{t("settingsHeader")}</SettingsButtonMenuHeader>
      <SettingsButtonMenuContainerItem>
        <Lock />
        {t("changeLogin")}
      </SettingsButtonMenuContainerItem>
      <SettingsButtonMenuContainerItem>
        <SyncFolder />
        {t("changeSync")}
      </SettingsButtonMenuContainerItem>
      <SettingsButtonMenuContainerItem>
        <Pause />
        {t("pauseSync")}
      </SettingsButtonMenuContainerItem>
      <SettingsButtonMenuContainerItem>
        <Backup />
        {t("backup")}
      </SettingsButtonMenuContainerItem>
    </SettingsButtonMenuContainer>
  );
};

//  TODO: Extract bottom menu to separate component and make it more usable and univeral
const BottomMenu = () => {
  const { t } = useTranslationAt("components.mainContainer");
  const history = useHistory();
  const location = useLocation();
  const [showNewButtonMenu, setShowNewButtonMenu] = useState(false);
  const [showSettingsButtonMenu, setSettingsNewButtonMenu] = useState(false);

  // TODO: Move to utils
  const isActiveRoute = useCallback(
    (route: string) => location.pathname === route,
    [location]
  );
  return (
    <>
      <StyledPopover
        body={<NewButtonMenu />}
        isOpen={showNewButtonMenu}
        onOuterAction={() => setShowNewButtonMenu(false)}
      >
        <FooterButton
          isActive={showNewButtonMenu}
          onClick={() => setShowNewButtonMenu((p) => !p)}
        >
          <CreateNewFolder />
          <FooterButtonText>{t("new")}</FooterButtonText>
        </FooterButton>
      </StyledPopover>
      <FooterButton
        isActive={isActiveRoute("/")}
        onClick={() => history.push("/")}
      >
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

const MainContainer: React.FC = ({ children }) => {
  const [showUserDetails, setShowUserDetails] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(authSelectors.getUser);

  return (
    <Container>
      <Header>
        <AppLogo />
        <CurrentUserContainer>
          <UsersIcon />
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
        <ContentContainer>{children}</ContentContainer>
      </BottomContainer>
      <FooterContainer>
        <BottomMenu />
      </FooterContainer>
    </Container>
  );
};

export default MainContainer;
