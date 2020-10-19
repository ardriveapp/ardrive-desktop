import { createAction } from "@reduxjs/toolkit";

export function withPayloadType<T>() {
  return (t: T) => ({ payload: t });
}

export function createAwaitableAction(type: string) {
  const actionCreator = createAction(`${type}_ASYNC`);
  const creator = async () => {
    return actionCreator();
  };
  creator.completor = () => ({
    type: `${type}_COMPLETED`,
  });
  creator.type = actionCreator.type;
  return creator;
}
