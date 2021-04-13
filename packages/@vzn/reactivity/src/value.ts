import { Computation, getComputation } from "./computation";
import { cleanup } from "./disposer";

export function createValue<T>(): [() => T | undefined, <U extends T | undefined>(value?: U) => void];
export function createValue<T>(
  defaultValue: T,
  compare?: boolean | ((prev: T, next: T) => boolean),
): [() => T, (value: T) => void];
export function createValue<T>(
  defaultValue?: T,
  compare?: boolean | ((prev: T | undefined, next: T) => boolean),
): [() => T | undefined, (value: T) => void] {
  let currentValue = defaultValue;
  const computations = new Set<Computation>();
  compare ??= true;

  function getter(): T | undefined {
    const computation = getComputation();

    if (computation && !computations.has(computation)) {
      computations.add(computation);
      cleanup(() => computations.delete(computation));
    }

    return currentValue;
  }

  function setter(newValue: T): void {
    if (typeof compare === 'function' && compare(currentValue, newValue)) return;
    if (compare === true && currentValue === newValue) return;

    currentValue = newValue;
    [...computations].forEach((computation) => computation.recompute());
  }

  return [getter, setter];
}