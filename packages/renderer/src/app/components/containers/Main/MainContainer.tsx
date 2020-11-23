import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  CreateNewFolder,
  Gear,
  LockedFolder,
  SampleUserImage,
} from "app/components/images";

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
} from "./MainContainer.styled";
import { authActions } from "app/redux/actions";
import { authSelectors } from "app/redux/selectors";
import { useTranslationAt } from "app/utils/hooks";

const MainContainer: React.FC = ({ children }) => {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(authSelectors.getUser);
  const { t } = useTranslationAt("components.mainContainer");
  const history = useHistory();

  return (
    <Container>
      <Header>
        <AppLogo />
        <CurrentUserContainer>
          <UsersIcon />
          <CurrentUserIcon
            onClick={() => setShowUserDetails((prev) => !prev)}
            image={SampleUserImage}
          >
            <CurrentUserDetailsBar show={showUserDetails}>
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
          </CurrentUserIcon>
        </CurrentUserContainer>
      </Header>
      <BottomContainer>
        <ContentContainer>{children}</ContentContainer>
      </BottomContainer>
      <FooterContainer>
        <FooterButton>
          <CreateNewFolder />
          <FooterButtonText>{t("new")}</FooterButtonText>
        </FooterButton>
        <FooterButton onClick={() => history.push("/")}>
          <LockedFolder />
          <FooterButtonText>{t("localDrive")}</FooterButtonText>
        </FooterButton>
        <FooterButton>
          <Gear />
          <FooterButtonText>{t("settings")}</FooterButtonText>
        </FooterButton>
      </FooterContainer>
    </Container>
  );
};

export default MainContainer;
