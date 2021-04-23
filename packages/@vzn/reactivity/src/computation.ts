import { batch, getBatcher } from "./batcher";
import { runWith } from "./context";
import { asyncRethrow } from "./utils";

export interface Computation {
  recompute(): void;
}

let globalComputation: Computation | undefined;

export function getComputation(): Computation | undefined {
  return globalComputation;
}

export function setComputation(computation?: Computation): void {
  globalComputation = computation;
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
