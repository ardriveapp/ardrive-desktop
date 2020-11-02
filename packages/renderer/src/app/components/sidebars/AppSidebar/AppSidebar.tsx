import React from "react";

import { ButtonWithIcon } from "app/components";
import { useTranslationAt } from "app/utils/hooks";

import {
  BottomContainer,
  Delimiter,
  GroupHeader,
  SidebarContainer,
} from "./AppSidebar.styled";

export default () => {
  const { t } = useTranslationAt("components.sidebar");

  return (
    <SidebarContainer>
      <ButtonWithIcon icon="folder">{t("create_new")}</ButtonWithIcon>
      <ButtonWithIcon icon="upload" transparent>
        {t("uploads")}
      </ButtonWithIcon>
      <Delimiter />
      <GroupHeader>{t("drives")}</GroupHeader>
      <ButtonWithIcon active icon="private" transparent>
        {t("personal")}
      </ButtonWithIcon>
      <ButtonWithIcon icon="public" transparent>
        {t("public")}
      </ButtonWithIcon>
      <Delimiter />
      <ButtonWithIcon icon="share" transparent>
        {t("shared")}
      </ButtonWithIcon>
      <BottomContainer>
        <ButtonWithIcon icon="help" transparent>
          {t("help")}
        </ButtonWithIcon>
      </BottomContainer>
    </SidebarContainer>
  );
};
