import {
  Computation,
  createContainer,
  getContainer,
  runWithContainer,
  untrack
} from "./container";
import { createValue } from "./value";

export function createMemo<T>(fn: Computation<T>): () => T {
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

  return () => {
    if (firstRun) {
      runWithContainer(privilegedContainer, () => memoValue = fn());
      firstRun = false;
    }

    if (isDirty) {
      memoValue = untrack(fn);
      isDirty = false;
    }

    getResult();

    return memoValue;
  };
}