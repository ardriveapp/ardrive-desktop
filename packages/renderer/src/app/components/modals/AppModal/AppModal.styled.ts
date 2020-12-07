import styled from "styled-components";

import { ButtonWithIcon, RoundedButton } from "app/components/buttons";
import { Close } from "app/components/images";

export const AppModalContainer = styled.div<{
  visible: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${(props) => (props.visible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  background-color: rgba(248, 248, 248, 0.2);
  padding-left: 20px;
  padding-right: 20px;
`;

export const AppModalWindowContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 100%;
  min-height: 247px;
  background-color: white;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.12);
  border-radius: 3px;
`;

export const AppModalWindowHeader = styled.div`
  height: 68px;
  background-color: #333333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 27px;
  padding-right: 27px;
`;

export const AppModalWindowHeaderText = styled.div`
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #ffffff;
`;

export const CloseButton = styled(Close)`
  height: 14px;
  width: 14px;
  margin-left: auto;
  cursor: pointer;

  &:hover path {
    fill: white;
  }
`;

export const AppModalWindowFooter = styled.div`
  height: 80px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  padding-left: 24px;
  padding-right: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  & > ${RoundedButton} {
    height: 48px;
    width: auto;
    margin-left: 39px;
  }

  & > ${ButtonWithIcon} {
    margin-bottom: 0;
    color: rgba(0, 0, 0, 0.6);
    text-transform: uppercase;

    path {
      fill: rgba(0, 0, 0, 0.6);
    }
  }
`;

export const AppModalWindowBody = styled.div`
  padding-left: 26px;
  padding-right: 26px;
`;
