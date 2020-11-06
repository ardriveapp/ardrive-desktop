import React from "react";

import { FileListItem } from "app/components/tables";
import { ArdriveSlider } from "app/components";
import { useTranslationAt } from "app/utils/hooks";

import {
  CloseButton,
  ContentContainer,
  DetailsSidebarContainer,
  ItemName,
  TopItemsContainer,
} from "./DetailsSidebar.styled";

const DetailsSidebar: React.FC<{
  onClose(): void;
  item: FileListItem | null;
}> = ({ onClose, item }) => {
  const { t } = useTranslationAt("components.detailsSidebar");

  return (
    <DetailsSidebarContainer visible={item != null}>
      <TopItemsContainer>
        <ItemName>{item?.name}</ItemName>
        <CloseButton onClick={onClose} />
      </TopItemsContainer>
      <ContentContainer>
        <ArdriveSlider variants={[t("details"), t("activity")]} name="test" />
      </ContentContainer>
    </DetailsSidebarContainer>
  );
};

export default DetailsSidebar;
