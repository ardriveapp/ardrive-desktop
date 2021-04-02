import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { ButtonWithIcon } from 'app/components';
import { useTranslationAt } from 'app/utils/hooks';

import { BottomContainer, Delimiter, GroupHeader, SidebarContainer } from './AppSidebar.styled';

export default () => {
	const { t } = useTranslationAt('components.sidebar');
	const location = useLocation();
	const history = useHistory();

	// TODO: Move to utils
	const isActiveRoute = useCallback((route: string) => location.pathname === route, [location]);

	return (
		<SidebarContainer>
			<ButtonWithIcon disabled icon="folder">
				{t('create_new')}
			</ButtonWithIcon>
			<ButtonWithIcon
				disabled
				onClick={() => history.push('/uploads')}
				active={isActiveRoute('/uploads')}
				icon="upload"
				transparent
			>
				{t('uploads')}
			</ButtonWithIcon>
			<Delimiter />
			<GroupHeader>{t('drives')}</GroupHeader>
			<ButtonWithIcon onClick={() => history.push('/')} active={isActiveRoute('/')} icon="private" transparent>
				{t('personal')}
			</ButtonWithIcon>
			<ButtonWithIcon
				disabled
				onClick={() => history.push('/public-drive')}
				active={isActiveRoute('/public-drive')}
				icon="public"
				transparent
			>
				{t('public')}
			</ButtonWithIcon>
			<Delimiter />
			<ButtonWithIcon
				disabled
				onClick={() => history.push('/shared')}
				active={isActiveRoute('/shared')}
				icon="share"
				transparent
			>
				{t('shared')}
			</ButtonWithIcon>
			<BottomContainer>
				<ButtonWithIcon disabled icon="help" transparent>
					{t('help')}
				</ButtonWithIcon>
			</BottomContainer>
		</SidebarContainer>
	);
};
