import styled from "styled-components";

import { ReactComponent as Text } from "resources/images/text.svg";

export const WelcomeText = styled.span`
  font-size: 30px;
  font-weight: 500;
`;

export const AppText = styled(Text)`
  width: 300px;
  height: 85px;
`;

export const DesciptionText = styled.span`
  width: 360px;
  text-align: center;
  font-weight: 500;
  font-size: 25px;
  margin-top: 25px;
  margin-bottom: 25px;
`;

export const Red = styled.span`
  color: #990033;
  font-weight: 700;
`;
