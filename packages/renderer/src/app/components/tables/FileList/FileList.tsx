import { useTranslationAt } from "app/utils/hooks";
import React, { useCallback } from "react";
import moment from "moment";

import {
  AddContentDescription,
  AddContentImage,
  EmptyContentContainer,
  FileImage,
  FileListTable,
  FileListTableBody,
  FileListTableHead,
  FolderImage,
  OptionsImage,
} from "./FileList.styled";

export interface FileListItem {
  image?: string;
  name: string;
  modifiedDate: Date;
  size: number;
  type: "folder" | "file";
  fileImage?: string;
}

const getFileImage = (item: FileListItem) => {
  switch (item.type) {
    case "folder":
      return <FolderImage />;
    case "file":
      if (item.fileImage != null) {
        return null;
      }
      return <FileImage />;
  }
};

const FileList: React.FC<{
  items: FileListItem[] | null;
  onSelect(listItem: FileListItem): void;
}> = ({ items, onSelect }) => {
  const { t } = useTranslationAt("components.fileList");

  const getFileSizeCaption = useCallback(
    (size) => {
      // TODO: Adjust for megabytes, gigabytes etc...
      return t("mb", {
        size: size,
      });
    },
    [t]
  );

  if (items == null || items.length === 0) {
    return (
      <EmptyContentContainer>
        <AddContentImage />
        <AddContentDescription>{t("emptyDescription")}</AddContentDescription>
      </EmptyContentContainer>
    );
  }

  return (
    <FileListTable>
      <FileListTableHead>
        <tr>
          <td></td>
          <td>{t("fileName")}</td>
          <td>{t("lastModified")}</td>
          <td>{t("fileSize")}</td>
          <td></td>
        </tr>
      </FileListTableHead>
      <FileListTableBody>
        {items.map((item, index) => (
          <tr key={index}>
            <td>{getFileImage(item)}</td>
            <td>{item.name}</td>
            <td>
              {t("uploadedFrom", {
                from: "TestName",
                date: moment(item.modifiedDate).fromNow(),
              })}
            </td>
            <td>{getFileSizeCaption(item.size)}</td>
            <td>
              <OptionsImage onClick={() => onSelect(item)} />
            </td>
          </tr>
        ))}
      </FileListTableBody>
    </FileListTable>
  );
};

export default FileList;
