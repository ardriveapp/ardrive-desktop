import React, { useCallback, useMemo, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { useHistory } from "react-router-dom";

import { RoundedButton, WelcomeContainer, AppTextLogo } from "app/components";

import {
  WelcomeText,
  DesciptionText,
  Red,
  Bold,
  ContinueButton,
  HowItWorkDesciptionText,
} from "./Welcome.styled";

const FirstStep: React.FC<{
  onContinue(): void;
}> = ({ onContinue }) => {
  const { t } = useTranslation();

  return (
    <>
      <WelcomeText>{t("pages.welcome.welcome_to")}</WelcomeText>
      <AppTextLogo />
      <DesciptionText>
        <Trans i18nKey="pages.welcome.description" components={[<Red />]} />
      </DesciptionText>
      <RoundedButton onClick={onContinue}>
        {t("pages.welcome.jump_in")}
      </RoundedButton>
    </>
  );
};

const SecondStep: React.FC<{
  onContinue(): void;
}> = ({ onContinue }) => {
  const { t } = useTranslation();

  return (
    <>
      <WelcomeText>{t("pages.welcome.how_does_it_work")}</WelcomeText>
      <HowItWorkDesciptionText>
        <Trans
          i18nKey="pages.welcome.how_it_work_description"
          components={[<Bold />]}
        />
      </HowItWorkDesciptionText>
      <ContinueButton onClick={onContinue}>
        {t("pages.welcome.continue")}
      </ContinueButton>
    </>
  );
};

export default () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [step, setStep] = useState(0);

  const jumpIn = useCallback(() => {
    setStep(1);
  }, [history]);

  const continueHandler = useCallback(() => {
    history.push("/create-user");
  }, [history]);

  const CurrentStep = useMemo(() => {
    switch (step) {
      case 0:
        return () => <FirstStep onContinue={jumpIn} />;
      case 1:
        return () => <SecondStep onContinue={continueHandler} />;
      default:
        return React.Fragment;
    }
  }, [step]);

  return (
    <WelcomeContainer>
      <CurrentStep />
    </WelcomeContainer>
  );
};
