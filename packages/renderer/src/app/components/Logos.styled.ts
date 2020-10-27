import styled from "styled-components";

import { ReactComponent as Text } from "resources/images/text.svg";
import { ReactComponent as Logo } from "resources/images/icon-light.svg";
import { ReactComponent as Corder } from "resources/images/corder.svg";
import { ReactComponent as CorderTop } from "resources/images/corder-top.svg";

export const AppTextLogo = styled(Text)`
  width: 300px;
  height: 85px;
`;

export const AppLogo = styled(Logo)`
  height: 250px;
  width: 250px;
`;

export const CorderLogo = styled(Corder)`
  height: 80px;
  width: 80px;
`;

export const CorderTopLogo = styled(CorderTop)`
  height: 120px;
  width: 120px;
`;
