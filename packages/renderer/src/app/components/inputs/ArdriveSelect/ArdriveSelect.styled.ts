import styled from "styled-components";

export const ArdriveSelectContainer = styled.div`
  height: 58px;
  width: 100%;
`;

export const StyledSelect = styled.select`
  position: relative;
  background: #f8f8f8;
  border-radius: 4px 4px 0px 0px;
  border: none;
  outline: none;
  height: 100%;
  width: 100%;
  font-family: "Open Sans";
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  padding-left: 20px;
  appearance: none;

  &:focus {
    border-bottom: 2px solid ${(props) => props.theme.colors.red};
  }
`;
