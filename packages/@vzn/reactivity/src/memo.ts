import { onCleanup } from "./disposer";
import { getOwner, runWithOwner } from "./owner";
import { createValue } from "./value";
import { batch } from "./batch";
import { createQueue } from "./queue";

export function createMemo<T>(fn: () => T): () => T {
  let memoValue: T;
  let isDirty = true;

  const [trackMemo, notifyChange] = createValue(true, false);
  const disposer = createQueue();

  const computation = () => {
    isDirty = true;

    const { batcher } = getOwner();

    if (batcher) {
      batcher.schedule(() => notifyChange(true));
    } else {
      notifyChange(true);
    }
  };

  onCleanup(() => {
    disposer.flush();
    isDirty = true;
  });

  function getter() {
    if (isDirty) {
      disposer.flush();
      runWithOwner({ computation, disposer }, () => memoValue = batch(fn));
      isDirty = false;
    }
  
    trackMemo();
  
    return memoValue;
  }

  return getter;
}