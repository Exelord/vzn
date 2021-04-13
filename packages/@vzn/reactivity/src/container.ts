import { getBatchQueue } from "./batch";
import { cleanup, createDisposer, DisposerQueue, runWithDisposerQueue } from "./disposer";
import { asyncRethrow } from "./utils";

export interface Container {
  disposer: DisposerQueue;
  recompute(): void;
  dispose(): void;
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
    return runWithDisposerQueue(container && container.disposer, computation);
  } finally {
    globalContainer = currentContainer;
  }
}

export function untrack<T>(fn: () => T): T {
  const container = createContainer();

  try {
    return runWithContainer(container, fn);
  } finally {
    cleanup(container.dispose);
  }
}

export function createContainer(
  computation?: () => void,
  isPrioritized = false
): Container {
  const disposer = createDisposer();

  function recompute() {
    if (!computation) return;
    
    const batchQueue = getBatchQueue();

    if (!isPrioritized && batchQueue) {
      batchQueue.schedule(computation);
    } else {
      asyncRethrow(() => untrack(computation));
    }
  }

  function dispose() {
    disposer.flush();
  }

  return Object.freeze({
    recompute,
    dispose,
    disposer
  });
}
