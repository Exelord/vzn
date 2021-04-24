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
    const batchQueue = getOwner().batcher;

    if (!isPrioritized && batchQueue) {
      batchQueue.schedule(compute);
    } else {
      compute();
    }
  }

  return Object.freeze({ recompute });
}
