import { getOwner } from "./owner";
import { schedule } from "./scheduler";

export function onCleanup(fn: () => void): void {
  const { disposer } = getOwner();
  disposer ? disposer.schedule(fn) : schedule(fn);
}
