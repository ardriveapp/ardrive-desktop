import styled from "styled-components";
import Popover from "react-popover";

import { LogoWithoutText, Logout, Users } from "app/components/images";

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  background-color: white;
  height: 71px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

export const BottomContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
`;

export const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const AppLogo = styled(LogoWithoutText)`
  margin-left: 16px;
  width: 64px;
  height: 38px;
`;

export const CurrentUserContainer = styled.div`
  margin-right: 16px;
  display: flex;
  align-items: center;
`;

export const CurrentUserIcon = styled.div<{
  image: string;
}>`
  border: 2px solid ${(props) => props.theme.colors.red};
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background-image: url(${(props) => props.image});
  background-size: cover;
  cursor: pointer;
`;

export const CurrentUserIconWithoutBorder = styled(CurrentUserIcon)`
  border: none;
  width: 47px;
  height: 47px;
`;

export const CurrentUserDetailsBar = styled.div`
  display: flex;
  width: 100vw;
  height: 112px;
  background-color: white;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.12);
  border-radius: 3px;
  padding: 18px;
  cursor: default;
  pointer-events: none;
`;

export const UserDetailsContainer = styled.div`
  margin-left: 16px;
`;

export const UserNameContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const UserName = styled.div`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 6, 10, 0.87);
`;

export const UserAddress = styled.div`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;
  color: rgba(0, 6, 10, 0.6);
`;

export const UserBalance = styled.div`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #700327;
`;

export const UsersIcon = styled(Users)`
  width: 20px;
  height: 20px;
  margin-right: 18px;
`;

export const LogoutButton = styled(Logout)`
  width: 18px;
  height: 18px;
  cursor: pointer;
  pointer-events: all;
`;

export const FooterContainer = styled.div`
  background-color: #333333;
  height: 58px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const FooterButtonText = styled.div`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  text-align: center;
  text-transform: uppercase;
  margin-top: 4px;
`;

export const FooterButton = styled.div<{
  isActive?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  ${FooterButtonText} {
    color: ${(props) => (props.isActive ? "white" : "#a4a4a4")};
  }

  &:hover {
    ${FooterButtonText} {
      color: white;
    }

    & > svg {
      path {
        fill: white;
      }
    }
  }

  & > svg {
    g {
      opacity: 1;
    }

    path {
      fill: ${(props) => (props.isActive ? "white" : "#a4a4a4")};
    }
  }
`;

export const StyledPopover = styled(Popover).attrs(() => ({
  tipSize: 0.1,
}))``;

export const NewButtonMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  width: 180px;
  height: 88px;
  border-radius: 3px;
  background: #ffffff;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.12);
`;

export const NewButtonMenuContainerItem = styled.div`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  color: #a4a4a4;
  display: flex;
  align-items: center;
  cursor: pointer;

  & > svg {
    margin-right: 24px;
  }
`;

export const SettingsButtonMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  height: 180px;
  width: 290px;
  border-radius: 0px;
  background: #ffffff;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
`;

export const SettingsButtonMenuContainerItem = styled.div`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #a4a4a4;
  display: flex;
  align-items: center;
  cursor: pointer;

  & > svg {
    width: 16px;
    margin-right: 12px;
  }
`;

export const SettingsButtonMenuHeader = styled.div`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 6, 10, 0.87);
  margin-bottom: 17px;
`;

export const UploadNotificationContainer = styled.div`
  width: 100%;
  background-color: white;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  align-items: center;
  padding-top: 28px;
  padding-bottom: 28px;
`;

export const UploadText = styled.div`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  margin-left: 18px;

  color: rgba(0, 6, 10, 0.6);
`;
