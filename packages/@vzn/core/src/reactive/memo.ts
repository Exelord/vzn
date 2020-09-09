import { observable, untracked, action } from "mobx";
import { createEffect } from "./effect";

export function createMemo<T>(fn: () => T, equal?: boolean) {
  const value = observable.box(untracked(fn));

  const update = action((result: T) => value.set(result));
  
  createEffect(prev => {
    const result = fn();
    
    if (!equal || prev !== result) update(result);
    
    return result;
  });

  return () => value.get();
}