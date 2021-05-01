import { batch } from "./batch";
import { getOwner, runWithOwner } from "./owner";
import { asyncRethrow } from "./utils";

export function onCleanup(fn: () => void): void {
  function cleanup() {
    return asyncRethrow(() => runWithOwner({ disposer: undefined, computation: undefined }, () => batch(fn)));
  }

  const { disposer } = getOwner();

  disposer ? disposer.schedule(cleanup) : queueMicrotask(cleanup);
}
