import React from "react";
import { useTranslation, Trans } from "react-i18next";

import { RoundedButton, WelcomeContainer } from "app/components";

import { AppText, WelcomeText, DesciptionText, Red } from "./Welcome.styled";

export default () => {
  const { t } = useTranslation();

  return (
    <WelcomeContainer>
      <WelcomeText>{t("pages.welcome.welcome_to")}</WelcomeText>
      <AppText />
      <DesciptionText>
        <Trans i18nKey="pages.welcome.description" components={[<Red />]} />
      </DesciptionText>
      <RoundedButton>{t("pages.welcome.jump_in")}</RoundedButton>
    </WelcomeContainer>
  );
};
