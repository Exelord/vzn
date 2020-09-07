import { makeAutoObservable } from "mobx";

export function createState<T extends Object>(target: T): T {
  return makeAutoObservable(target, {}, { autoBind: true })
}