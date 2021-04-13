import { getBatchQueue } from "./batch";
import { asyncRethrow } from "./utils";

export interface Container {
  recompute(): void;
}

let globalContainer: Container | undefined;

export function getContainer(): Container | undefined {
  return globalContainer;
}

export function runWithContainer<T>(
  container: Container | undefined,
  computation: () => T
): T {
  const currentContainer = getContainer();

  globalContainer = container;

  try {
    return computation();
  } finally {
    globalContainer = currentContainer;
  }
}

export function untrack<T>(fn: () => T): T {
  return runWithContainer(undefined, fn);
}

export function createContainer(
  computation?: () => void,
  isPrioritized = false
): Container {
  function recompute() {
    if (!computation) return;
    
    const batchQueue = getBatchQueue();

    if (!isPrioritized && batchQueue) {
      batchQueue.schedule(computation);
    } else {
      asyncRethrow(() => untrack(computation));
    }
  }

  return Object.freeze({ recompute });
}
