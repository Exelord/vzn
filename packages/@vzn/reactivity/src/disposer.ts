import { getOwner } from "./owner";
import { createQueue } from "./queue";

const disposer = createQueue();

export function onCleanup(fn: () => void): void {
  (getOwner().disposer || disposer).schedule(fn);

  if (disposer.size === 1) {
    setTimeout(disposer.flush);
  }
}