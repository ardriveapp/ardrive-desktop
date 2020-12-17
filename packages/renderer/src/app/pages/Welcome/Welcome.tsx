import React, { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import {
  FirstWelcomeStep,
  SecondWelcomeStep,
  WelcomeContainer,
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

  const goNext = useCallback(() => {
    setSubStep((prev) => prev + 1);
  }, []);

  const goBack = useCallback(() => {
    if (subStep === 0) {
      setStep(0);
      return;
    }
    setSubStep((prev) => prev - 1);
  }, [subStep]);

  const continueHandler = useCallback(() => {
    history.push("/create-user");
  }, [history]);

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
  }, [step, subStep, goNext, goBack, continueHandler]);

  const CurrentImage = useMemo(() => {
    switch (step) {
      case 0:
        return <FirstWelcomeStep />;
      case 1:
        return <SecondWelcomeStep />;
      default:
        return React.Fragment;
    }
  }, [step]);

  return (
    <WelcomeContainer rightImage={CurrentImage}>
      <CurrentStep />
    </WelcomeContainer>
  );
};
