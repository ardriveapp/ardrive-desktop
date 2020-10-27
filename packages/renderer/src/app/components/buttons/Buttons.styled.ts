import styled from "styled-components";

export const RoundedButton = styled.button`
  background: ${(props) => props.theme.colors.darkGrey};
  border-radius: 100px;
  width: 300px;
  height: 40px;
  color: white;
  font-size: 20px;
  outline: none;
  border: none;
  letter-spacing: 3.5px;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
`;
