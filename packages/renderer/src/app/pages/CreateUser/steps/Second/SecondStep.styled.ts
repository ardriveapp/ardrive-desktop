import styled from "styled-components";

import { RoundedButton } from "app/components";

export const PageHeader = styled.span`
  font-size: 26px;
  margin-bottom: 25px;
  letter-spacing: 2px;
`;

export const Description = styled.span`
  text-align: center;
  margin-bottom: 20px;
`;

export const CreateNewButton = styled(RoundedButton)`
  border-radius: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 60px;
  width: 270px;
`;

export const ImportExistingButton = styled(CreateNewButton)`
  margin-top: 10px;
  margin-bottom: 10px;
`;
