import {
  createContainer,
  runWithContainer
} from "./container";
import { cleanup, createDisposer, runWithDisposer } from "./disposer";
import { createValue } from "./value";

export function createMemo<T>(fn: () => T): () => T {
  let memoValue: T;
  let isDirty = true;

  const [getResult, setResult] = createValue<T | undefined>(undefined, false);
  const memoDisposer = createDisposer();
  const memoContainer = createContainer(() => setResult(memoValue));
  const privilegedContainer = createContainer(() => {
    isDirty = true;
    memoContainer.recompute();
  }, true);

  cleanup(() => {
    memoDisposer.flush();
    isDirty = true;
  });

  function getter() {
    if (isDirty) {
      memoDisposer.flush();
      runWithContainer(privilegedContainer, () => memoValue = runWithDisposer(memoDisposer, fn));
      isDirty = false;
    }
  
    getResult();
  
    return memoValue;
  }

  return getter;
}