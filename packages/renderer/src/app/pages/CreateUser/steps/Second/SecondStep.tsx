import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { appSelectors } from "app/redux/selectors";
import { appActions } from "app/redux/actions";
import { FontVariants, TranslationAt } from "app/components";

import {
  CreateNewButton,
  Description,
  ImportExistingButton,
  PageHeader,
} from "./SecondStep.styled";
import { useTranslationAt } from "app/utils/hooks";

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
      <PageHeader>
        <TranslationAt
          atPath={translationsPath}
          i18nKey="choose_your_wallet"
          components={[<FontVariants.Bold />]}
        />
      </PageHeader>
      <Description>
        <TranslationAt
          atPath={translationsPath}
          i18nKey="wallet_description"
          components={[<FontVariants.Bold />, <FontVariants.Red />]}
        />
      </Description>
      <CreateNewButton>{t("create_new")}</CreateNewButton>
      <ImportExistingButton onClick={openFile}>
        {t("import_existing")}
      </ImportExistingButton>
    </>
  );
};

export default SecondStep;
