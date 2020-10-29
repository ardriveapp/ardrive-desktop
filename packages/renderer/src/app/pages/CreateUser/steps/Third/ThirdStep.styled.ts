import styled from "styled-components";

import { RoundedButton } from "app/components";

export const Description = styled.span`
  text-align: center;
  margin-bottom: 20px;
  margin-top: 32px;
  width: 450px;
`;

export const SelectSyncFolderButton = styled(RoundedButton)`
  margin-top: 10px;
  margin-bottom: 32px;
  min-width: 300px;
  max-width: 500px;
  width: 500px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  background: #f8f8f8;
  color: rgba(0, 6, 10, 0.6);
  text-align: left;

  height: 56px;
  font-family: "Open Sans";
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
`;

export const LetsGoButton = styled(RoundedButton)`
  width: 380px;
`;
