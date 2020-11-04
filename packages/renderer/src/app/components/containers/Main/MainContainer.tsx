import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { AppSidebar } from "app/components/sidebars";
import { SampleUserImage } from "app/components/images";

import {
  BottomContainer,
  Container,
  ContentContainer,
  Header,
  SidebarContainer,
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
} from "./MainContainer.styled";
import { authActions } from "app/redux/actions";

const MainContainer: React.FC = ({ children }) => {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const dispatch = useDispatch();

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
                  <UserName>Satoshi</UserName>
                  <LogoutButton
                    onClick={() => dispatch(authActions.logout())}
                  />
                </UserNameContainer>
                <UserAddress>
                  S0aqWk_d8RfT0G8CVAOjg-7Dq-rfkKc68GkkicZ097w
                </UserAddress>
                <UserBalance>14.25 AR</UserBalance>
              </UserDetailsContainer>
            </CurrentUserDetailsBar>
          </CurrentUserIcon>
        </CurrentUserContainer>
      </Header>
      <BottomContainer>
        <SidebarContainer>
          <AppSidebar />
        </SidebarContainer>
        <ContentContainer>{children}</ContentContainer>
      </BottomContainer>
    </Container>
  );
};

export default MainContainer;
