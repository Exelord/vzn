import { Computation, getComputation, setComputation } from "./computation";
import { createDisposer, Disposer, getDisposer, setDisposer } from "./disposer";

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

export function root<T>(fn: (disposer: () => void) => T): T {
  const disposer = createDisposer();
  return runWith({ disposer, computation: undefined }, () => fn(disposer.flush));
}