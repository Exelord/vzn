import { createQueue, Queue } from "./queue";

let scheduler: Queue | undefined;
let asyncScheduler: Queue | undefined;

function flushAsyncScheduler() {
  const queue = asyncScheduler;
  asyncScheduler = undefined;
  queue?.flush();
}

export function schedule<T>(computation: () => T) {
  scheduler ? scheduler.schedule(computation) : computation();
}

export function scheduleAsync<T>(computation: () => T) {
  if (!asyncScheduler) {
    asyncScheduler = createQueue();
    queueMicrotask(flushAsyncScheduler);
  }

  asyncScheduler.schedule(computation);
}

export function batch<T>(computation: () => T): T {
  if (scheduler) return computation();

  const queue = createQueue();
  
  try {
    scheduler = queue;
    return computation();
  } finally {
    scheduler = undefined;
    queue.flush();
  }
}
