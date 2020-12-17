import styled from "styled-components";

import { RoundedButton } from "app/components";

export const WelcomeText = styled.span`
  margin-bottom: 24px;
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  line-height: 34px;
  text-align: center;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #700327;
`;

export const DesciptionText = styled.span`
  width: 500px;
  font-family: "Open Sans";
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 32px;
  text-align: center;
  color: #00060a;
`;

export const StepButton = styled(RoundedButton)`
  width: 160px;
  height: 55px;
`;

export const ButtonsContainer = styled.div`
  bottom: 0;
  position: absolute;
  margin-bottom: 62px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-left: 76px;
  padding-right: 76px;
`;
