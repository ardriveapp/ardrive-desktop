import React from "react";

import {
  ContentContainer,
  LeftContainer,
  RightContainer,
  WelcomeContainer,
  AppLogo,
  LogoContainer,
} from "./WelcomeContainer.styled";

const Container: React.FC<{
  rightImage?: React.ReactNode;
}> = ({ rightImage, children }) => {
  return (
    <WelcomeContainer>
      <LeftContainer>{rightImage}</LeftContainer>
      <RightContainer>
        <LogoContainer>
          <AppLogo />
        </LogoContainer>
        <ContentContainer>{children}</ContentContainer>
      </RightContainer>
    </WelcomeContainer>
  );
};

export default Container;
