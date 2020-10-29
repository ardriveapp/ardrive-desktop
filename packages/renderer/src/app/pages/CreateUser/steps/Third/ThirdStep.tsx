import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { appSelectors } from "app/redux/selectors";
import { appActions } from "app/redux/actions";
import { FontVariants, TranslationAt } from "app/components";

import {
  Description,
  LetsGoButton,
  SelectSyncFolderButton,
} from "./ThirdStep.styled";
import { useTranslationAt } from "app/utils/hooks";
import { ArdriveHeader } from "app/components/typography/Headers.styled";

export const SyncFolderPathName = "sync_folder_path";

const translationsPath = "pages.create_user.steps.third";

const ThirdStep: React.FC<{
  onContinue(): void;
}> = ({ onContinue }) => {
  const { t } = useTranslationAt(translationsPath);
  const dispatch = useDispatch();
  const syncFolderPath = useSelector(
    appSelectors.getOpenedFolderPath(SyncFolderPathName)
  );

  const openFile = useCallback(async () => {
    dispatch(appActions.openFolder(SyncFolderPathName));
  }, [dispatch]);

  const letsGo = useCallback(() => {
    if (syncFolderPath) {
      onContinue();
    }
  }, [syncFolderPath, onContinue]);

  return (
    <>
      <ArdriveHeader>
        {
          <TranslationAt
            atPath={translationsPath}
            i18nKey="your_path"
            components={[<FontVariants.Red />]}
          />
        }
      </ArdriveHeader>
      <Description>
        <TranslationAt
          atPath={translationsPath}
          i18nKey="path_description"
          components={[<FontVariants.Bold />]}
        />
      </Description>
      <SelectSyncFolderButton onClick={openFile}>
        {syncFolderPath || t("select_sync_folder")}
      </SelectSyncFolderButton>
      <LetsGoButton onClick={letsGo}>{t("lets_go")}</LetsGoButton>
    </>
  );
};

export default ThirdStep;
