import { getBatchQueue } from "./batch";
import { asyncRethrow, untrack } from "./utils";

export interface Container {
  recompute(): void;
}

let globalContainer: Container | undefined;

export function getContainer(): Container | undefined {
  return globalContainer;
}

export function setContainer(container?: Container): void {
  globalContainer = container;
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
