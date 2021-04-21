import styled from 'styled-components';

import { RoundedButton } from 'app/components';

export const LoginFormContainer = styled.div`
	width: 380px;
`;

export const UnlockButton = styled(RoundedButton)`
	margin-top: 10px;
	margin-bottom: 10px;
	background-color: ${(props) => props.theme.colors.red};
`;

export const SetupNewUserButton = styled.button`
	background-color: transparent;
	border: none;
	outline: none;
	cursor: pointer;

	font-family: 'Open Sans';
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	line-height: 20px;

	color: rgba(0, 6, 10, 0.6);
`;

export const NeedHelpButton = styled.button`
	background-color: transparent;
	border: none;
	outline: none;
	cursor: pointer;

	font-family: 'Open Sans';
	font-style: normal;
	font-weight: bold;
	font-size: 14px;
	line-height: 20px;
	text-align: center;

	color: rgba(0, 6, 10, 0.6);
`;
export const UsageLink = styled.span`
	background-color: transparent;
	border: none;
	outline: none;
	cursor: pointer;
	text-decoration: underline;

	font-family: 'Open Sans';
	font-style: normal;
	font-size: 16px;
	line-height: 20px;
	text-align: center;
`;
export const AgreePolicyCheckBox = styled.input`
	width: 30px;
	height: 30px;
	margin: auto;
	margin-right: 30px;
`;

export const PolicyContainer = styled.div`
	display: flex;
	width: 100%;
	margin-top: 20px;
	margin-bottom: 20px;
`;
export const AgreeText = styled.span`
	font-family: 'Open Sans';
	font-style: normal;
	font-size: 16px;
	line-height: 20px;
	text-align: center;
	margin-right: 10px;
`;
