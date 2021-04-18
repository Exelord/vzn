import { batch } from "./batcher";
import { runWith } from "./utils";

export interface Queue {
  schedule(fn: () => void): void;
  flush(): void;
}

export function createQueue() {
  const queue = new Set<() => void>();

  function schedule(fn: () => void): void {
    queue.add(fn);
  }

  function flush(): void {
    const tasks = [...queue];
    
    queue.clear();
    
    tasks.forEach((fn) => asyncRethrow(() => runWith({ disposer: undefined, computation: undefined }, () => batch(fn))));
  }

  return Object.freeze({
    schedule,
    flush
  });
}

export function asyncRethrow<T>(fn: () => T): void {
  try {
    fn();
  } catch (error) {
    setTimeout(() => { throw error; })
  }
}

