import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { appActions } from "../../redux/actions";

import {
  CreateUserPageContainer,
  UsernamePrompt,
  PasswordPrompt,
  ContinueButton,
  CreateNewButton,
  ImportExistingButton,
} from "./CreateUser.styled";

const FirstStep: React.FC<{
  onContinue(): void;
}> = ({ onContinue }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");

  const setField = useCallback((setFunction: any) => {
    return (event: any) => {
      setFunction(event.currentTarget.value);
    };
  }, []);

  const continueHandler = useCallback(() => {
    const passwordEquals =
      password != null && secondPassword != null && password === secondPassword;
    if (username && passwordEquals) {
      onContinue();
    }
  }, [password, secondPassword, username]);

  return (
    <>
      <UsernamePrompt
        placeholder={t("pages.create_user.username")}
        onChange={setField(setUsername)}
      />
      <PasswordPrompt
        placeholder={t("pages.create_user.password")}
        onChange={setField(setPassword)}
      />
      <PasswordPrompt
        placeholder={t("pages.create_user.reenter_password")}
        onChange={setField(setSecondPassword)}
      />
      <ContinueButton onClick={continueHandler}>
        {t("pages.create_user.continue")}
      </ContinueButton>
    </>
  );
};

const SecondStep = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const openFile = useCallback(async () => {
    const res = await dispatch(appActions.openFile());
  }, []);

  return (
    <>
      <span>Choose your wallet</span>
      <CreateNewButton>{t("pages.create_user.create_new")}</CreateNewButton>
      <ImportExistingButton onClick={openFile}>
        {t("pages.create_user.import_existing")}
      </ImportExistingButton>
    </>
  );
};

const ThirdStep = () => {
  return <h1>Third step</h1>;
};

export default () => {
  const [step, setStep] = useState(1);

  const goNextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const CurrentStep = useMemo(() => {
    switch (step) {
      case 0:
        return () => <FirstStep onContinue={goNextStep} />;
      case 1:
        return SecondStep;
      case 2:
        return ThirdStep;
      default:
        return React.Fragment;
    }
  }, [step]);

  return (
    <CreateUserPageContainer>
      <CurrentStep />
    </CreateUserPageContainer>
  );
};
