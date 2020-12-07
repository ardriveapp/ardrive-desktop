import { useTranslationAt } from "app/utils/hooks";
import React from "react";
import moment from "moment";
import prettyBytes from "pretty-bytes";

import {
  AddContentDescription,
  AddContentImage,
  EmptyContentContainer,
  FileImage,
  FileListTable,
  FileListTableBody,
  FileListTableHead,
  FileListTableRow,
  FolderImage,
  ItemContent,
  OptionsImage,
} from "./FileList.styled";
import { ArDriveFile } from "app/redux/types";

const getFileImage = (item: ArDriveFile) => {
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
  hideHeader?: boolean;
  hideOptions?: boolean;
  items: ArDriveFile[] | null;
  onSelect(listItem: ArDriveFile): void;
  onItemClick(listItem: ArDriveFile): void;
  activeItem: ArDriveFile | null;
}> = ({
  items,
  onSelect,
  onItemClick,
  activeItem,
  hideHeader,
  hideOptions,
}) => {
  const { t } = useTranslationAt("components.fileList");

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
      {!hideHeader && (
        <FileListTableHead>
          <tr>
            <td></td>
            <td>{t("fileName")}</td>
            <td>{t("lastModified")}</td>
            <td>{t("fileSize")}</td>
            <td></td>
          </tr>
        </FileListTableHead>
      )}
      <FileListTableBody>
        {items.map((item, index) => (
          <FileListTableRow
            key={index}
            onClick={() => onItemClick(item)}
            active={activeItem === item}
          >
            <td>{getFileImage(item)}</td>
            <td>
              <ItemContent>
                <span> {item.name}</span>
                <span>
                  {t("uploadedFrom", {
                    from: "TestName",
                    date: moment(item.modifiedDate).fromNow(),
                  })}
                </span>
                {item.type === "file" && (
                  <span>{prettyBytes(item.size || 0)}</span>
                )}
              </ItemContent>
            </td>
            {!hideOptions && (
              <td>
                <OptionsImage onClick={() => onSelect(item)} />
              </td>
            )}
          </FileListTableRow>
        ))}
      </FileListTableBody>
    </FileListTable>
  );
};

export default FileList;
