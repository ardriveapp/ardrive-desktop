import React from "react";

import { useTranslationAt } from "app/utils/hooks";

import {
  StepButton,
  DesciptionText,
  WelcomeText,
  ButtonsContainer,
} from "./SecondStep.styled";

const translationsPath = "pages.welcome.steps.second";

const SecondStep: React.FC<{
  onContinue(): void;
  onBack(): void;
  title: string;
  description: string;
}> = ({ onContinue, onBack, title, description }) => {
  const { t } = useTranslationAt(translationsPath);

  return (
    <>
      <WelcomeText>{title}</WelcomeText>
      <DesciptionText>{description}</DesciptionText>
      <ButtonsContainer>
        <StepButton onClick={onBack}>{t("back")}</StepButton>
        <StepButton onClick={onContinue}>{t("next")}</StepButton>
      </ButtonsContainer>
    </>
  );
};

export default SecondStep;
