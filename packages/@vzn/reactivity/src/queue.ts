import { runWithOwner } from "./owner";

export interface Queue {
  schedule(fn: () => void): void;
  flush(): void;
}

export function createQueue(): Queue {
  const queue = new Set<() => void>();

  function schedule(task: () => void): void {
    queue.add(task);
  }

  function flush(): void {
    if (!queue.size) return;

    const tasks = [...queue];
    queue.clear();

    runWithOwner({ disposer: undefined, computation: undefined }, () => {
      for (const task of tasks) {
        try {
          task();
        } catch (error) {
          setTimeout(() => { throw error; })
        }
      }
    })
  }

  return Object.freeze({
    schedule,
    flush
  });
}
