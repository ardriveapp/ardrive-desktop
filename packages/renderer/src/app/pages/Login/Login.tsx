import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { authActions } from "../../redux/actions";

import {
  LoginPageContainer,
  AppLogo,
  UsernamePrompt,
  PasswordPrompt,
  UnlockButton,
  SetupNewUserButton,
  NeedHelpButton,
} from "./Login.styled";

export default () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const login = useCallback(() => {
    dispatch(authActions.loginStart(username, password));
  }, [username, password]);

  const setField = useCallback((setFunction: any) => {
    return (event: any) => {
      setFunction(event.currentTarget.value);
    };
  }, []);

  const createNewUser = useCallback(() => {
    history.push("/create-user");
  }, []);

  return (
    <LoginPageContainer>
      <AppLogo />
      <UsernamePrompt
        placeholder={t("pages.login.username")}
        onChange={setField(setUsername)}
      />
      <PasswordPrompt
        placeholder={t("pages.login.password")}
        onChange={setField(setPassword)}
      />
      <UnlockButton onClick={login}>
        {t("pages.login.unlock_button")}
      </UnlockButton>
      <SetupNewUserButton onClick={createNewUser}>
        {t("pages.login.setup_new_user")}
      </SetupNewUserButton>
      <NeedHelpButton>{t("pages.login.need_help")}</NeedHelpButton>
    </LoginPageContainer>
  );
};
