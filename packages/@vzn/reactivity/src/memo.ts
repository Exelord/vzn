import {
  createComputation
} from "./computation";
import { onCleanup, createDisposer } from "./disposer";
import { runWith } from "./context";
import { createValue } from "./value";

export function createMemo<T>(fn: () => T): () => T {
  let memoValue: T;
  let isDirty = true;

  const [getResult, setResult] = createValue(true, false);
  const memoDisposer = createDisposer();
  const memoComputation = createComputation(() => setResult(true));
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
      memoDisposer.flush();
      runWith({ computation: privilegedComputation, disposer: memoDisposer }, () => memoValue = fn());
      isDirty = false;
    }
  
    getResult();
  
    return memoValue;
  }

  return getter;
}