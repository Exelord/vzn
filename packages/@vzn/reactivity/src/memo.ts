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
  
  function update() {
    notifyChange(true)
  }

  const computation = () => {
    const { batcher } = getOwner();
    isDirty = true;
    batcher ? batcher.schedule(update) : update();
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