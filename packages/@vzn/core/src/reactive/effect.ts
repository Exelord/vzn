import { subscribe, cleanup } from "../tracking";

export function effect<T>(fn: (prev?: T) => T, value?: T) {
  cleanup(subscribe(() => value = fn(value)));
}
