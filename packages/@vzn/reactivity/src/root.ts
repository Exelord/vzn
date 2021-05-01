import { runWithOwner } from "./owner";
import { createQueue } from "./queue";

/**
 * Computations created by root live until dispose is called
 * 
 * @export
 * @template T
 * @param {(disposer: () => void) => T} fn
 * @returns {T}
 */
export function createRoot<T>(fn: (disposer: () => void) => T): T {
  const disposer = createQueue();
  return runWithOwner({ disposer, computation: undefined }, () => fn(disposer.flush));
}