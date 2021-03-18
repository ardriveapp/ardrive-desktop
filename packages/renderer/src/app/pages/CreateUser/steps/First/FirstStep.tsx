import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { AppTextLogo, RoundedButton } from "app/components";

import { CreateUserFormContainer, WarningText, HelperText } from "./FirstStep.styled";
import { PolicyContainer, AgreeText, AgreePolicyCheckBox, UsageLink } from 'app/pages/Login/Login.styled';
import { useTranslationAt } from "app/utils/hooks";
import { ArdriveInput } from "app/components/inputs/ArdriveInput";
import { ArdriveHeader } from "app/components/typography/Headers.styled";
import { appActions } from "app/redux/slices/app";

const translationsPath = "pages.create_user.steps.first";

const FirstStep: React.FC<{
  onContinue(username: string, password: string): void;
}> = ({ onContinue }) => {
  const { t } = useTranslationAt(translationsPath);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [agreeStatus, setAgree] = useState(false);
  const [error, setError] = useState(false);

  const setField = useCallback((setFunction: any) => {
    return (event: any) => {
      setFunction(event.currentTarget.value);
    };
  }, []);

  const continueHandler = useCallback(() => {
    if (!agreeStatus) {
      alert(t("agree_warning"));
      return
    }
    const passwordEquals =
      password != null && secondPassword != null && password === secondPassword;

    if (username && passwordEquals) {
      setError(false);
      onContinue(username, password);
    } else setError(true);
  }, [password, secondPassword, username, onContinue, agreeStatus, t]);

  return (
    <>
      <ArdriveHeader>{t("create_account")}</ArdriveHeader>
      <AppTextLogo />
      <CreateUserFormContainer>
        <HelperText>{t("helper_text")}</HelperText>
        <ArdriveInput
          placeholder={t("username")}
          onChange={setField(setUsername)}
        />
        <ArdriveInput
          type="password"
          placeholder={t("password")}
          onChange={setField(setPassword)}
        />
        <ArdriveInput
          type="password"
          placeholder={t("confirm_password")}
          onChange={setField(setSecondPassword)}
        />
        {error && <WarningText>{t("unmatch_warning")}</WarningText>}
        <PolicyContainer>
          <AgreePolicyCheckBox type="checkbox" onChange={() => setAgree(!agreeStatus)} />
          <div>
            <AgreeText>{t("agree_text")}</AgreeText>
            <UsageLink onClick={() => dispatch(appActions.openUsageLink())}>{t("usage_policy")}</UsageLink>
          </div>
        </PolicyContainer>
        <RoundedButton onClick={continueHandler}>{t("continue")}</RoundedButton>
      </CreateUserFormContainer>
    </>
  );
};

export default FirstStep;
