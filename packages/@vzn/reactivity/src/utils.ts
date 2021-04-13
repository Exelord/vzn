import { Computation, getComputation, setComputation } from "./computation";
import { Disposer, getDisposer, setDisposer } from "./disposer";

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
    
    tasks.forEach((fn) => asyncRethrow(() => runWith({ disposer: undefined, computation: undefined }, fn)));
  }

  return Object.freeze({
    schedule,
    flush
  });
}

export function asyncRethrow<T>(fn: () => T): void {
  try {
    fn();
  } catch (error) {
    setTimeout(() => { throw error; })
  }
}

export function runWith<T>(owners: { disposer?: Disposer, computation?: Computation }, fn: () => T): T {
  const currentComputation = getComputation();
  const currentDisposer = getDisposer();

  setComputation('computation' in owners ? owners.computation : currentComputation);
  setDisposer('disposer' in owners ? owners.disposer : currentDisposer);

  try {
    return fn();
  } finally {
    setComputation(currentComputation);
    setDisposer(currentDisposer);
  }
}

export function untrack<T>(fn: () => T): T {
  return runWith({ computation: undefined }, fn);
}