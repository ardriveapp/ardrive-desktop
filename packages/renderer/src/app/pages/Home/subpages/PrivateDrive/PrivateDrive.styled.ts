import styled from "styled-components";

export const PageContainer = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
`;

export const PageContentContainer = styled.div`
	display: flex;
	flex-direction: column;
	background-color: #e5e5e5;
	height: 100%;
	width: 100%;
`;

export const PageHeaderContainer = styled.div`
	display: flex;
	justify-content: flex-end;
`;

export const PageHeader = styled.div`
	font-style: normal;
	font-weight: 600;
	font-size: 20px;
	line-height: 24px;
	letter-spacing: 2px;
	text-transform: uppercase;
	color: #00060a;
`;

export const FolderPath = styled.span`
	font-family: "Open Sans";
	font-style: normal;
	font-weight: normal;
	font-size: 14px;
	line-height: 20px;
	color: rgba(0, 6, 10, 0.6);
	margin-top: 4px;
	margin-bottom: 28px;
`;

export const FileMenuContainer = styled.div<{
	visible: boolean;
}>`
	display: ${(props) => (props.visible ? "block" : "none")};

	svg {
		margin-right: 31px;
		cursor: pointer;

		&:hover {
			path {
				fill: ${(props) => props.theme.colors.red};
			}
		}

		&:last-child {
			margin-right: 0;
		}
	}
`;
