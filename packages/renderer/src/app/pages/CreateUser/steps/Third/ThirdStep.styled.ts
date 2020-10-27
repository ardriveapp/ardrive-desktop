import styled from "styled-components";

import { RoundedButton } from "app/components";

export const PageHeader = styled.span`
  font-size: 26px;
  margin-bottom: 25px;
  letter-spacing: 2px;
  text-align: center;
`;

export const Description = styled.span`
  text-align: center;
  margin-bottom: 20px;
`;

export const SelectSyncFolderButton = styled(RoundedButton)`
  margin-top: 10px;
  margin-bottom: 10px;
  min-width: 300px;
  max-width: 500px;
  width: auto;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const LetsGoButton = styled(RoundedButton)`
  margin-left: auto;
  width: auto;
  margin-right: 100px;
  margin-top: 70px;
`;
