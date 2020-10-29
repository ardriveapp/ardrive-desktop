import styled from "styled-components";

import { RoundedButton } from "app/components";

export const Description = styled.span`
  text-align: center;
  margin-bottom: 20px;
  margin-top: 24px;
  width: 450px;
  font-family: "Open Sans";
`;

export const ImportWalletButton = styled(RoundedButton)`
  height: 64px;
  width: 244px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  width: 500px;
  justify-content: space-between;
`;
