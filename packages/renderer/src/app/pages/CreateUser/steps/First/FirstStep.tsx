import React, { useCallback, useState } from "react";

import { FontVariants, TranslationAt } from "app/components";

import {
  ContinueButton,
  InputCaption,
  PageHeader,
  PasswordPrompt,
  UsernamePrompt,
} from "./FirstStep.styled";
import { useTranslationAt } from "app/utils/hooks";

const translationsPath = "pages.create_user.steps.first";

const FirstStep: React.FC<{
  onContinue(username: string, password: string): void;
}> = ({ onContinue }) => {
  const { t } = useTranslationAt(translationsPath);
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
      onContinue(username, password);
    }
  }, [password, secondPassword, username, onContinue]);

  return (
    <>
      <PageHeader>
        <TranslationAt
          atPath={translationsPath}
          i18nKey="lets_get_aquainted"
          components={[<FontVariants.Red />]}
        />
      </PageHeader>
      <InputCaption>{t("enter_your_login")}</InputCaption>
      <UsernamePrompt
        placeholder={t("username")}
        onChange={setField(setUsername)}
      />
      <InputCaption>{t("enter_your_password")}</InputCaption>
      <PasswordPrompt
        placeholder={t("password")}
        onChange={setField(setPassword)}
      />
      <InputCaption>{t("reenter_your_password")}</InputCaption>
      <PasswordPrompt
        placeholder={t("password")}
        onChange={setField(setSecondPassword)}
      />
      <ContinueButton onClick={continueHandler}>{t("continue")}</ContinueButton>
    </>
  );
};

export default FirstStep;
