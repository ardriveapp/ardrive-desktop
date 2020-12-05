import styled from "styled-components";

import { AddContent, Folder, File } from "app/components";
import { Options } from "app/components/images";

export const FileListTable = styled.table`
  width: 100%;
  border-spacing: 0 1px;
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

export const FileListTableRow = styled.tr<{
  active: boolean;
}>`
  height: 74px;
  border-radius: 3px;
  cursor: pointer;
  background-color: white;

  td {
    color: ${(props) =>
      props.active ? props.theme.colors.red : "initial"} !important;
  }

  &:hover {
    background-color: transparent;

    td {
      color: ${(props) => props.theme.colors.red} !important;
    }
  }

  td:nth-child(1) {
    padding-left: 16px;
    padding-right: 20px;
    width: 50px;
    overflow: hidden;
  }
`;

export const FileListTableBody = styled.tbody``;

export const EmptyContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: white;
  padding-left: 40px;
  padding-right: 40px;
`;

export const AddContentImage = styled(AddContent)`
  height: 52px;
  width: 52px;
`;

export const AddContentDescription = styled.div`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: rgba(0, 6, 10, 0.6);
  margin-top: 16px;
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

export const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100px;

  & > span:nth-child(1) {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: rgba(0, 6, 10, 0.87);
  }

  & > span:nth-child(2) {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    color: rgba(0, 6, 10, 0.6);
  }

  & > span:nth-child(3) {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    color: #a4a4a4;
  }
`;
