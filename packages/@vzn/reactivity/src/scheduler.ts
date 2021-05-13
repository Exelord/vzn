import { createQueue } from "./queue";

const scheduler = createQueue();

export function schedule<T>(computation: () => T) {
  scheduler.schedule(computation);

  if (scheduler.size === 1) {
    queueMicrotask(scheduler.flush);
  }
}