import { batch } from "./batcher";
import { getOwner, runWithOwner } from "./owner";
import { asyncRethrow } from "./utils";

export interface Computation {
  recompute(): void;
}

export function createComputation(
  fn: () => void,
  isPrioritized = false
): Computation {
  function compute() {
    return asyncRethrow(() => runWithOwner({ disposer: undefined, computation: undefined }, () => batch(fn)));
  }

  function recompute() {
    const { batcher } = getOwner();

    if (!isPrioritized && batcher) {
      batcher.schedule(compute);
    } else {
      compute();
    }
  }

  return Object.freeze({ recompute });
}

export function untrack<T>(fn: () => T): T {
  return runWithOwner({ computation: undefined }, fn);
}
