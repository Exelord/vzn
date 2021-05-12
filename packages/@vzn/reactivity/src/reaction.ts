import { batch, scheduleAsync, schedule } from "./scheduler";
import { onCleanup } from "./disposer";
import { runWithOwner } from "./owner";
import { createQueue } from "./queue";

export function createReaction<T>(fn: (v: T) => T, value: T): void;
export function createReaction<T>(fn: (v?: T) => T | undefined): void;
export function createReaction<T>(fn: (v?: T) => T, value?: T): void {
  let lastValue = value;
  
  const disposer = createQueue();

  function computation() {
    schedule(disposer.flush);
    scheduleAsync(recompute);
  }
  
  function recompute() {
    runWithOwner({ computation, disposer }, () => lastValue = batch(() => fn(lastValue)))
  }

  try {
    recompute();
  } finally {
    onCleanup(disposer.flush);
  }
}
