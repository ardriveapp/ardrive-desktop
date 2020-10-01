import { RootState } from "../types";

export default {
  getCounter: (state: RootState) => state.app.counter,
};
