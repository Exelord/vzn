import {
  Computation,
  createContainer,
  getContainer,
  runWithContainer,
  untrack
} from "./container";

export function renderEffect<T>(fn: (v: T) => T, value: T): void;
export function renderEffect<T>(fn: (v?: T) => T | undefined): void;
export function renderEffect<T>(fn: (v?: T) => T, value?: T): void {
  let lastValue = value;
  const comp = (value?: T) => (lastValue = fn(value))
  runWithContainer(createContainer(untrack(() => comp(lastValue))), () => comp(lastValue));
}

export function effect<T>(fn: (v: T) => T, value: T): void;
export function effect<T>(fn: (v?: T) => T | undefined): void;
export function effect<T>(fn: (v?: T) => T, value?: T): void {
  const owner = getContainer();

  const computation = () => renderEffect(fn, value)

  if (owner) {
    owner.scheduleEffect(computation);
  } else {
    computation();
  }
}

export function starter<T>(fn: Computation<T>) {
  effect(untrack(fn));
}

export function memo<T>(fn: Computation<T>) {
  let isFresh = true;

  let value = runWithContainer(
    createContainer(() => (isFresh = false)),
    fn
  );

  return untrack(() => {
    if (!isFresh) {
      value = fn();
      isFresh = true;
    }

    return value;
  });
}
