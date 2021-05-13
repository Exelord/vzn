import { createQueue, Queue } from "./queue";

let scheduler: Queue | undefined;

function flushScheduler() {
  const queue = scheduler;
  scheduler = undefined;
  queue?.flush();
}

export function schedule<T>(computation: () => T) {
  if (!scheduler) {
    scheduler = createQueue();
    queueMicrotask(flushScheduler);
  }

  scheduler.schedule(computation);
}