import { AnnotationsMap, makeAutoObservable, observable } from "mobx";

export function createState<T extends Object>(initializer: () => T, annotations?: AnnotationsMap<T, never>) {
  return observable(initializer(), annotations, { autoBind: true });
}

export function makeState<T extends Object>(target: T, annotations?: AnnotationsMap<T, never>) {
  return makeAutoObservable(target, annotations, { autoBind: true });
}