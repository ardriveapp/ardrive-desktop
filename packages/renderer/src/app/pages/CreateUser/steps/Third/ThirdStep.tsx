import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { FontVariants, TranslationAt } from "app/components";

import {
  Description,
  LetsGoButton,
  SelectSyncFolderButton,
} from "./ThirdStep.styled";
import { useTranslationAt } from "app/utils/hooks";
import { ArdriveHeader } from "app/components/typography/Headers.styled";
import { unwrapResult } from "@reduxjs/toolkit";
import { AppDispatch } from "app/redux";
import { appActions } from "app/redux/slices/app";

const translationsPath = "pages.create_user.steps.third";

const ThirdStep: React.FC<{
  onContinue(syncFolderPath: string): void;
}> = ({ onContinue }) => {
  const { t } = useTranslationAt(translationsPath);
  const dispatch: AppDispatch = useDispatch();
  const [syncFolderPath, setSyncFolderPath] = useState<string | null>(null);

  const openFolder = useCallback(async () => {
    const result = await dispatch(appActions.openFolder());
    const syncFolderPath = unwrapResult(result);

    setSyncFolderPath(syncFolderPath);
  }, [dispatch]);

  const letsGo = useCallback(() => {
    if (syncFolderPath) {
      onContinue(syncFolderPath);
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
      <SelectSyncFolderButton onClick={openFolder}>
        {syncFolderPath || t("select_sync_folder")}
      </SelectSyncFolderButton>
      <LetsGoButton onClick={letsGo}>{t("lets_go")}</LetsGoButton>
    </>
  );
};

export default ThirdStep;
