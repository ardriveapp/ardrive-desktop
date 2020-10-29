import React, { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import {
  FirstWelcomeStep,
  SecondWelcomeStep,
  WelcomeContainer,
} from "app/components";
import { FirstStep, SecondStep } from "./steps";

export default () => {
  const history = useHistory();
  const [step, setStep] = useState(0);

  const jumpIn = useCallback(() => {
    setStep(1);
  }, []);

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
  }, [step, jumpIn, continueHandler]);

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
