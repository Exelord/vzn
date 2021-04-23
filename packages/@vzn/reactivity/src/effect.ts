import { batch } from "./batcher";
import { createComputation } from "./computation";
import { onCleanup, createDisposer, getDisposer } from "./disposer";
import { runWith, untrack } from "./context";

export function createInstantEffect<T>(fn: (v: T) => T, value: T): void;
export function createInstantEffect<T>(fn: (v?: T) => T | undefined): void;
export function createInstantEffect<T>(fn: (v?: T) => T, value?: T): void {
  let lastValue = value;

  function computationFn(value?: T) { runWith({ computation, disposer }, () => lastValue = fn(value)) }
  
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
  const disposer = getDisposer();
  // ? Effects are run "async" to not block current computations
  // ? and be able to interact with settled state of DOM
  queueMicrotask(() => runWith({ disposer }, () => createInstantEffect(fn, value)))
}

export function createSingleEffect<T>(fn: () => T) {
  createEffect(() => untrack(fn));
}