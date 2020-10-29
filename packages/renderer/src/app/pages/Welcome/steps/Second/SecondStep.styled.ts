import styled from "styled-components";

import { RoundedButton } from "app/components";

export const WelcomeText = styled.span`
  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  line-height: 34px;
  text-align: center;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 24px;
`;

export const DesciptionText = styled.span`
  width: 500px;
  text-align: left;
  font-family: "Open Sans";
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 160%;
`;

export const ContinueButton = styled(RoundedButton)`
  width: 215px;
  bottom: 0;
  position: absolute;
  margin-bottom: 62px;
`;
