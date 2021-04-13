import { untrack } from "./container";
import { runWithDisposer } from "./disposer";

export interface Queue {
  schedule(fn: () => void): void;
  flush(): void;
}

export function asyncRethrow<T>(fn: () => T): void {
  try {
    fn();
  } catch (error) {
    setTimeout(() => { throw error; })
  }
}

export function createQueue() {
  const queue = new Set<() => void>();

  function schedule(fn: () => void): void {
    queue.add(fn);
  }

  function flush(): void {
    const tasks = [...queue];
    
    queue.clear();
    
    tasks.forEach((fn) => asyncRethrow(() => runWithDisposer(undefined, () => untrack(fn))));
  }

  return Object.freeze({
    schedule,
    flush
  });
}