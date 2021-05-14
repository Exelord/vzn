import { getOwner, runWithOwner } from "./owner";
import { createQueue } from "./queue";

export function onCleanup(fn: () => void): void {
  function cleanup() {
    const disposer = createQueue();

    try {
      runWithOwner({ disposer }, fn)
    } finally {
      disposer.flush();
    }
  }

  const { disposer } = getOwner();
  
  if (!disposer) {
    console.warn('Reactivity: Using onCleanup without root or disposer will never run it!')
    return;
  }
  
  disposer.schedule(cleanup);
}