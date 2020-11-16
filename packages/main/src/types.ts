export type WindowType = "desktop" | "mobile";

export type WindowSize = {
  [type in WindowType]: {
    height: number;
    width: number;
  };
};
