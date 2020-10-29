import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { authActions } from "app/redux/actions";
import { appSelectors } from "app/redux/selectors";

import { CreateUser, WelcomeContainer } from "app/components";

import {
  FirstStep,
  SecondStep,
  SyncFolderPathName,
  ThirdStep,
  WalletPathName,
} from "./steps";

export default () => {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const firstStepCompleted = useCallback(
    (username: string, password: string) => {
      setUsername(username);
      setPassword(password);
      setStep((prev) => prev + 1);
    },
    []
  );

  const goNextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const walletPath = useSelector(
    appSelectors.getOpenedFilePath(WalletPathName)
  );
  const syncFolderPath = useSelector(
    appSelectors.getOpenedFolderPath(SyncFolderPathName)
  );

  const completeRegistration = useCallback(() => {
    if (username && password && walletPath && syncFolderPath) {
      dispatch(
        authActions.createUser(username, password, syncFolderPath, walletPath)
      );
    }
  }, [dispatch, username, password, walletPath, syncFolderPath]);

  const CurrentStep = useMemo(() => {
    switch (step) {
      case 0:
        return () => <FirstStep onContinue={firstStepCompleted} />;
      case 1:
        return () => <SecondStep onContinue={goNextStep} />;
      case 2:
        return () => <ThirdStep onContinue={completeRegistration} />;
      default:
        return React.Fragment;
    }
  }, [step, goNextStep, completeRegistration, firstStepCompleted]);

  return (
    <WelcomeContainer rightImage={<CreateUser />}>
      <CurrentStep />
    </WelcomeContainer>
  );
};
