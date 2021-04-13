import { batch } from "./batch";
import { createDisposer, runWithDisposer } from "./disposer";

export function createRoot<T>(fn: (disposer: () => void) => T): T {
  const disposer = createDisposer();
  return runWithDisposer(disposer, () => batch(() => fn(disposer.flush)));
}