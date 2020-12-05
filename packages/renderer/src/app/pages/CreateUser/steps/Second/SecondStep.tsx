import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { FontVariants, TranslationAt } from "app/components";

import {
  ButtonsContainer,
  Description,
  ImportWalletButton,
} from "./SecondStep.styled";
import { useTranslationAt } from "app/utils/hooks";
import { ArdriveHeader } from "app/components/typography/Headers.styled";
import { unwrapResult } from "@reduxjs/toolkit";
import { AppDispatch } from "app/redux";
import { appActions } from "app/redux/slices/app";

const translationsPath = "pages.create_user.steps.second";

const SecondStep: React.FC<{
  onContinue(walletPath: string): void;
}> = ({ onContinue }) => {
  const { t } = useTranslationAt(translationsPath);
  const dispatch: AppDispatch = useDispatch();
  const [walletPath, setWalletPath] = useState<string | null>(null);

  const openFile = useCallback(async () => {
    const result = await dispatch(appActions.openFile());
    const walletPath = unwrapResult(result);

    setWalletPath(walletPath);
  }, [dispatch]);

  useEffect(() => {
    if (walletPath) {
      onContinue(walletPath);
    }
  }, [walletPath, onContinue]);

  return (
    <>
      <ArdriveHeader>{t("choose_your_wallet")}</ArdriveHeader>
      <Description>
        <TranslationAt
          atPath={translationsPath}
          i18nKey="wallet_description"
          components={[<FontVariants.Bold />]}
        />
      </Description>
      <ButtonsContainer>
        <ImportWalletButton>{t("create_new")}</ImportWalletButton>
        <ImportWalletButton onClick={openFile}>
          {t("import_existing")}
        </ImportWalletButton>
      </ButtonsContainer>
    </>
  );
};

export default SecondStep;
