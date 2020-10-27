import React from "react";

import {
  AppTextLogo,
  FontVariants,
  RoundedButton,
  TranslationAt,
} from "app/components";

import { DesciptionText, WelcomeText } from "./FirstStep.styled";
import { useTranslationAt } from "app/utils/hooks";

const translationsPath = "pages.welcome.steps.first";

const FirstStep: React.FC<{
  onContinue(): void;
}> = ({ onContinue }) => {
  const { t } = useTranslationAt(translationsPath);

  return (
    <>
      <WelcomeText>{t("welcome_to")}</WelcomeText>
      <AppTextLogo />
      <DesciptionText>
        <TranslationAt
          atPath={translationsPath}
          i18nKey="description"
          components={[<FontVariants.Red />]}
        />
      </DesciptionText>
      <RoundedButton onClick={onContinue}>{t("jump_in")}</RoundedButton>
    </>
  );
};

export default FirstStep;
