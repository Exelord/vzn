import { observable, action } from "mobx";
import { createEffect } from "./effect";

export function createMemo<T>(fn: () => T, equal?: boolean) {
  const value = observable.box();

  const update = action((result: T) => value.set(result));
  
  createEffect(prev => {
    const result = fn();
    
    if (!equal || prev !== result) update(result);
    
    return result;
  });

  return () => value.get();
}

// ? Consider new approach?
// export function createMemo<T>(fn: () => T, equal?: boolean) {
//   const owner = createOwner();

//   const computedFn = computed(() => {
//     owner.dispose();

//     let result;
//     const currentOwner = getOwner()
    
//     setOwner(owner);
//     result = fn();
//     setOwner(currentOwner);

//     return result;
//   })

//   onCleanup(() => owner.destroy());

//   return () => computedFn.get();
// }