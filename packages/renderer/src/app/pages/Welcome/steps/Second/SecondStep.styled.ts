import styled from "styled-components";

import { RoundedButton } from "app/components";

export const WelcomeText = styled.span`
  font-size: 30px;
  font-weight: 500;
`;

export const DesciptionText = styled.span`
  width: 460px;
  text-align: left;
  font-weight: 500;
  font-size: 15px;
  margin-top: 25px;
  margin-bottom: 25px;
  letter-spacing: 1.5px;
`;

export const ContinueButton = styled(RoundedButton)`
  margin-left: auto;
  width: auto;
  margin-right: 100px;
`;
