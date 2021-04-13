import {
  createContainer,
  getContainer,
  runWithContainer,
  untrack
} from "./container";
import { cleanup } from "./disposer";
import { createValue } from "./value";

export function createMemo<T>(fn: () => T): () => T {
  const [getResult, setResult] = createValue<T | undefined>(undefined, false);
  const currentContainer = getContainer();
  const memoContainer = createContainer(() => setResult(memoValue));
  const privilegedContainer = createContainer(() => {
    isDirty = true;
    runWithContainer(currentContainer, memoContainer.recompute);
  }, true);
  
  let memoValue: T;
  let isDirty = false;
  let firstRun = true;

  function getter() {
    if (firstRun) {
      try {
        runWithContainer(privilegedContainer, () => memoValue = fn());
        firstRun = false;
      } finally {
        runWithContainer(currentContainer, () => {
          cleanup(() => {
            memoContainer.dispose();
            privilegedContainer.dispose();
            firstRun = true;
          });
        })
      }
    }
  
    if (isDirty) {
      memoValue = untrack(fn);
      isDirty = false;
    }
  
    getResult();
  
    return memoValue;
  }

  return getter;
}