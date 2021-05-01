import { runWithOwner } from "./owner";

export interface Queue {
  schedule(fn: () => void): void;
  flush(): void;
}

export function createQueue(): Queue {
  const queue = new Set<() => void>();

  function schedule(fn: () => void): void {
    queue.add(fn);
  }

  function flush(): void {
    const tasks = [...queue];
    queue.clear();
    
    runWithOwner({ disposer: undefined, computation: undefined }, () => {
      tasks.forEach((fn) => {
        try {
          fn();
        } catch (error) {
          setTimeout(() => { throw error; })
        }
      });
    })
  }

  return Object.freeze({
    schedule,
    flush
  });
}
