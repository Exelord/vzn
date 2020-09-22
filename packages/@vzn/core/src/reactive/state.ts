import { observable } from "mobx";

export function createState<T>(initializer: () => T): T {
  return observable(initializer(), {}, { autoBind: true })
}