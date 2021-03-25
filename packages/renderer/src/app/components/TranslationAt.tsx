import React from "react";
import { Trans, TransProps } from "react-i18next";

interface TranslationAtProps extends TransProps {
	atPath: string;
}

export const TranslationAt: React.FC<TranslationAtProps> = (props) => {
	const { i18nKey, atPath, ...rest } = props;
	return <Trans i18nKey={`${atPath}.${i18nKey}`} {...rest} />;
};
