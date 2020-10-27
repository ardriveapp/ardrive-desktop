import React from "react";

import { FontVariants, TranslationAt } from "app/components";
import { useTranslationAt } from "app/utils/hooks";

import {
  ContinueButton,
  DesciptionText,
  WelcomeText,
} from "./SecondStep.styled";

const translationsPath = "pages.welcome.steps.second";

const SecondStep: React.FC<{
  onContinue(): void;
}> = ({ onContinue }) => {
  const { t } = useTranslationAt(translationsPath);

  return (
    <>
      <WelcomeText>{t("how_does_it_work")}</WelcomeText>
      <DesciptionText>
        <TranslationAt
          atPath={translationsPath}
          i18nKey="how_it_work_description"
          components={[<FontVariants.Bold />]}
        />
      </DesciptionText>
      <ContinueButton onClick={onContinue}>{t("continue")}</ContinueButton>
    </>
  );
};

export default SecondStep;
