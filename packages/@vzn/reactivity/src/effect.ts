import { createContainer } from "./container";
import { cleanup, createDisposer, getDisposer } from "./disposer";
import { runWith, untrack } from "./utils";

export function createInstantEffect<T>(fn: (v: T) => T, value: T): void;
export function createInstantEffect<T>(fn: (v?: T) => T | undefined): void;
export function createInstantEffect<T>(fn: (v?: T) => T, value?: T): void {
  let lastValue = value;

  function computation(value?: T) { lastValue = fn(value) }
  
  const disposer = createDisposer();
  const container = createContainer(() => {
    disposer.flush();
    runWith({ container, disposer }, () => computation(lastValue));
  });
  
  try {
    runWith({ container, disposer }, () => computation(lastValue));
  } finally {
    cleanup(disposer.flush);
  }
}

export function createEffect<T>(fn: (v: T) => T, value: T): void;
export function createEffect<T>(fn: (v?: T) => T | undefined): void;
export function createEffect<T>(fn: (v?: T) => T, value?: T): void {
  const disposer = getDisposer();
  queueMicrotask(() => runWith({ disposer }, () => createInstantEffect(fn, value)))
}

export function createSingleEffect<T>(fn: () => T) {
  createEffect(() => untrack(fn));
}