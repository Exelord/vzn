import { batch } from "./scheduler";
import { getOwner } from "./owner";

export function onCleanup(fn: () => void): void {
  function cleanup() {
    return batch(fn);
  }

  const { disposer } = getOwner();

  disposer ? disposer.schedule(cleanup) : queueMicrotask(cleanup);
}
