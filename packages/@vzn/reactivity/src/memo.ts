import {
  Computation,
  createContainer,
  runWithContainer,
  untrack
} from "./container";
import { createValue } from "./value";

export function createMemo<T>(fn: Computation<T>): () => T {
  const [getResult, setResult] = createValue<T | undefined>(undefined, false);
  let memoValue: T;
  let isDirty = false;

  const memoContainer = createContainer(() => untrack(() => {
    if (isDirty) {
      memoValue = fn();
      isDirty = false;
    }

    setResult(memoValue);
  }));

  runWithContainer(
    createContainer(() => {
      isDirty = true;
      memoContainer.update();
    }, true),
    () => {
      memoValue = fn();
    }
  );

  return () => {
    if (isDirty) {
      memoValue = untrack(fn);
      isDirty = false;
    }

    getResult();
    return memoValue;
  };
}