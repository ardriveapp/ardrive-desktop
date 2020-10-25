import React from "react";
import styled from "styled-components";

import { ReactComponent as Logo } from "resources/images/icon-light.svg";
import { ReactComponent as Corder } from "resources/images/corder.svg";

const WelcomeContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const StyledLogo = styled(Logo)`
  position: absolute;
  height: 80px;
  width: 80px;
  top: 0;
  left: 0;
`;

const StyledCorder = styled(Corder)`
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
