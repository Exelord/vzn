import { createSignal } from "solid-js";

const SIGNALED_OBJECTS = new WeakMap();

export function signal<T = unknown>(
  target: Object,
  key: string | symbol,
  descriptor?: PropertyDescriptor
): any {
  if (!SIGNALED_OBJECTS.has(target)) SIGNALED_OBJECTS.set(target, new Map());
  const targetCache = SIGNALED_OBJECTS.get(target);

  // @ts-ignore
  if (!targetCache.has(key)) targetCache.set(key, createSignal<T>((descriptor?.initializer())));
  const [getter, setter] = targetCache.get(key);

  return {
    enumerable: true,
    configurable: true,
    get(): T {
      return getter();
    },

    set(newValue: T): void {
      setter(newValue);
    }
  };
}