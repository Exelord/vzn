import { Container, cleanup, getContainer } from "./container";

export function value<T>(defaultValue: T): [() => T, (value: T) => void] {
  let currentValue = defaultValue;
  const owners = new Set<Container>();

  const getter = (): T => {
    const owner = getContainer();

    if (owner && !owners.has(owner)) {
      owners.add(owner);
      cleanup(() => owners.delete(owner));
    }

    return currentValue;
  };

  const setter = (newValue: T): void => {
    currentValue = newValue;
    owners.forEach((owner) => owner.update());
  };

  return [getter, setter];
}
