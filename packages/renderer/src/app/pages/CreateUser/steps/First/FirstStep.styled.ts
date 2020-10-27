import styled from "styled-components";

import { RoundedButton, RoundedInput } from "app/components";

export const PageHeader = styled.span`
  font-size: 26px;
  margin-bottom: 25px;
  letter-spacing: 2px;
`;

export const Description = styled.span`
  text-align: center;
  margin-bottom: 20px;
`;

export const InputCaption = styled.span`
  margin-top: 10px;
  margin-bottom: 5px;
  font-weight: 500;
  letter-spacing: 1.5px;
`;

export const UsernamePrompt = styled(RoundedInput)`
  margin-bottom: 10px;
  width: 400px;
`;

export const PasswordPrompt = styled(UsernamePrompt).attrs(() => ({
  type: "password",
}))``;

export const ContinueButton = styled(RoundedButton)`
  margin-left: auto;
  width: auto;
  margin-right: 100px;
  margin-top: 70px;
`;
