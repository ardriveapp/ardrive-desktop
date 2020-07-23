
// Some helper types. 

export type FunctionReturningPromise<R = any> = (...args: any[]) => Promise<R>;

export type OneArgFunctionReturningPromise<P, R> = (arg: P) => Promise<R>;

export type PromiseReturnType<T> = T extends (...args: any[]) => Promise<infer U> ? U : unknown;


