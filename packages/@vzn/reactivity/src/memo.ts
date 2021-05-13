import { onCleanup } from "./disposer";
import { runWithOwner } from "./owner";
import { createValue } from "./value";
import { createQueue } from "./queue";

export function createMemo<T>(fn: () => T): () => T {
  let memoValue: T;
  let isDirty = true;

  const [trackMemo, notifyChange] = createValue(true, false);
  const disposer = createQueue();
  
  function computation() {
    isDirty = true;
    notifyChange(true);
  };

  function recomputeMemo() {
    memoValue = fn();
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