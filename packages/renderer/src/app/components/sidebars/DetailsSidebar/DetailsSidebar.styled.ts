import styled from 'styled-components';

import { Close } from 'app/components/images';

export const DetailsSidebarContainer = styled.div<{
	visible: boolean;
}>`
	height: 100%;
	width: ${(props) => (props.visible ? '272px' : '0px')};
	transition: width 0.5s;
	background: #ffffff;
	box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
	overflow: hidden;
`;

export const TopItemsContainer = styled.div`
	display: flex;
	height: 70px;
	padding-left: 24px;
	padding-right: 24px;
	align-items: center;
	justify-content: space-between;
`;

export const CloseButton = styled(Close)`
	width: 14px;
	height: 14px;
`;

export const ContentContainer = styled.div``;

export const ItemName = styled.div`
	font-family: 'Montserrat';
	font-style: normal;
	font-weight: 600;
	font-size: 16px;
	line-height: 20px;
	letter-spacing: 2px;
	text-transform: uppercase;
	color: #00060a;
`;
