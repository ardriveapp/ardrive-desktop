import React from "react";
import { useTranslation } from "react-i18next";

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

  return (
    <LoginPageContainer>
      <AppLogo />
      <UsernamePrompt placeholder={t("pages.login.username")} />
      <PasswordPrompt placeholder={t("pages.login.password")} />
      <UnlockButton>{t("pages.login.unlock_button")}</UnlockButton>
      <SetupNewUserButton>{t("pages.login.setup_new_user")}</SetupNewUserButton>
      <NeedHelpButton>{t("pages.login.need_help")}</NeedHelpButton>
    </LoginPageContainer>
  );
};
