import { getOwner } from "./owner";

export function onCleanup(fn: () => void): void {
  const { disposer } = getOwner();
  
  if (!disposer) {
    throw new Error('Reactivity: Scheduling onCleanup without root or parent will never run it!')
  }
  
  disposer.schedule(fn);
}
