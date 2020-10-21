import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { appActions } from "../../redux/actions";
import { appSelectors } from "../../redux/selectors";

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

const SecondStep: React.FC<{
  onContinue(): void;
}> = ({ onContinue }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const openFilePath = useSelector(appSelectors.getOpenFilePath);

  const openFile = useCallback(async () => {
    dispatch(appActions.openFile());
  }, []);

  useEffect(() => {
    if (openFilePath) {
      onContinue();
    }
  }, [openFilePath]);

  return (
    <>
      <span>{t("pages.create_user.choose_your_wallet")}</span>
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
        return () => <SecondStep onContinue={goNextStep} />;
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
