import { onCleanup } from "./disposer";
import { runWithOwner } from "./owner";
import { createValue } from "./value";
import { batch, schedule } from "./scheduler";
import { createQueue } from "./queue";

export function createMemo<T>(fn: () => T): () => T {
  let memoValue: T;
  let isDirty = true;

  const [trackMemo, notifyChange] = createValue(true, false);
  const disposer = createQueue();
  
  function notifyMemoChange() {
    notifyChange(true)
  }

  function computation() {
    isDirty = true;
    schedule(notifyMemoChange);
  };

  function recomputeMemo() {
    memoValue = batch(fn)
  }

  onCleanup(() => {
    disposer.flush();
    isDirty = true;
  });

  function getter() {
    if (isDirty) {
      disposer.flush();
      runWithOwner({ computation, disposer }, recomputeMemo);
      isDirty = false;
    }
  
    trackMemo();
  
    return memoValue;
  }

  return getter;
}