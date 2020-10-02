import { AnnotationsMap, makeAutoObservable as mobxMakeAutoObservable, observable as mobxObservable, action } from "mobx";

export function createState<T extends Object>(initializer: () => T, annotations?: AnnotationsMap<T, never>) {
  return mobxObservable(initializer(), annotations, { autoBind: true });
}

export function makeState<T extends Object>(target: T, annotations?: AnnotationsMap<T, never>) {
  return mobxMakeAutoObservable(target, annotations, { autoBind: true });
}

export {
  action as createAction
}