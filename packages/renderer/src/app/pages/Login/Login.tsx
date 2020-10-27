import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { authActions } from "app/redux/actions";
import { AppLogo, AppTextLogo } from "app/components";
import { useTranslationAt } from "app/utils/hooks";

import {
  LoginPageContainer,
  UsernamePrompt,
  PasswordPrompt,
  UnlockButton,
  SetupNewUserButton,
  NeedHelpButton,
  TopCorder,
} from "./Login.styled";

export default () => {
  const { t } = useTranslationAt("pages.login");
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const login = useCallback(() => {
    dispatch(authActions.loginStart(username, password));
  }, [dispatch, username, password]);

  const setField = useCallback((setFunction: any) => {
    return (event: any) => {
      setFunction(event.currentTarget.value);
    };
  }, []);

  const createNewUser = useCallback(() => {
    history.push("/create-user");
  }, [history]);

  return (
    <LoginPageContainer>
      <TopCorder />
      <AppLogo />
      <AppTextLogo />
      <UsernamePrompt
        placeholder={t("username")}
        onChange={setField(setUsername)}
      />
      <PasswordPrompt
        placeholder={t("password")}
        onChange={setField(setPassword)}
      />
      <UnlockButton onClick={login}>{t("unlock_button")}</UnlockButton>
      <SetupNewUserButton onClick={createNewUser}>
        {t("setup_new_user")}
      </SetupNewUserButton>
      <NeedHelpButton>{t("need_help")}</NeedHelpButton>
    </LoginPageContainer>
  );
};
