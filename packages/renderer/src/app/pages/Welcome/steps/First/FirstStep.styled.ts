import styled from "styled-components";

import { LogoTextRed, RoundedButton } from "app/components";

export const WelcomeText = styled.span`
	font-style: normal;
	font-weight: 600;
	font-size: 28px;
	line-height: 34px;
	text-align: center;
	letter-spacing: 2px;
	text-transform: uppercase;
`;

export const DesciptionText = styled.span`
	width: 400px;
	font-style: normal;
	font-weight: normal;
	font-size: 20px;
	line-height: 32px;
	text-align: center;
	margin-bottom: 56px;
	font-family: "Open Sans";
`;

export const AppTextLogo = styled(LogoTextRed)`
    margin-top: 16px;
    margin-bottom: 32px;
    width: 315px;
    height: 35px;
`;

export const JumpIn = styled(RoundedButton)`
    width: 191px;
`;
