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
  const owners = new Set<Container>();
  compare ??= true;

  const getter = (): T | undefined => {
    const owner = getContainer();

    if (owner && !owners.has(owner)) {
      owners.add(owner);
      onCleanup(() => owners.delete(owner));
    }

    return currentValue;
  };

  const setter = (newValue: T): void => {
    if (typeof compare === 'function' && compare(currentValue, newValue)) return;
    if (compare === true && currentValue === newValue) return;

    currentValue = newValue;
    owners.forEach((owner) => owner.update());
  };

  return [getter, setter];
}