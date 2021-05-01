import { batch } from "./batch";
import { untrack } from "./owner";
import { onCleanup } from "./disposer";
import { getOwner, runWithOwner } from "./owner";
import { createQueue } from "./queue";

export function createInstantEffect<T>(fn: (v: T) => T, value: T): void;
export function createInstantEffect<T>(fn: (v?: T) => T | undefined): void;
export function createInstantEffect<T>(fn: (v?: T) => T, value?: T): void {
  let lastValue = value;
  const disposer = createQueue();

  function compute(value?: T) {
    runWithOwner({ computation, disposer }, () => lastValue = batch(() => fn(value)))
  }

  function recompute() {
    disposer.flush();
    compute(lastValue);
  }

  function computation() {
    const { batcher } = getOwner();

    if (batcher) {
      batcher.schedule(recompute);
    } else {
      recompute();
    }
  };

  try {
    compute(lastValue);
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