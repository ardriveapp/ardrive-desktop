import styled from "styled-components";

export const CreateUserPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const UsernamePrompt = styled.input`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const PasswordPrompt = styled(UsernamePrompt).attrs(() => ({
  type: "password",
}))``;

export const ContinueButton = styled.button`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const CreateNewButton = styled.button`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const ImportExistingButton = styled(CreateNewButton)``;

export const SelectSyncFolderButton = styled.button`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const LetsGoButton = styled.button`
  margin-top: 10px;
  margin-bottom: 10px;
`;
