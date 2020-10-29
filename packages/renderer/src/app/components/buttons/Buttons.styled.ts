import styled from "styled-components";

export const RoundedButton = styled.button`
  background: ${(props) => props.theme.colors.red};
  border-radius: 4px;
  width: 100%;
  height: 64px;

  font-family: "Montserrat";
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 16px;
  letter-spacing: 1px;
  text-transform: uppercase;

  color: white;
  outline: none;
  border: none;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
`;
