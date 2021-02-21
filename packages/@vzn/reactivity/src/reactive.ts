import {
  Computation,
  createContainer,
  getContainer,
  runWithContainer,
  untrack
} from "./container";
import { value } from "./value";

export function instantEffect<T>(fn: (v: T) => T, value: T): void;
export function instantEffect<T>(fn: (v?: T) => T | undefined): void;
export function instantEffect<T>(fn: (v?: T) => T, value?: T): void {
  let lastValue = value;

  const comp = (value?: T) => (lastValue = fn(value));

  runWithContainer(
    createContainer(() => untrack(() => comp(lastValue))),
    () => comp(lastValue)
  );
}

export function effect<T>(fn: (v: T) => T, value: T): void;
export function effect<T>(fn: (v?: T) => T | undefined): void;
export function effect<T>(fn: (v?: T) => T, value?: T): void {
  const owner = getContainer();

  const computation = () => instantEffect(fn, value);

  if (owner) {
    owner.scheduleEffect(computation);
  } else {
    computation();
  }
}

export function starter<T>(fn: Computation<T>) {
  effect(() => untrack(fn));
}

export function memo<T>(fn: Computation<T>): () => T {
  const [getResult, setResult] = value<T | undefined>(undefined);
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
