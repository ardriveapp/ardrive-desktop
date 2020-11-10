import React from "react";
import styled from "styled-components";

import { Folder, Help, Private, Public, Share, Upload } from "../images";

import {
  ButtonImage as ButtonIcon,
  ButtonWithContent,
  TransparentButtonWithContent,
} from "./Buttons.styled";

type ButtonIcon = "folder" | "upload" | "private" | "public" | "share" | "help";

const getImage = (image: ButtonIcon) => {
  switch (image) {
    case "folder":
      return <Folder />;
    case "upload":
      return <Upload />;
    case "private":
      return <Private />;
    case "public":
      return <Public />;
    case "share":
      return <Share />;
    case "help":
      return <Help />;
    default:
      return null;
  }
};

type ButtonWithIconProps = {
  icon?: ButtonIcon;
  transparent?: boolean;
  active?: boolean;
} & React.ComponentProps<typeof TransparentButtonWithContent>;

const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
  icon: image,
  children,
  transparent,
  active,
  ...rest
}) => {
  const Button = transparent ? TransparentButtonWithContent : ButtonWithContent;
  return (
    <Button active={active} {...rest}>
      <ButtonIcon>{getImage(image)}</ButtonIcon>
      {children}
    </Button>
  );
};

export default styled(ButtonWithIcon)``;
