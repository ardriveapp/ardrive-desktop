import styled from "styled-components";

export const RoundedInput = styled.input`
	background: ${(props) => props.theme.colors.darkGrey};
	border-radius: 100px;
	width: 300px;
	height: 40px;
	font-size: 20px;
	outline: none;
	border: none;
	letter-spacing: 3.5px;
	text-align: center;
	color: white;
	text-transform: lowercase;

	&::placeholder {
		color: white;
	}
`;
