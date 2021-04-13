import { batch } from "./batch";
import { createDisposer } from "./disposer";
import { runWith } from "./utils";

export function createRoot<T>(fn: (disposer: () => void) => T): T {
  const disposer = createDisposer();
  return runWith({ disposer, computation: undefined }, () => batch(() => fn(disposer.flush)));
}