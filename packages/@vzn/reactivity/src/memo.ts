import { onCleanup } from "./disposer";
import { getOwner, runWithOwner } from "./owner";
import { createValue } from "./value";
import { batch } from "./batch";
import { createQueue } from "./queue";

export function createMemo<T>(fn: () => T): () => T {
  let memoValue: T;
  let isDirty = true;

  // This value will serve as a signal for all consumers to recompute
  const [trackMemo, updateMemo] = createValue(true, false);

  // Custom disposer will hold all memo's cleanups
  const disposer = createQueue();

  // The role of this computation is to update the state of memo omitting the batching status
  const computation = () => {
    isDirty = true;

    const { batcher } = getOwner();

    if (batcher) {
      batcher.schedule(() => updateMemo(true));
    } else {
      updateMemo(true);
    }
  };

  onCleanup(() => {
    disposer.flush();
    isDirty = true;
  });

  function getter() {
    if (isDirty) {
      // ? Flushing the disposer before new computation will ensure we won't have detached dependencies
      disposer.flush();
      runWithOwner({ computation, disposer }, () => memoValue = batch(fn));
      isDirty = false;
    }
  
    trackMemo();
  
    // ? Although we use computations for updates, we still return "not tracked" value
    // ? to be able to see instant and up-to-date result
    return memoValue;
  }

  return getter;
}