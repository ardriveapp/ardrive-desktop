import styled from "styled-components";

export const ButtonsContainer = styled.div`
	width: 100%;
	justify-content: space-between;
	display: flex;
`

export const RoundedButton = styled.button`
	background: ${(props) => props.theme.colors.red};
	border-radius: 4px;
	width: 100%;
	height: 64px;

	font-family: "Montserrat";
	font-style: normal;
	font-weight: bold;
	font-size: 20px;
	line-height: 16px;
	letter-spacing: 1px;
	text-transform: uppercase;

	color: white;
	outline: none;
	border: none;
	padding-left: 20px;
	padding-right: 20px;
	margin-left: auto;
	margin-right: auto;
	cursor: pointer;

	&:disabled {
		cursor: default;
		background-color: #a4a4a4;
	}
`;

export const ButtonImage = styled.div`
	height: 24px;
	width: 24px;
	margin-right: 16px;

	& > svg {
		fill: white;
		opacity: 1;

		& > path {
			opacity: 1;
		}
	}
`;

export const LoginButton = styled(RoundedButton)`
	width: 45%;
	height: 50px;
	padding: 10px;
	font-size: 16px;
`
export const ButtonWithContent = styled(RoundedButton) <{
	active?: boolean;
}>`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 233px;
	height: 56px;
	font-size: 16px;
	line-height: 16px;
	margin-bottom: 36px;
`;

export const TransparentButtonWithContent = styled(ButtonWithContent)`
	background-color: transparent;
	text-transform: capitalize;
	opacity: ${(props) => (props.active ? "1" : "0.6")};
	margin-bottom: 0;
`;
