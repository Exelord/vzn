import { batch } from "solid-js";

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
