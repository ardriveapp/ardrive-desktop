import React from "react";

import { User, Password } from "app/components/images";

import {
  ImageContainer,
  InputContainer,
  StyledInput,
} from "./ArdriveInput.styled";

interface ArdriveInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hideIcon?: boolean;
}

const ArdriveInput: React.FC<ArdriveInputProps> = (props) => {
  const { type, hideIcon } = props;

  return (
    <InputContainer>
      {!hideIcon && (
        <ImageContainer>
          {type === "password" ? <Password /> : <User />}
        </ImageContainer>
      )}
      <StyledInput {...props} />
    </InputContainer>
  );
};

export default ArdriveInput;
