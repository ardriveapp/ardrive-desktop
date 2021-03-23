import styled from "styled-components";

export const SliderContainer = styled.div`
	display: flex;
	justify-content: space-between;
`;

export const Checkmark = styled.div`
	width: 100%;
	height: 100%;
	background-color: #fbfbfb;
	color: rgba(0, 6, 10, 0.6);
	line-height: 48px;
	text-align: center;
	font-family: "Open Sans";
	font-style: normal;
	font-weight: 600;
	font-size: 14px;
	text-transform: capitalize;
`;

export const SelectContainer = styled.label`
	display: block;
	flex-grow: 1;

	& > input {
		display: none;

		&:checked + ${Checkmark} {
		background-color: ${(props) => props.theme.colors.red};
		color: #ffffff;
		}
	}
`;
