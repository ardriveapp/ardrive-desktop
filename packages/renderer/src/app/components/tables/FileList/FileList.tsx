import React from "react";

import {
  FileListTable,
  FileListTableBody,
  FileListTableHead,
} from "./FileList.styled";

interface FileListItem {
  image?: string;
  name: string;
  modifiedDate: Date;
  size: number;
}

const FileList: React.FC<{
  items: FileListItem[];
}> = ({ items }) => {
  return (
    <FileListTable>
      <FileListTableHead>
        <tr>
          <td></td>
          <td>File Name</td>
          <td>Last Modified Date</td>
          <td>File Size</td>
        </tr>
      </FileListTableHead>
      <FileListTableBody>
        {items.map((item, index) => (
          <tr key={index}>
            <td></td>
            <td>{item.name}</td>
            <td>{item.modifiedDate.getDate()}</td>
            <td>{item.size}</td>
          </tr>
        ))}
      </FileListTableBody>
    </FileListTable>
  );
};

export default FileList;
