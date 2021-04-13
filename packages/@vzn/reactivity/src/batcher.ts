import { Queue, createQueue } from "./utils";

export type Batcher = Queue;

let globalBatcher: Batcher | undefined;

export const createBatcher = createQueue;

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
