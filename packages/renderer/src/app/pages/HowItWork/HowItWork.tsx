import React, { useCallback } from "react";
import { useTranslation, Trans } from "react-i18next";

import { WelcomeContainer } from "app/components";

import {
  WelcomeText,
  DesciptionText,
  Bold,
  ContinueButton,
} from "./HowItWork.styled";
import { useHistory } from "react-router-dom";

export default () => {
  const { t } = useTranslation();
  const history = useHistory();

  const continueHandler = useCallback(() => {
    history.push("/create-user");
  }, [history]);

  return (
    <WelcomeContainer>
      <WelcomeText>{t("pages.how_it_work.how_does_it_work")}</WelcomeText>
      <DesciptionText>
        <Trans
          i18nKey="pages.how_it_work.description"
          components={[<Bold />]}
        />
      </DesciptionText>
      <ContinueButton onClick={continueHandler}>
        {t("pages.how_it_work.continue")}
      </ContinueButton>
    </WelcomeContainer>
  );
};
