import {
  Computation,
  createContainer,
  getContainer,
  runWithContainer,
  untrack
} from "./container";

export function createRenderEffect<T>(fn: (v: T) => T, value: T): void;
export function createRenderEffect<T>(fn: (v?: T) => T | undefined): void;
export function createRenderEffect<T>(fn: (v?: T) => T, value?: T): void {
  let lastValue = value;

  function computation(value?: T) { lastValue = fn(value) };

  runWithContainer(
    createContainer(() => untrack(() => computation(lastValue))),
    () => computation(lastValue)
  );
}

export function createEffect<T>(fn: (v: T) => T, value: T): void;
export function createEffect<T>(fn: (v?: T) => T | undefined): void;
export function createEffect<T>(fn: (v?: T) => T, value?: T): void {
  const container = getContainer();

  function computation() { createRenderEffect(fn, value); }

  if (container) {
    container.scheduleEffect(computation);
  } else {
    computation();
  }
}

export function createSingleEffect<T>(fn: Computation<T>) {
  createEffect(() => untrack(fn));
}