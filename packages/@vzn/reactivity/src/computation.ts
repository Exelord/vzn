import { batch, getBatcher } from "./batcher";
import { getOwner, runWith } from "./context";
import { asyncRethrow } from "./utils";

export interface Computation {
  recompute(): void;
}

export function getComputation(): Computation | undefined {
  return getOwner().computation;
}

export function createComputation(
  fn: () => void,
  isPrioritized = false
): Computation {
  function compute() {
    return asyncRethrow(() => runWith({ disposer: undefined, computation: undefined }, () => batch(fn)));
  }

  function recompute() {
    const batchQueue = getBatcher();

    if (!isPrioritized && batchQueue) {
      batchQueue.schedule(compute);
    } else {
      compute();
    }
  }

  return Object.freeze({ recompute });
}
