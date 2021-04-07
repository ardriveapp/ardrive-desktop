import { StringMap, TFunction, TFunctionKeys, TOptions } from 'i18next';
import { useTranslation } from 'react-i18next';

export const useTranslationAt = (path: string) => {
	const { t, ...rest } = useTranslation();

	const newT: TFunction = (key: TFunctionKeys | TFunctionKeys[], options?: TOptions<StringMap> | string) =>
		t(`${path}.${key}`, options);

	return {
		t: newT,
		...rest
	};
};
