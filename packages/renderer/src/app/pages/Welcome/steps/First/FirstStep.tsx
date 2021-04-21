import React from 'react';

import { FontVariants, TranslationAt } from 'app/components';

import { DesciptionText, WelcomeText, AppTextLogo, JumpIn } from './FirstStep.styled';
import { useTranslationAt } from 'app/utils/hooks';

const translationsPath = 'pages.welcome.steps.first';

const FirstStep: React.FC<{
	onContinue(): void;
}> = ({ onContinue }) => {
	const { t } = useTranslationAt(translationsPath);

	return (
		<>
			<WelcomeText>{t('welcome_to')}</WelcomeText>
			<AppTextLogo />
			<DesciptionText>
				<TranslationAt atPath={translationsPath} i18nKey="description" components={[<FontVariants.Bold />]} />
			</DesciptionText>
			<JumpIn onClick={onContinue}>{t('jump_in')}</JumpIn>
		</>
	);
};

export default FirstStep;
