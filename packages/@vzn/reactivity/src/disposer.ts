import { Queue, createQueue } from "./utils";

export type Disposable = () => void;
export type Disposer = Queue;

let globalDisposerQueue: Disposer | undefined;

export function getDisposer() {
  return globalDisposerQueue;
}

export function createDisposer() {
  return createQueue();
}

export function runWithDisposer<T>(
  disposerQueue: Disposer | undefined,
  computation: () => T
): T {
  const currentDisposer = globalDisposerQueue;

  globalDisposerQueue = disposerQueue;

  try {
    return computation();
  } finally {
    globalDisposerQueue = currentDisposer;
  }
}

export function cleanup(fn: Disposable) {
  if (globalDisposerQueue) {
    globalDisposerQueue.schedule(fn);
    return;
  }
  
  queueMicrotask(() => {
    const disposer = createDisposer();

    try {
      return runWithDisposer(disposer, fn);
    } finally {
      disposer.flush();
    }
  });
}
