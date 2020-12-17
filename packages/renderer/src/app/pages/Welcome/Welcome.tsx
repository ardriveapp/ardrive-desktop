import React, { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import {
  FirstWelcomeStep,
  NeverDeletedStep,
  PayPerFileStep,
  SecondsFromForewerStep,
  TotalPrivacyStep,
  WelcomeContainer,
  WelcomeToPermawebStep,
} from "app/components";
import { FirstStep, SecondStep } from "./steps";
import { useTranslationAt } from "app/utils/hooks";

export default () => {
  const history = useHistory();
  const [step, setStep] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const { t } = useTranslationAt("pages.welcome.steps");

  const jumpIn = useCallback(() => {
    setStep(1);
  }, []);

  const continueHandler = useCallback(() => {
    history.push("/create-user");
  }, [history]);

  const goNext = useCallback(() => {
    if (subStep === 4) {
      continueHandler();
    }
    setSubStep((prev) => prev + 1);
  }, [subStep, continueHandler]);

  const goBack = useCallback(() => {
    if (subStep === 0) {
      setStep(0);
      return;
    }
    setSubStep((prev) => prev - 1);
  }, [subStep]);

  const CurrentStep = useMemo(() => {
    switch (step) {
      case 0:
        return () => <FirstStep onContinue={jumpIn} />;
      case 1:
        return () => (
          <SecondStep
            title={t(`second.substeps.${subStep}.title`)}
            description={t(`second.substeps.${subStep}.description`)}
            onContinue={goNext}
            onBack={goBack}
          />
        );
      default:
        return React.Fragment;
    }
  }, [step, subStep, goNext, goBack, t, jumpIn]);

  const CurrentImage = useMemo(() => {
    switch (step) {
      case 0:
        return <FirstWelcomeStep />;
      case 1:
        switch (subStep) {
          case 0:
            return <WelcomeToPermawebStep />;
          case 1:
            return <PayPerFileStep />;
          case 2:
            return <SecondsFromForewerStep />;
          case 3:
            return <TotalPrivacyStep />;
          case 4:
            return <NeverDeletedStep />;
          default:
            return React.Fragment;
        }
      default:
        return React.Fragment;
    }
  }, [step, subStep]);

  return (
    <WelcomeContainer useLogoWithText={step > 0} rightImage={CurrentImage}>
      <CurrentStep />
    </WelcomeContainer>
  );
};
