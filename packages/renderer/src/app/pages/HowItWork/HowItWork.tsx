import React from "react";
import { useTranslation, Trans } from "react-i18next";

import { WelcomeContainer } from "app/components";

import {
  WelcomeText,
  DesciptionText,
  Bold,
  ContinueButton,
} from "./HowItWork.styled";

export default () => {
  const { t } = useTranslation();

  return (
    <WelcomeContainer>
      <WelcomeText>{t("pages.how_it_work.how_does_it_work")}</WelcomeText>
      <DesciptionText>
        <Trans
          i18nKey="pages.how_it_work.description"
          components={[<Bold />]}
        />
      </DesciptionText>
      <ContinueButton>{t("pages.how_it_work.continue")}</ContinueButton>
    </WelcomeContainer>
  );
};
