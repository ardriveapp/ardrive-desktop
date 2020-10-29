import styled from "styled-components";

import { LogoTextRed, RoundedButton } from "app/components";

export const LoginFormContainer = styled.div`
  width: 380px;
`;

export const UnlockButton = styled(RoundedButton)`
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: ${(props) => props.theme.colors.red};
`;

export const SetupNewUserButton = styled.button`
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;

  font-family: "Open Sans";
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;

  color: rgba(0, 6, 10, 0.6);
`;

export const NeedHelpButton = styled.button`
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;

  font-family: "Open Sans";
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  text-align: center;

  color: rgba(0, 6, 10, 0.6);
`;

export const HeaderText = styled.span`
  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  line-height: 34px;
  text-align: center;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

export const AppTextLogo = styled(LogoTextRed)`
  margin-top: 16px;
  margin-bottom: 32px;
  width: 315px;
  height: 35px;
`;
