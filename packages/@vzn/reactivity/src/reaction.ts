import { batch } from "./batch";
import { untrack } from "./untrack";
import { onCleanup } from "./disposer";
import { getOwner, runWithOwner } from "./owner";
import { createQueue } from "./queue";

export function createReaction<T>(fn: (v: T) => T, value: T): void;
export function createReaction<T>(fn: (v?: T) => T | undefined): void;
export function createReaction<T>(fn: (v?: T) => T, value?: T): void {
  let lastValue = value;
  const disposer = createQueue();

  function compute(value?: T) {
    runWithOwner({ computation, disposer }, () => lastValue = batch(() => fn(value)))
  }

  function recompute() {
    disposer.flush();
    compute(lastValue);
  }

  function computation() {
    const { batcher } = getOwner();

    if (batcher) {
      batcher.schedule(recompute);
    } else {
      recompute();
    }
  };

  try {
    compute(lastValue);
  } finally {
    onCleanup(disposer.flush);
  }
}
