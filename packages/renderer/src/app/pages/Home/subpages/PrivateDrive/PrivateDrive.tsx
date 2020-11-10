import React, { useState } from "react";

import {
  DetailsSidebar,
  Edit,
  FileList,
  FileListItem,
  Info,
  MoveTo,
  MoveToModal,
  Share,
} from "app/components";
import { useTranslationAt } from "app/utils/hooks";

import {
  FolderPath,
  PageContentContainer,
  PageHeader,
  PageContainer,
  PageHeaderContainer,
  FileMenuContainer,
} from "./PrivateDrive.styled";

const testItems: FileListItem[] = [
  {
    name: "Test item",
    modifiedDate: new Date(),
    size: 1,
    type: "folder",
  },
  {
    name: "Test item 2",
    modifiedDate: new Date("01.10.2010"),
    size: 1,
    type: "file",
  },
];

export default () => {
  const { t } = useTranslationAt("pages.privateDrive");
  const [selectedItem, setSelectedItem] = useState<FileListItem | null>(null);
  const [clickedItem, setClickedItem] = useState<FileListItem | null>(null);
  const [showMoveToModal, setShowMoveToModal] = useState(false);

  return (
    <PageContainer>
      <PageContentContainer>
        <PageHeaderContainer>
          <PageHeader>{t("header")}</PageHeader>
          <FileMenuContainer visible={clickedItem != null}>
            <Edit />
            <MoveTo onClick={() => setShowMoveToModal(true)} />
            <Share />
            <Info onClick={() => setSelectedItem(clickedItem)} />
          </FileMenuContainer>
        </PageHeaderContainer>
        <FolderPath>My Disk / Private Drive</FolderPath>
        <FileList
          items={testItems}
          onSelect={setSelectedItem}
          onItemClick={setClickedItem}
          activeItem={clickedItem}
        />
      </PageContentContainer>
      <DetailsSidebar
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
      <MoveToModal
        visible={showMoveToModal}
        onClose={() => setShowMoveToModal(false)}
      />
    </PageContainer>
  );
};
