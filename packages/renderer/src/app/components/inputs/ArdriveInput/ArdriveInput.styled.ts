import styled from 'styled-components';

export const InputContainer = styled.div`
	position: relative;
	height: 58px;
	width: 100%;
	display: flex;
	align-items: baseline;
	margin-bottom: 16px;
`;

export const StyledInput = styled.input<{
	hideIcon?: boolean;
}>`
	background: #f8f8f8;
	border-radius: 4px 4px 0px 0px;
	border: none;
	outline: none;
	height: 100%;
	width: 100%;
	font-family: 'Open Sans';
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	line-height: 20px;
	padding-left: ${(props) => (props.hideIcon ? '20px' : '52px')};

	&:focus {
		border-bottom: 2px solid ${(props) => props.theme.colors.red};
	}

	&::placeholder {
		color: #a9a9a9;
	}
`;

export const ImageContainer = styled.div`
	position: absolute;
	left: 20px;
	height: 16px;
	width: 16px;
	align-self: center;
`;
