import { makeAutoObservable } from "mobx";

export interface StateFunction<T> {
  (...args: any): T;
}

export interface StateConstructor<T> {
  new(...args: any): T
}

export type StateType<T> = StateFunction<T> | StateConstructor<T>;

function isClass(func: any) {
  return typeof func === 'function' && /^class\s/.test(Function.prototype.toString.call(func));
}

export function createState<T>(stateCreator: StateType<T>, args: any[] = []): T {
  const state = isClass(stateCreator) ? new (stateCreator as StateConstructor<T>)(...args) : (stateCreator as StateFunction<T>)(...args);
  return makeAutoObservable(state, {}, { autoBind: true })
}