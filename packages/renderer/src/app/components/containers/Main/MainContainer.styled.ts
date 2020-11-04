import styled from "styled-components";

import { AppMainLogo, Logout, Users } from "app/components/images";

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
`;

export const BottomContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`;

export const SidebarContainer = styled.div`
  min-width: 340px;
  height: 100%;
  background-color: ${(props) => props.theme.colors.darkGrey};
`;

export const ContentContainer = styled.div`
  height: 100%;
  width: 100%;
`;

export const AppLogo = styled(AppMainLogo)`
  margin-left: 61px;
`;

export const CurrentUserContainer = styled.div`
  margin-right: 40px;
  display: flex;
  align-items: center;
`;

export const CurrentUserIcon = styled.div<{
  image: string;
}>`
  position: relative;
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

export const CurrentUserDetailsBar = styled.div<{
  show: boolean;
}>`
  display: ${(props) => (props.show ? "flex" : "none")};
  position: absolute;
  width: 388px;
  height: 102px;
  background-color: white;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.12);
  border-radius: 3px;
  right: 0;
  top: 40px;
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
