import React from "react";

import { User, Password } from "app/components/images";

import {
  ImageContainer,
  InputContainer,
  StyledInput,
} from "./ArdriveInput.styled";

const ArdriveInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  const { type } = props;

  return (
    <InputContainer>
      <ImageContainer>
        {type === "password" ? <Password /> : <User />}
      </ImageContainer>
      <StyledInput {...props} />
    </InputContainer>
  );
};

export default ArdriveInput;
