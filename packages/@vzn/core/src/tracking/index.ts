import { createSignal, batch } from "solid-js";

// tracked

const SIGNALED_OBJECTS = new WeakMap();

export function tracked<T = unknown>(
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

// ACTION

const BINDINGS_MAP = new WeakMap();

export function action(
  target: Object,
  key: string | symbol,
  descriptor: PropertyDescriptor
): any {
  const actionFn = descriptor.value;

  return {
    get() {
      if (!BINDINGS_MAP.has(this)) BINDINGS_MAP.set(this, new Map());
      const bindings = BINDINGS_MAP.get(this);

      if (!bindings.has(actionFn))
        bindings.set(actionFn, (...args: any[]) =>
          batch(() => actionFn.call(this, ...args))
        );

      const fn = bindings.get(actionFn);

      return fn;
    }
  };
}
