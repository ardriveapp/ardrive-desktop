import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { appSelectors } from "app/redux/selectors";
import { appActions } from "app/redux/actions";
import { FontVariants, TranslationAt } from "app/components";

import {
  ButtonsContainer,
  Description,
  ImportWalletButton,
} from "./SecondStep.styled";
import { useTranslationAt } from "app/utils/hooks";
import { ArdriveHeader } from "app/components/typography/Headers.styled";

export const WalletPathName = "wallet_path";

const translationsPath = "pages.create_user.steps.second";

const SecondStep: React.FC<{
  onContinue(): void;
}> = ({ onContinue }) => {
  const { t } = useTranslationAt(translationsPath);
  const dispatch = useDispatch();
  const walletPath = useSelector(
    appSelectors.getOpenedFilePath(WalletPathName)
  );

  const openFile = useCallback(async () => {
    dispatch(appActions.openFile(WalletPathName));
  }, [dispatch]);

  useEffect(() => {
    if (walletPath) {
      onContinue();
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
