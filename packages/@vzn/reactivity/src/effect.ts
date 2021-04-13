import {
  createContainer,
  getContainer,
  runWithContainer,
  untrack
} from "./container";
import { cleanup } from "./disposer";

export function createInstantEffect<T>(fn: (v: T) => T, value: T): void;
export function createInstantEffect<T>(fn: (v?: T) => T | undefined): void;
export function createInstantEffect<T>(fn: (v?: T) => T, value?: T): void {
  let lastValue = value;

  function computation(value?: T) { lastValue = fn(value) }
  
  const container = createContainer(() => {
    container.dispose();
    runWithContainer(container, () => computation(lastValue));
  });
  
  try {
    runWithContainer(container, () => computation(lastValue));
  } finally {
    cleanup(container.dispose);
  }
}

export function createEffect<T>(fn: (v: T) => T, value: T): void;
export function createEffect<T>(fn: (v?: T) => T | undefined): void;
export function createEffect<T>(fn: (v?: T) => T, value?: T): void {
  const container = getContainer();
  queueMicrotask(() => runWithContainer(container, () => createInstantEffect(fn, value)))
}

export function createSingleEffect<T>(fn: () => T) {
  createEffect(() => untrack(fn));
}