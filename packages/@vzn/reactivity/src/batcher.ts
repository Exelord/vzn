import { getOwner, runWithOwner } from "./owner";
import { createQueue, Queue } from "./queue";

export function createBatcher(): Queue {
  return createQueue();
}

export function batch<T>(computation: () => T): T {
  if (getOwner().batcher) return computation();

  const batcher = createQueue();
  
  try {
    return runWithOwner({ batcher }, computation);
  } finally {
    batcher.flush();
  }
}
