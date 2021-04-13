import { Container, getContainer, setContainer } from "./container";
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
    
    tasks.forEach((fn) => asyncRethrow(() => runWith({ disposer: undefined, container: undefined }, fn)));
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

export function runWith<T>(owners: { disposer?: Disposer, container?: Container }, fn: () => T): T {
  const currentContainer = getContainer();
  const currentDisposer = getDisposer();

  setContainer('container' in owners ? owners.container : currentContainer);
  setDisposer('disposer' in owners ? owners.disposer : currentDisposer);

  try {
    return fn();
  } finally {
    setContainer(currentContainer);
    setDisposer(currentDisposer);
  }
}

export function untrack<T>(fn: () => T): T {
  return runWith({ container: undefined }, fn);
}