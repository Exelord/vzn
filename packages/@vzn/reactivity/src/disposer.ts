import { batch } from "./batcher";
import { runWith } from "./context";
import { Queue, createQueue } from "./queue";
import { asyncRethrow } from "./utils";

export type Disposer = Queue;

let globalDisposer: Disposer | undefined;

export function createDisposer() {
  return createQueue();
}

export function getDisposer() {
  return globalDisposer;
}

export function setDisposer(disposer?: Disposer): void {
  globalDisposer = disposer;
}

export function onCleanup(fn: () => void) {
  function cleanup() {
    return asyncRethrow(() => runWith({ disposer: undefined, computation: undefined }, () => batch(fn)));
  }

  globalDisposer ? globalDisposer.schedule(cleanup) : queueMicrotask(() => cleanup());
}
