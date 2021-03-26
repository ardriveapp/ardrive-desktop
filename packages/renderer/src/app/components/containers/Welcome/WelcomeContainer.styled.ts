import styled from "styled-components";

import { LogoWithoutText, LogoWithText } from "app/components/images";

export const WelcomeContainer = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
`;

export const LeftContainer = styled.div`
	height: 100%;
	min-width: 720px;
	max-width: 720px;
	width: 720px;
	background-color: ${(props) => props.theme.colors.darkGrey};
	display: flex;
	justify-content: center;
	align-items: center;
`;
export const RightContainer = styled.div`
  	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	max-height: 100%;
`;
export const ContentContainer = styled.div`
  	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

export const LogoContainer = styled.div`
	width: 100%;
	position: absolute;
	display: flex;
	justify-content: center;
	padding-top: 60px;
`;

export const AppLogo = styled(LogoWithoutText)`
	height: 128px;
	width: 176px;
`;

export const AppLogoWithText = styled(LogoWithText)`
	height: 180px;
	width: 340px;
`;
