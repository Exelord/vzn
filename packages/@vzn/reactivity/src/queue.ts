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
    
    tasks.forEach((fn) => fn());
  }

  return Object.freeze({
    schedule,
    flush
  });
}
