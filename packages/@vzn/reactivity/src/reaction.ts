import { batch, getBatcher } from "./batch";
import { onCleanup } from "./disposer";
import { runWithOwner } from "./owner";
import { createQueue } from "./queue";

export function createReaction<T>(fn: (v: T) => T, value: T): void;
export function createReaction<T>(fn: (v?: T) => T | undefined): void;
export function createReaction<T>(fn: (v?: T) => T, value?: T): void {
  let lastValue = value;
  
  const disposer = createQueue();

  function computation() {
    const batcher = getBatcher();
    batcher ? batcher.schedule(recompute) : recompute();
  };

  function recompute() {
    disposer.flush();
    runWithOwner({ computation, disposer }, () => lastValue = batch(() => fn(lastValue)))
  }

  try {
    runWithOwner({ computation, disposer }, () => lastValue = batch(() => fn(lastValue)))
  } finally {
    onCleanup(disposer.flush);
  }
}
