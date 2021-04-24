import { batch } from "./batcher";
import { getOwner, runWith } from "./owner";
import { Queue, createQueue } from "./queue";
import { asyncRethrow } from "./utils";

export function createDisposer(): Queue {
  return createQueue();
}

export function getDisposer() {
  return getOwner().disposer;
}

export function onCleanup(fn: () => void) {
  function cleanup() {
    return asyncRethrow(() => runWith({ disposer: undefined, computation: undefined }, () => batch(fn)));
  }

  const disposer = getOwner().disposer;

  disposer ? disposer.schedule(cleanup) : queueMicrotask(() => cleanup());
}
