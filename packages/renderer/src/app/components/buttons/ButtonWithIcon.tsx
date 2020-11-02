import React from "react";
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
  }
};

const ButtonWithIcon: React.FC<{
  icon: ButtonIcon;
  transparent?: boolean;
  active?: boolean;
}> = ({ icon: image, children, transparent, active }) => {
  const Button = transparent ? TransparentButtonWithContent : ButtonWithContent;
  return (
    <Button active={active}>
      <ButtonIcon>{getImage(image)}</ButtonIcon>
      {children}
    </Button>
  );
};

export default ButtonWithIcon;
