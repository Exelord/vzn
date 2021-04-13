import { Queue, createQueue } from "./utils";

export type BatchQueue = Queue;

let globalBatcher: BatchQueue | undefined;

export function getBatcher() {
  return globalBatcher;
}

export function batch<T>(computation: () => T): T {
  if (globalBatcher) {
    return computation();
  }

  const queue = createQueue();
  
  globalBatcher = queue;
  
  try {
    return computation();
  } finally {
    globalBatcher = undefined;
    queue.flush();
  }
}
