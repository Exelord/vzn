import { Queue, createQueue } from "./queue";

export type Batcher = Queue;

let globalBatcher: Batcher | undefined;

export function createBatcher(): Batcher {
  return createQueue();
}

export function getBatcher(): Batcher | undefined {
  return globalBatcher;
}

export function setBatcher(batcher?: Batcher): void {
  globalBatcher = batcher;
}

export function batch<T>(computation: () => T): T {
  if (globalBatcher) {
    return computation();
  }

  const batcher = createBatcher();
  
  setBatcher(batcher);
  
  try {
    return computation();
  } finally {
    setBatcher(undefined);
    batcher.flush();
  }
}
