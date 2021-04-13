import { Queue, createQueue, runWith } from "./utils";

export type Disposable = () => void;
export type Disposer = Queue;

let globalDisposerQueue: Disposer | undefined;

export function getDisposer() {
  return globalDisposerQueue;
}

export function setDisposer(disposer?: Disposer): void {
  globalDisposerQueue = disposer;
}

export function createDisposer() {
  return createQueue();
}

export function cleanup(fn: Disposable) {
  if (globalDisposerQueue) {
    globalDisposerQueue.schedule(fn);
    return;
  }
  
  queueMicrotask(() => {
    const disposer = createDisposer();

    try {
      return runWith({ disposer }, fn);
    } finally {
      disposer.flush();
    }
  });
}
