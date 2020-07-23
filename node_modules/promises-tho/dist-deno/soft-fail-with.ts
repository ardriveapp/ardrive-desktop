import { FunctionReturningPromise, PromiseReturnType } from "./types";

/**
 * Wraps a promise returning function and returns a default value 
 * when it errors. 
 * 
 * @param defval The default value to return if the promise function errors 
 * @param func The promise returning function.
 */
export function softFailWith<D, T extends FunctionReturningPromise>
  (defval: D, func: T): (...args: Parameters<T>) => Promise<PromiseReturnType<T> | D> {
  return (...args: Parameters<T>) => func(...args).catch(() => defval);
} 