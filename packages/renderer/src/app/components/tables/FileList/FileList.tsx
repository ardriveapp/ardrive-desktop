import React, { useState, useCallback } from "react";
import moment from "moment";
import prettyBytes from "pretty-bytes";

import {
  AddContentDescription,
  AddContentImage,
  EmptyContentContainer,
  FileDetailsContainer,
  FileDetailsFeature,
  FileDetailsFeatureContainer,
  FileDetailsFeatureValue,
  FileDetailsFeatureName,
  FileDetailsFileName,
  FileDetailsMenuBar,
  FileImage,
  FileListTable,
  FileListTableBody,
  FileListTableHead,
  FileListTableRow,
  FolderImage,
  ItemContent,
  OptionsImage,
  StyledPopover,
} from "./FileList.styled";
import { ArDriveFile } from "app/redux/types";
import { Cloud, Share, Lock, PublicUrl } from "app/components/images";
import { useTranslationAt } from "app/utils/hooks";

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

const FileDetails: React.FC<{
  file: ArDriveFile | null;
}> = ({ file }) => {
  const { t } = useTranslationAt("components.fileList");

  if (file == null) {
    return null;
  }

  return (
    <FileDetailsContainer>
      <FileDetailsFileName>{file.name}</FileDetailsFileName>
      <FileDetailsMenuBar>
        <Lock />
        <PublicUrl />
        <Cloud />
        <Share />
      </FileDetailsMenuBar>
      <FileDetailsFeatureContainer>
        <FileDetailsFeature>
          <FileDetailsFeatureName>{t("id")}</FileDetailsFeatureName>
          <FileDetailsFeatureValue>{file.id}</FileDetailsFeatureValue>
        </FileDetailsFeature>
        <FileDetailsFeature>
          <FileDetailsFeatureName>{t("owner")}</FileDetailsFeatureName>
          <FileDetailsFeatureValue>{file.owner}</FileDetailsFeatureValue>
        </FileDetailsFeature>
        <FileDetailsFeature>
          <FileDetailsFeatureName>{t("location")}</FileDetailsFeatureName>
          <FileDetailsFeatureValue>{file.location}</FileDetailsFeatureValue>
        </FileDetailsFeature>
        <FileDetailsFeature>
          <FileDetailsFeatureName>{t("modified")}</FileDetailsFeatureName>
          <FileDetailsFeatureValue>
            {moment(file.modifiedDate).format("MMM DD, YYYY")}
          </FileDetailsFeatureValue>
        </FileDetailsFeature>
      </FileDetailsFeatureContainer>
    </FileDetailsContainer>
  );
};

const FileList: React.FC<{
  hideHeader?: boolean;
  hideOptions?: boolean;
  items: ArDriveFile[] | null;
  onItemClick(listItem: ArDriveFile): void;
  activeItem: ArDriveFile | null;
}> = ({ items, onItemClick, activeItem, hideHeader, hideOptions }) => {
  const { t } = useTranslationAt("components.fileList");
  const [selectedItem, setSelectedItem] = useState<ArDriveFile | null>(null);

  const selectItemHandler = useCallback(
    (item) => {
      if (item === selectedItem) {
        return;
      }
      setSelectedItem(item);
    },
    [selectedItem]
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
        {items
          .filter((item) => item.type !== "folder")
          .map((item, index) => (
            <FileListTableRow
              key={index}
              onClick={() => onItemClick(item)}
              active={activeItem === item}
            >
              <StyledPopover
                isOpen={selectedItem === item}
                body={<FileDetails file={selectedItem} />}
              >
                <td>{getFileImage(item)}</td>
              </StyledPopover>
              <td>
                <ItemContent>
                  <span> {item.name}</span>
                  <span>
                    {item.syncStatus === "downloaded" &&
                      t("downloadedFrom", {
                        from: item.driveName,
                        date: moment(item.modifiedDate).fromNow(),
                      })}
                    {item.syncStatus === "uploaded" &&
                      t("uploadedFrom", {
                        from: item.driveName,
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
                  <OptionsImage onClick={() => selectItemHandler(item)} />
                </td>
              )}
            </FileListTableRow>
          ))}
      </FileListTableBody>
    </FileListTable>
  );
};

export default FileList;
