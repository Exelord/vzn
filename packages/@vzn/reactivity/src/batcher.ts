import { getOwner, runWith } from "./owner";
import { createQueue, Queue } from "./queue";

export function createBatcher(): Queue {
  return createQueue();
}

export function getBatcher() {
  return getOwner().batcher;
}

export function batch<T>(computation: () => T): T {
  if (getOwner().batcher) return computation();

  const batcher = createQueue();
  
  try {
    return runWith({ batcher }, computation);
  } finally {
    batcher.flush();
  }
}
