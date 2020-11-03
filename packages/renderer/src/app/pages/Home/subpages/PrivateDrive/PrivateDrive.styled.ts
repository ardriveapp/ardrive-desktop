import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  padding-left: 40px;
  padding-top: 40px;
  flex-direction: column;
  padding-right: 15px;
  background-color: #e5e5e5;
  height: calc(100% - 40px);
  width: calc(100% - 25px);
`;

export const PageHeader = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #00060a;
`;

export const FolderPath = styled.span`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 6, 10, 0.6);
  margin-top: 4px;
  margin-bottom: 28px;
`;
