import { createQueue, Queue } from "./queue";

let batcher: Queue | undefined;

export function getBatcher() {
  return batcher;
}

export function batch<T>(computation: () => T): T {
  if (batcher) return computation();

  const queue = createQueue();
  
  try {
    batcher = queue;
    return computation();
  } finally {
    batcher = undefined;
    queue.flush();
  }
}
