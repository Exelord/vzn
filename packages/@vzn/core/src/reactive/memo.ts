import { computed } from "mobx";
import { createOwner, setOwner, getOwner, onCleanup } from "./owner";

export function createMemo<T>(fn: () => T, equal?: boolean) {
  const owner = createOwner();
  onCleanup(() => owner.destroy());

  const computedFn = computed(() => {
    owner.dispose();

    const currentOwner = getOwner()
    
    setOwner(owner);
    const result = fn();
    setOwner(currentOwner);

    return result;
  });

  return () => computedFn.get();
}

// old fn
// export function createMemo<T>(fn: () => T, equal?: boolean) {
//   const value = observable.box();

//   const update = action((result: T) => value.set(result));
  
//   createEffect(prev => {
//     const result = fn();
    
//     if (!equal || prev !== result) update(result);
    
//     return result;
//   });

//   return () => value.get();
// }