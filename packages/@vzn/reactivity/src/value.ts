import { Container, onCleanup, getContainer } from "./container";

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
  const containers = new Set<Container>();
  compare ??= true;

  function getter(): T | undefined {
    const container = getContainer();

    if (container && !containers.has(container)) {
      containers.add(container);
      onCleanup(() => containers.delete(container));
    }

    return currentValue;
  }

  function setter(newValue: T): void {
    if (typeof compare === 'function' && compare(currentValue, newValue)) return;
    if (compare === true && currentValue === newValue) return;

    currentValue = newValue;
    [...containers].forEach((container) => container.recompute());
  }

  return [getter, setter];
}