import { getBatcher } from "./batcher";
import { asyncRethrow, untrack } from "./utils";

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
  fn?: () => void,
  isPrioritized = false
): Computation {
  function recompute() {
    if (!fn) return;
    
    const batchQueue = getBatcher();

    if (!isPrioritized && batchQueue) {
      batchQueue.schedule(fn);
    } else {
      asyncRethrow(() => untrack(fn));
    }
  }

  return Object.freeze({ recompute });
}
