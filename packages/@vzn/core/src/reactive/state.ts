import { makeAutoObservable } from "mobx";

export interface State<T> {
  (...args: any): T;
}

export function createState<T extends Object>(stateCreator: State<T>): T {
  return makeAutoObservable(stateCreator(), {}, { autoBind: true })
}