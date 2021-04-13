import {
  createComputation
} from "./computation";
import { cleanup, createDisposer } from "./disposer";
import { runWith } from "./utils";
import { createValue } from "./value";

export function createMemo<T>(fn: () => T): () => T {
  let memoValue: T;
  let isDirty = true;

  const [getResult, setResult] = createValue<T | undefined>(undefined, false);
  const memoDisposer = createDisposer();
  const memoComputation = createComputation(() => setResult(memoValue));
  const privilegedComputation = createComputation(() => {
    isDirty = true;
    memoComputation.recompute();
  }, true);

  cleanup(() => {
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