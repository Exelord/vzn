import {
  createContainer,
  runWithContainer,
  untrack
} from "./container";
import { cleanup, createDisposer, getDisposer, runWithDisposer } from "./disposer";

export function createInstantEffect<T>(fn: (v: T) => T, value: T): void;
export function createInstantEffect<T>(fn: (v?: T) => T | undefined): void;
export function createInstantEffect<T>(fn: (v?: T) => T, value?: T): void {
  let lastValue = value;

  function computation(value?: T) { lastValue = fn(value) }
  
  const disposer = createDisposer();
  const container = createContainer(() => {
    disposer.flush();
    runWithDisposer(disposer, () => runWithContainer(container, () => computation(lastValue)));
  });
  
  try {
    runWithDisposer(disposer, () => runWithContainer(container, () => computation(lastValue)));
  } finally {
    cleanup(disposer.flush);
  }
}

export function createEffect<T>(fn: (v: T) => T, value: T): void;
export function createEffect<T>(fn: (v?: T) => T | undefined): void;
export function createEffect<T>(fn: (v?: T) => T, value?: T): void {
  const disposer = getDisposer();
  queueMicrotask(() => runWithDisposer(disposer, () => createInstantEffect(fn, value)))
}

export function createSingleEffect<T>(fn: () => T) {
  createEffect(() => untrack(fn));
}