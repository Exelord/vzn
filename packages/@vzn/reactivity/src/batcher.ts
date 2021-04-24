import { getOwner, runWithOwner } from "./owner";
import { createQueue } from "./queue";

export { createQueue as createBatcher }

export function batch<T>(computation: () => T): T {
  if (getOwner().batcher) return computation();

  const batcher = createQueue();
  
  try {
    return runWithOwner({ batcher }, computation);
  } finally {
    batcher.flush();
  }
}
