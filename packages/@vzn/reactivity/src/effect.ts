import { batch } from "./batcher";
import { createComputation, untrack } from "./computation";
import { onCleanup, createDisposer } from "./disposer";
import { getOwner, runWithOwner } from "./owner";

export function createInstantEffect<T>(fn: (v: T) => T, value: T): void;
export function createInstantEffect<T>(fn: (v?: T) => T | undefined): void;
export function createInstantEffect<T>(fn: (v?: T) => T, value?: T): void {
  let lastValue = value;

  function computationFn(value?: T) { runWithOwner({ computation, disposer }, () => lastValue = fn(value)) }
  
  const disposer = createDisposer();
  const computation = createComputation(() => {
    disposer.flush();

    // ? No need for batching here as every recomputation is always batched
    computationFn(lastValue);
  });
  
  try {
    batch(() => computationFn(lastValue));
  } finally {
    onCleanup(disposer.flush);
  }
}

export function createEffect<T>(fn: (v: T) => T, value: T): void;
export function createEffect<T>(fn: (v?: T) => T | undefined): void;
export function createEffect<T>(fn: (v?: T) => T, value?: T): void {
  const { disposer } = getOwner();
  // ? Effects are run "async" to not block current computations
  queueMicrotask(() => runWithOwner({ disposer }, () => createInstantEffect(fn, value)))
}

export function createSingleEffect<T>(fn: () => T): void {
  createEffect(() => untrack(fn));
}