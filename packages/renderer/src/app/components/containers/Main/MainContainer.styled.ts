import { AppMainLogo, Users } from "app/components/images";
import styled from "styled-components";

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
  display: flex;
`;

export const SidebarContainer = styled.div`
  width: 340px;
  height: 100%;
  background-color: ${(props) => props.theme.colors.darkGrey};
`;

export const ContentContainer = styled.div`
  height: 100%;
`;

export const AppLogo = styled(AppMainLogo)`
  margin-left: 61px;
`;

export const CurrentUserContainer = styled.div`
  margin-right: 40px;
  display: flex;
  align-items: center;
`;

export const CurrentUserIcon = styled.div`
  border: 2px solid ${(props) => props.theme.colors.red};
  width: 32px;
  height: 32px;
  border-radius: 100%;
`;

export const UsersIcon = styled(Users)`
  width: 20px;
  height: 20px;
  margin-right: 18px;
`;
