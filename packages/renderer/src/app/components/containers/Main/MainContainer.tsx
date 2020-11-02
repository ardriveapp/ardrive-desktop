import React from "react";

import { AppSidebar } from "app/components/sidebars";

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
} from "./MainContainer.styled";

const MainContainer: React.FC = ({ children }) => {
  return (
    <Container>
      <Header>
        <AppLogo />
        <CurrentUserContainer>
          <UsersIcon />
          <CurrentUserIcon />
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
