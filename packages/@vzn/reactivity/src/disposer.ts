import { Queue, createQueue } from "./utils";

export type Disposable = () => void;
export type DisposerQueue = Queue;

let globalDisposerQueue: DisposerQueue | undefined;

export function getDisposerQueue() {
  return globalDisposerQueue;
}

export function createDisposer() {
  return createQueue();
}

export function runWithDisposerQueue<T>(
  disposerQueue: DisposerQueue | undefined,
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
      return runWithDisposerQueue(disposer, fn);
    } finally {
      disposer.flush();
    }
  });
}
