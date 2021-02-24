import {
  Computation,
  createContainer,
  getContainer,
  runWithContainer,
  untrack
} from "./container";
import { createValue } from "./value";

export function createInstantEffect<T>(fn: (v: T) => T, value: T): void;
export function createInstantEffect<T>(fn: (v?: T) => T | undefined): void;
export function createInstantEffect<T>(fn: (v?: T) => T, value?: T): void {
  let lastValue = value;

  const comp = (value?: T) => (lastValue = fn(value));

  runWithContainer(
    createContainer(() => untrack(() => comp(lastValue))),
    () => comp(lastValue)
  );
}

export function createEffect<T>(fn: (v: T) => T, value: T): void;
export function createEffect<T>(fn: (v?: T) => T | undefined): void;
export function createEffect<T>(fn: (v?: T) => T, value?: T): void {
  const owner = getContainer();

  const computation = () => createInstantEffect(fn, value);

  if (owner) {
    owner.scheduleEffect(computation);
  } else {
    computation();
  }
}

export function createSingleEffect<T>(fn: Computation<T>) {
  createEffect(() => untrack(fn));
}

export function createMemo<T>(fn: Computation<T>): () => T {
  const [getResult, setResult] = createValue<T | undefined>(undefined);
  let memoValue: T;
  let isDirty = false;

  const memoContainer = createContainer(() => untrack(() => setResult(memoValue)));

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
