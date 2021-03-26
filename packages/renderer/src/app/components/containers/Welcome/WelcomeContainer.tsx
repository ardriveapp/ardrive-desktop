import React from "react";

import {
	ContentContainer,
	LeftContainer,
	RightContainer,
	WelcomeContainer,
	AppLogo,
	LogoContainer,
	AppLogoWithText,
} from "./WelcomeContainer.styled";

const Container: React.FC<{
	rightImage?: React.ReactNode;
	useLogoWithText?: boolean;
}> = ({ rightImage, useLogoWithText, children }) => {
	return (
		<WelcomeContainer>
			<LeftContainer>{rightImage}</LeftContainer>
			<RightContainer>
				<LogoContainer>
					{useLogoWithText ? <AppLogoWithText /> : <AppLogo />}
				</LogoContainer>
				<ContentContainer>{children}</ContentContainer>
			</RightContainer>
		</WelcomeContainer>
	);
};

export default Container;
