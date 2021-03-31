import {
  Computation,
  createContainer,
  getContainer,
  runWithContainer,
  untrack
} from "./container";

export function createInstantEffect<T>(fn: (v: T) => T, value: T): void;
export function createInstantEffect<T>(fn: (v?: T) => T | undefined): void;
export function createInstantEffect<T>(fn: (v?: T) => T, value?: T): void {
  let lastValue = value;

  function computation(value?: T) { lastValue = fn(value) }
  
  const container = createContainer(() => {
    container.dispose();
    runWithContainer(container, () => computation(lastValue));
  });
  
  runWithContainer(container, () => computation(lastValue));

  if (!getContainer()) {
    container.dispose();
  }
}

export function createEffect<T>(fn: (v: T) => T, value: T): void;
export function createEffect<T>(fn: (v?: T) => T | undefined): void;
export function createEffect<T>(fn: (v?: T) => T, value?: T): void {
  const container = getContainer();

  function computation() { runWithContainer(container, () => createInstantEffect(fn, value)); }

  if (container) {
    container.scheduleDelayed(computation);
  } else {
    computation();
  }
}

export function createSingleEffect<T>(fn: Computation<T>) {
  createEffect(() => untrack(fn));
}