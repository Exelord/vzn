import {
  createComputation
} from "./computation";
import { onCleanup } from "./disposer";
import { runWithOwner } from "./owner";
import { createValue } from "./value";
import { batch } from "./batch";
import { createQueue } from "./queue";

export function createMemo<T>(fn: () => T): () => T {
  let memoValue: T;
  let isDirty = true;

  // This value will serve as a signal for all consumers to recompute
  const [getResult, setResult] = createValue(true, false);

  // Custom disposer will hold all memo's cleanups
  const memoDisposer = createQueue();

  // This computation will used for scheduling an update that can be suspended by batching
  const memoComputation = createComputation(() => setResult(true));

  // The role of this computation is to update the state of memo omitting the batching status
  const privilegedComputation = createComputation(() => {
    isDirty = true;
    memoComputation.recompute();
  }, true);

  onCleanup(() => {
    memoDisposer.flush();
    isDirty = true;
  });

  function getter() {
    if (isDirty) {
      // ? Flushing the disposer before new computation will ensure we won't have detached dependencies
      memoDisposer.flush();
      runWithOwner({ computation: privilegedComputation, disposer: memoDisposer }, () => memoValue = batch(fn));
      isDirty = false;
    }
  
    getResult();
  
    // ? Although we use computations for updates, we still return "not tracked" value
    // ? to be able to see instant and up-to-date result
    return memoValue;
  }

  return getter;
}