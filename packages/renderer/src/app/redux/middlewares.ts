import { AnyAction, Store, Dispatch, MiddlewareAPI } from "@reduxjs/toolkit";

export const asyncAwaitorMiddleware = (store: MiddlewareAPI<any, Dispatch>) => (
  next: Dispatch<AnyAction>
) => (action: any) => {
  debugger;
};
