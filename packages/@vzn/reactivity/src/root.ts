import { runWithOwner } from "./owner";
import { createQueue } from "./queue";

export function createRoot<T>(fn: (disposer: () => void) => T): T {
  const disposer = createQueue();
  return runWithOwner({ disposer, computation: undefined }, () => fn(disposer.flush));
}