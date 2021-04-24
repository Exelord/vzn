import { createDisposer } from "./disposer";
import { runWithOwner } from "./owner";

export function root<T>(fn: (disposer: () => void) => T): T {
  const disposer = createDisposer();
  return runWithOwner({ disposer, computation: undefined }, () => fn(disposer.flush));
}