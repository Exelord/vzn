import { Computation } from "./computation";
import { createDisposer } from "./disposer";
import { Queue } from "./queue";

export interface Owner {
  batcher?: Queue
  disposer?: Queue
  computation?: Computation
}

let owner: Owner | undefined;

export function getOwner(): Owner {
  return owner || {};
}

export function runWithOwner<T>(newOwner: Owner, fn: () => T): T {
  const currentOwner = owner;

  owner = Object.freeze({ ...getOwner(), ...newOwner });

  try {
    return fn();
  } finally {
    owner = currentOwner;
  }
}

export function untrack<T>(fn: () => T): T {
  return runWithOwner({ computation: undefined }, fn);
}

export function root<T>(fn: (disposer: () => void) => T): T {
  const disposer = createDisposer();
  return runWithOwner({ disposer, computation: undefined }, () => fn(disposer.flush));
}