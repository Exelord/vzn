import { Batcher, getBatcher, setBatcher } from "./batcher";
import { Computation, getComputation, setComputation } from "./computation";
import { createDisposer, Disposer, getDisposer, setDisposer } from "./disposer";

export function runWith<T>(owners: { disposer?: Disposer, computation?: Computation, batcher?: Batcher }, fn: () => T): T {
  const currentBatcher = getBatcher();
  const currentDisposer = getDisposer();
  const currentComputation = getComputation();

  setBatcher('batcher' in owners ? owners.batcher : currentBatcher);
  setDisposer('disposer' in owners ? owners.disposer : currentDisposer);
  setComputation('computation' in owners ? owners.computation : currentComputation);

  try {
    return fn();
  } finally {
    setComputation(currentComputation);
    setDisposer(currentDisposer);
    setBatcher(currentBatcher);
  }
}

export function untrack<T>(fn: () => T): T {
  return runWith({ computation: undefined }, fn);
}

export function root<T>(fn: (disposer: () => void) => T): T {
  const disposer = createDisposer();
  return runWith({ disposer, computation: undefined }, () => fn(disposer.flush));
}