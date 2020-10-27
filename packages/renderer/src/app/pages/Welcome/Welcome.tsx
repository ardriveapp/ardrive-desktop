import React, { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import { WelcomeContainer } from "app/components";
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

  return (
    <WelcomeContainer>
      <CurrentStep />
    </WelcomeContainer>
  );
};
