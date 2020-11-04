import React from "react";

import { FileList, FileListItem } from "app/components";

import { FolderPath, PageContainer, PageHeader } from "./PrivateDrive.styled";
import { useTranslationAt } from "app/utils/hooks";

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

  return (
    <PageContainer>
      <PageHeader>{t("header")}</PageHeader>
      <FolderPath>My Disk / Private Drive</FolderPath>
      <FileList items={testItems} />
    </PageContainer>
  );
};
