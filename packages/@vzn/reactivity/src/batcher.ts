import { Queue, createQueue } from "./queue";

export type Batcher = Queue;

let globalBatcher: Batcher | undefined;

export function createBatcher() {
  return createQueue();
}

export function getBatcher() {
  return globalBatcher;
}

export function setBatcher(batcher?: Batcher) {
  globalBatcher = batcher;
}

export function batch<T>(computation: () => T): T {
  if (globalBatcher) {
    return computation();
  }

  const queue = createBatcher();
  
  setBatcher(queue);
  
  try {
    return computation();
  } finally {
    setBatcher(undefined);
    queue.flush();
  }
}
