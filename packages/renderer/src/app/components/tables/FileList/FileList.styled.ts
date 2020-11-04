import styled from "styled-components";

import { AddContent, Folder, File } from "app/components";
import { Options } from "app/components/images";

export const FileListTable = styled.table`
  width: 100%;
  border-spacing: 0 4px;
`;

export const FileListTableHead = styled.thead`
  & td {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 20px;
    color: rgba(0, 6, 10, 0.6);
    opacity: 0.9;
  }
`;

export const FileListTableBody = styled.tbody`
  & tr {
    height: 74px;
    background-color: white;
    border-radius: 3px;

    td:nth-child(1) {
      padding-left: 16px;
      padding-right: 20px;
      width: 50px;
      overflow: hidden;
    }

    td:nth-child(2) {
      font-family: "Open Sans";
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      color: rgba(0, 6, 10, 0.87);
    }

    td:nth-child(3) {
      font-family: "Open Sans";
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 20px;
      color: rgba(0, 6, 10, 0.6);
    }

    td:nth-child(4) {
      font-family: "Open Sans";
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 20px;
      color: #a4a4a4;
    }

    td:nth-child(5) {
      padding-right: 26px;
    }
  }
`;

export const EmptyContentContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 136px;
  background-color: white;
  padding-left: 40px;
  padding-right: 40px;
`;

export const AddContentImage = styled(AddContent)`
  height: 52px;
  width: 52px;
  margin-right: 32px;
`;

export const AddContentDescription = styled.div`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 24px;
  color: rgba(0, 6, 10, 0.6);
`;

export const FolderImage = styled(Folder)`
  height: 31px;
  width: 40px;
`;

export const FileImage = styled(File)`
  height: 40px;
  width: 40px;
`;

export const OptionsImage = styled(Options)`
  height: 16px;
  width: 4px;
  opacity: 0.5;
  cursor: pointer;
`;
