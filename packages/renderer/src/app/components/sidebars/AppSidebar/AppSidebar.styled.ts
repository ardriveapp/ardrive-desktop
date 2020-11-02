import styled from "styled-components";

export const SidebarContainer = styled.div`
  display: flex;
  padding-left: 25px;
  padding-top: 40px;
  flex-direction: column;
  height: calc(100% - 40px);
`;

export const Delimiter = styled.div`
  width: (100% + 25px);
  height: 1px;
  margin-top: 28px;
  margin-bottom: 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  margin-left: -25px;
`;

export const BottomContainer = styled.div`
  margin-top: auto;
  margin-bottom: 61px;
`;

export const GroupHeader = styled.div`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 16px;
  color: white;
  padding-left: 20px;
  margin-bottom: 28px;
`;
