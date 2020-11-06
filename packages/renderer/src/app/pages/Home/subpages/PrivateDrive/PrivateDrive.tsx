import React, { useState } from "react";

import { DetailsSidebar, FileList, FileListItem } from "app/components";
import { useTranslationAt } from "app/utils/hooks";

import {
  FolderPath,
  PageContentContainer,
  PageHeader,
  PageContainer,
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
  const [selectedItem, setSelectedItem] = useState<FileListItem | null>(
    testItems[0]
  );

  return (
    <PageContainer>
      <PageContentContainer>
        <PageHeader>{t("header")}</PageHeader>
        <FolderPath>My Disk / Private Drive</FolderPath>
        <FileList items={testItems} onSelect={setSelectedItem} />
      </PageContentContainer>
      <DetailsSidebar
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </PageContainer>
  );
};
