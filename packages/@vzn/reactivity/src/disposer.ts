import { getOwner } from "./owner";

export function onCleanup(fn: () => void): void {
  function cleanup() {
    return fn();
  }

  const { disposer } = getOwner();

  disposer ? disposer.schedule(cleanup) : queueMicrotask(cleanup);
}
