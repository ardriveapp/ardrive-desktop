import styled from "styled-components";

export const FileUploadContainer = styled.section`
	position: relative;
	border-radius: 6px;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: white;
`;

export const FormField = styled.input`
	font-size: 18px;
	display: block;
	width: 100%;
	border: none;
	text-transform: none;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0;

	&:focus {
		outline: none;
	}
`;
