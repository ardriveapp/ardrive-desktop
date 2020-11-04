import styled from "styled-components";

export const FileListTable = styled.table`
  width: 100%;
  table-layout: fixed;
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
  }
`;
