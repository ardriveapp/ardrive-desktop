import styled from "styled-components";

import { CorderTopLogo, RoundedButton, RoundedInput } from "app/components";

export const LoginPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: relative;
`;

export const UsernamePrompt = styled(RoundedInput)`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const PasswordPrompt = styled(UsernamePrompt).attrs(() => ({
  type: "password",
}))``;

export const UnlockButton = styled(RoundedButton)`
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #990033;
  width: 150px;
`;

export const SetupNewUserButton = styled.button`
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: transparent;
  border: none;
  outline: none;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 1px;
`;

export const NeedHelpButton = styled.button`
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: transparent;
  border: none;
  outline: none;
  font-weight: bold;
  font-size: 14px;
  letter-spacing: 1px;
`;

export const TopCorder = styled(CorderTopLogo)`
  position: absolute;
  top: 0;
  right: 0;
`;
