import { batch } from "./batcher";
import { createComputation } from "./computation";
import { onCleanup, createDisposer, getDisposer } from "./disposer";
import { runWith, untrack } from "./utils";

export function createInstantEffect<T>(fn: (v: T) => T, value: T): void;
export function createInstantEffect<T>(fn: (v?: T) => T | undefined): void;
export function createInstantEffect<T>(fn: (v?: T) => T, value?: T): void {
  let lastValue = value;

  function computationFn(value?: T) { lastValue = batch(() => fn(value)) }
  
  const disposer = createDisposer();
  const computation = createComputation(() => {
    disposer.flush();
    runWith({ computation, disposer }, () => computationFn(lastValue));
  });
  
  try {
    runWith({ computation, disposer }, () => computationFn(lastValue));
  } finally {
    onCleanup(disposer.flush);
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