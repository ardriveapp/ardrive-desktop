import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
          <FooterButtonText>New</FooterButtonText>
        </FooterButton>
        <FooterButton>
          <LockedFolder />
          <FooterButtonText>Local drive</FooterButtonText>
        </FooterButton>
        <FooterButton>
          <Gear />
          <FooterButtonText>Settings</FooterButtonText>
        </FooterButton>
      </FooterContainer>
    </Container>
  );
};

export default MainContainer;
