import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { CreateUser, Sync, Wallet, WelcomeContainer } from "app/components";

import { FirstStep, SecondStep, ThirdStep } from "./steps";
import { authActions } from "app/redux/slices/auth";

export default () => {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [walletPath, setWalletPath] = useState<string | null>(null);
  const dispatch = useDispatch();

  const firstStepCompleted = useCallback(
    (username: string, password: string) => {
      setUsername(username);
      setPassword(password);
      setStep((prev) => prev + 1);
    },
    []
  );

  const secondtStepCompleted = useCallback((walletPath: string) => {
    setWalletPath(walletPath);
    goNextStep();
  }, []);

  const goNextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const completeRegistration = useCallback(
    (syncFolderPath: string) => {
      if (username && password && walletPath && syncFolderPath) {
        dispatch(
          authActions.createUser({
            username,
            password,
            syncFolderPath,
            walletPath,
          })
        );
      }
    },
    [dispatch, username, password, walletPath]
  );

  const CurrentStep = useMemo(() => {
    switch (step) {
      case 0:
        return () => <FirstStep onContinue={firstStepCompleted} />;
      case 1:
        return () => <SecondStep onContinue={secondtStepCompleted} />;
      case 2:
        return () => <ThirdStep onContinue={completeRegistration} />;
      default:
        return React.Fragment;
    }
  }, [step, goNextStep, completeRegistration, firstStepCompleted]);

  const CurrentImage = useMemo(() => {
    switch (step) {
      case 0:
        return <CreateUser />;
      case 1:
        return <Wallet />;
      case 2:
        return <Sync />;
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
