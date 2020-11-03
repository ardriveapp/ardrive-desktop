import React from "react";

import { FileList } from "app/components";

import { FolderPath, PageContainer, PageHeader } from "./PrivateDrive.styled";

const testItems = [
  {
    name: "Test item",
    modifiedDate: new Date(),
    size: 1,
  },
  {
    name: "Test item 2",
    modifiedDate: new Date(),
    size: 1,
  },
];

export default () => {
  return (
    <PageContainer>
      <PageHeader>Private Drive</PageHeader>
      <FolderPath>My Disk / Private Drive</FolderPath>
      <FileList items={testItems} />
    </PageContainer>
  );
};
