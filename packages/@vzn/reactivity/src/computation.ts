import { batch } from "./batch";
import { getOwner, runWithOwner } from "./owner";

export interface Computation {
  recompute(): void;
}

export function createComputation(
  fn: () => void,
  isPrioritized = false
): Computation {
  function recompute() {
    const { batcher } = getOwner();

    if (!isPrioritized && batcher) {
      batcher.schedule(fn);
    } else {
      runWithOwner({ disposer: undefined, computation: undefined }, () => batch(fn));
    }
  }

  return Object.freeze({ recompute });
}

export function untrack<T>(fn: () => T): T {
  return runWithOwner({ computation: undefined }, fn);
}
