import { Queue, createQueue, runWith } from "./utils";

export type Disposer = Queue;

let globalDisposer: Disposer | undefined;

export function getDisposer() {
  return globalDisposer;
}

export function setDisposer(disposer?: Disposer): void {
  globalDisposer = disposer;
}

export function createDisposer() {
  return createQueue();
}

export function cleanup(fn: () => void) {
  if (globalDisposer) {
    globalDisposer.schedule(fn);
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
