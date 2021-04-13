import { Queue, createQueue } from "./utils";

export type BatchQueue = Queue;

let globalBatchQueue: BatchQueue | undefined;

export function getBatchQueue() {
  return globalBatchQueue;
}

export function batch<T>(computation: () => T): T {
  if (globalBatchQueue) {
    return computation();
  }

  const queue = createQueue();
  
  globalBatchQueue = queue;
  
  try {
    return computation();
  } finally {
    globalBatchQueue = undefined;
    queue.flush();
  }
}
