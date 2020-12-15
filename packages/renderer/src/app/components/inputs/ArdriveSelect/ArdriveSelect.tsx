import React from "react";
import { ArdriveSelectContainer, StyledSelect } from "./ArdriveSelect.styled";

interface ArdriveSelectProps
  extends React.InputHTMLAttributes<HTMLSelectElement> {}

const ArdriveSelect: React.FC<ArdriveSelectProps> = (props) => {
  return (
    <ArdriveSelectContainer>
      <StyledSelect required {...props} />
    </ArdriveSelectContainer>
  );
};

export default ArdriveSelect;
