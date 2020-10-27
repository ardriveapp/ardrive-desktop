import React from "react";
import styled from "styled-components";

import { AppLogo, CorderLogo } from "../Logos.styled";

const WelcomeContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const StyledLogo = styled(AppLogo)`
  position: absolute;
  height: 80px;
  width: 80px;
  top: 0;
  left: 0;
`;

const StyledCorder = styled(CorderLogo)`
  position: absolute;
  height: 80px;
  width: 80px;
  bottom: 0;
  right: 0;
`;

const Container: React.FC = ({ children }) => {
  return (
    <WelcomeContainer>
      <StyledLogo />
      <StyledCorder />
      {children}
    </WelcomeContainer>
  );
};

export default Container;
