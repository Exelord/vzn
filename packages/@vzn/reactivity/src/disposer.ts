import { batch } from "./batcher";
import { getOwner, runWithOwner } from "./owner";
import { createQueue } from "./queue";
import { asyncRethrow } from "./utils";

export { createQueue as createDisposer }

export function onCleanup(fn: () => void): void {
  function cleanup() {
    return asyncRethrow(() => runWithOwner({ disposer: undefined, computation: undefined }, () => batch(fn)));
  }

  const { disposer } = getOwner();

  disposer ? disposer.schedule(cleanup) : queueMicrotask(() => cleanup());
}
