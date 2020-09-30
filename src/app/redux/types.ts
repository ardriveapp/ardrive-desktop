import { type } from "os";

export interface AppState {
  initialized: boolean;
  counter: number;
}

export interface RootState {
  app: AppState;
}
