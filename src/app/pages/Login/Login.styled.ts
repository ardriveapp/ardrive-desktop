import styled from "styled-components";

export const LoginPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const AppLogo = styled.div``;

export const UsernamePrompt = styled.input`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const PasswordPrompt = styled(UsernamePrompt).attrs(() => ({
  type: "password",
}))``;

export const UnlockButton = styled.button`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const SetupNewUserButton = styled.button`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const NeedHelpButton = styled.button`
  margin-top: 10px;
  margin-bottom: 10px;
`;
