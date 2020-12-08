export type WindowType = "desktop" | "mobile";

export type WindowSize = {
  [type in WindowType]: {
    height: number;
    width: number;
  };
};

export class CancellationToken {
  isCancelled: boolean;

  constructor() {
    this.isCancelled = false;
  }

  cancel() {
    this.isCancelled = true;
  }
}
