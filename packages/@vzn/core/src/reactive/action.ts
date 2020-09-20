import { action } from "mobx";

export function createAction<T>(fn: () => T) {
  return action(fn);
}